"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/firebase/client";
import { isFirebaseConfigured } from "@/firebase/config";
import { syncShoppingGate } from "@/lib/shopping-gate";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCompareStore } from "@/store/compare-store";
import { useRecentStore } from "@/store/recent-store";
import type { UserProfile } from "@/types";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  firebaseReady: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function parseAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const firebaseReady = isFirebaseConfigured();
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  const loadProfile = useCallback(
    async (u: User) => {
      if (!db) {
        setProfile({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          role: parseAdminEmails().includes((u.email ?? "").toLowerCase())
            ? "admin"
            : "user",
        });
        return;
      }
      const ref = doc(db, "users", u.uid);
      const emailLower = (u.email ?? "").toLowerCase();
      const envAdmin = parseAdminEmails().includes(emailLower);
      const fallbackRole = envAdmin ? "admin" : "user";

      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as Partial<UserProfile>;
          if (envAdmin && data.role !== "admin") {
            await setDoc(ref, { role: "admin" }, { merge: true });
          }
          setProfile({
            uid: u.uid,
            email: u.email,
            displayName: data.displayName ?? u.displayName,
            photoURL: data.photoURL ?? u.photoURL,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            role: envAdmin ? "admin" : data.role,
          });
        } else {
          await setDoc(
            ref,
            {
              uid: u.uid,
              email: u.email,
              displayName: u.displayName,
              photoURL: u.photoURL,
              role: fallbackRole,
              createdAt: serverTimestamp(),
            },
            { merge: true },
          );
          setProfile({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
            role: fallbackRole,
          });
        }
      } catch {
        setProfile({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          role: fallbackRole,
        });
      }
    },
    [db],
  );

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    void setPersistence(auth, browserLocalPersistence);
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await loadProfile(u);
      else setProfile(null);
      setLoading(false);
    });
    return () => unsub();
  }, [auth, loadProfile]);

  /** Guest persisted carts must not apply when Firebase auth is required. */
  useEffect(() => {
    if (!firebaseReady || loading) return;
    if (user) return;
    useCartStore.getState().clear();
    useWishlistStore.getState().clear();
    useCompareStore.getState().clear();
    useRecentStore.getState().clear();
  }, [firebaseReady, loading, user]);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user);
  }, [loadProfile, user]);

  const signInEmail = useCallback(
    async (email: string, password: string) => {
      if (!auth) throw new Error("Firebase is not configured");
      await signInWithEmailAndPassword(auth, email, password);
    },
    [auth],
  );

  const signUpEmail = useCallback(
    async (email: string, password: string, displayName: string) => {
      if (!auth) throw new Error("Firebase is not configured");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      if (db) {
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          email,
          displayName,
          photoURL: cred.user.photoURL,
          role: parseAdminEmails().includes(email.toLowerCase()) ? "admin" : "user",
          createdAt: serverTimestamp(),
        });
      }
    },
    [auth, db],
  );

  const signInGoogle = useCallback(async () => {
    if (!auth) throw new Error("Firebase is not configured");
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    if (db) {
      const ref = doc(db, "users", cred.user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName,
          photoURL: cred.user.photoURL,
          role: parseAdminEmails().includes(
            (cred.user.email ?? "").toLowerCase(),
          )
            ? "admin"
            : "user",
          createdAt: serverTimestamp(),
        });
      }
    }
  }, [auth, db]);

  const resetPassword = useCallback(
    async (email: string) => {
      if (!auth) throw new Error("Firebase is not configured");
      await sendPasswordResetEmail(auth, email);
    },
    [auth],
  );

  const logout = useCallback(async () => {
    if (!auth) return;
    await signOut(auth);
  }, [auth]);

  const isAdmin =
    profile?.role === "admin" ||
    (!!user?.email &&
      parseAdminEmails().includes(user.email.toLowerCase()));

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      firebaseReady,
      signInEmail,
      signUpEmail,
      signInGoogle,
      resetPassword,
      logout,
      refreshProfile,
      isAdmin,
    }),
    [
      user,
      profile,
      loading,
      firebaseReady,
      signInEmail,
      signUpEmail,
      signInGoogle,
      resetPassword,
      logout,
      refreshProfile,
      isAdmin,
    ],
  );

  syncShoppingGate({
    firebaseReady,
    loading,
    hasUser: Boolean(user),
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
