"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "firebase/auth";
import { isFirebaseConfigured } from "@/firebase/config";
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

async function getAuthClient() {
  const [{ getFirebaseAuth }, authModule] = await Promise.all([
    import("@/firebase/client"),
    import("firebase/auth"),
  ]);
  return { auth: getFirebaseAuth(), authModule };
}

async function getFirestoreClient() {
  const [{ getFirebaseDb }, firestoreModule] = await Promise.all([
    import("@/firebase/client"),
    import("firebase/firestore"),
  ]);
  return { db: getFirebaseDb(), firestoreModule };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [adminClaim, setAdminClaim] = useState(false);
  const [loading, setLoading] = useState(true);

  const firebaseReady = isFirebaseConfigured();

  const loadProfile = useCallback(
    async (u: User) => {
      const { db, firestoreModule } = await getFirestoreClient();
      if (!db) {
        setProfile({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          role: "user",
        });
        return;
      }
      const { doc, getDoc, serverTimestamp, setDoc } = firestoreModule;
      const ref = doc(db, "users", u.uid);

      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as Partial<UserProfile>;
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
            role: data.role === "admin" ? "admin" : "user",
          });
        } else {
          await setDoc(
            ref,
            {
              uid: u.uid,
              email: u.email,
              displayName: u.displayName,
              photoURL: u.photoURL,
              role: "user",
              createdAt: serverTimestamp(),
            },
            { merge: true },
          );
          setProfile({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
            role: "user",
          });
        }
      } catch {
        setProfile({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          role: "user",
        });
      }
    },
    [],
  );

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function listenForUser() {
      const { auth, authModule } = await getAuthClient();
      if (cancelled) return;
      if (!auth) {
        setLoading(false);
        return;
      }

      const { browserLocalPersistence, onAuthStateChanged, setPersistence } = authModule;
      void setPersistence(auth, browserLocalPersistence);
      unsubscribe = onAuthStateChanged(auth, async (u) => {
        setUser(u);
        if (u) {
          const token = await u.getIdTokenResult().catch(() => null);
          if (cancelled) return;
          setAdminClaim(token?.claims.admin === true);
          await loadProfile(u);
        } else {
          setAdminClaim(false);
          setProfile(null);
        }
        setLoading(false);
      });
    }

    void listenForUser();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [firebaseReady, loadProfile]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const token = await user.getIdTokenResult(true).catch(() => null);
      setAdminClaim(token?.claims.admin === true);
      await loadProfile(user);
    }
  }, [loadProfile, user]);

  const signInEmail = useCallback(
    async (email: string, password: string) => {
      const { auth, authModule } = await getAuthClient();
      if (!auth) throw new Error("Firebase is not configured");
      await authModule.signInWithEmailAndPassword(auth, email, password);
    },
    [],
  );

  const signUpEmail = useCallback(
    async (email: string, password: string, displayName: string) => {
      const { auth, authModule } = await getAuthClient();
      if (!auth) throw new Error("Firebase is not configured");
      const cred = await authModule.createUserWithEmailAndPassword(auth, email, password);
      await authModule.updateProfile(cred.user, { displayName });
      const { db, firestoreModule } = await getFirestoreClient();
      if (db) {
        const { doc, serverTimestamp, setDoc } = firestoreModule;
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          email,
          displayName,
          photoURL: cred.user.photoURL,
          role: "user",
          createdAt: serverTimestamp(),
        });
      }
    },
    [],
  );

  const signInGoogle = useCallback(async () => {
    const { auth, authModule } = await getAuthClient();
    if (!auth) throw new Error("Firebase is not configured");
    const provider = new authModule.GoogleAuthProvider();
    const cred = await authModule.signInWithPopup(auth, provider);
    const { db, firestoreModule } = await getFirestoreClient();
    if (db) {
      const { doc, getDoc, serverTimestamp, setDoc } = firestoreModule;
      const ref = doc(db, "users", cred.user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName,
          photoURL: cred.user.photoURL,
          role: "user",
          createdAt: serverTimestamp(),
        });
      }
    }
  }, []);

  const resetPassword = useCallback(
    async (email: string) => {
      const { auth, authModule } = await getAuthClient();
      if (!auth) throw new Error("Firebase is not configured");
      await authModule.sendPasswordResetEmail(auth, email);
    },
    [],
  );

  const logout = useCallback(async () => {
    const { auth, authModule } = await getAuthClient();
    if (!auth) return;
    await authModule.signOut(auth);
  }, []);

  // Admin authorization is based only on a server-issued Firebase custom claim.
  // Public environment variables and editable profile documents are never trusted.
  const isAdmin = adminClaim;

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
