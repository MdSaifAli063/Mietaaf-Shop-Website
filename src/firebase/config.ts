import type { FirebasePublicClientConfig } from "@/firebase/server-public-config";

declare global {
  interface Window {
    __MIETAAF_FIREBASE__?: FirebasePublicClientConfig | null;
  }
}

/** Client bundle: only NEXT_PUBLIC_* are inlined; FIREBASE_* is undefined here. */
function env(...keys: string[]): string {
  for (const k of keys) {
    const v = process.env[k];
    if (typeof v === "string") {
      let t = v.trim().replace(/^\uFEFF/, "");
      if (t.length >= 2) {
        const q = t[0];
        if ((q === '"' || q === "'") && t[t.length - 1] === q) {
          t = t.slice(1, -1).trim();
        }
      }
      if (t.length > 0) return t;
    }
  }
  return "";
}

function fromWindow(): FirebasePublicClientConfig | null {
  if (typeof window === "undefined") return null;
  const w = window.__MIETAAF_FIREBASE__;
  if (!w || typeof w !== "object") return null;
  const { apiKey, authDomain, projectId } = w;
  if (
    typeof apiKey === "string" &&
    typeof authDomain === "string" &&
    typeof projectId === "string" &&
    apiKey.trim() &&
    authDomain.trim() &&
    projectId.trim()
  ) {
    return {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: typeof w.storageBucket === "string" ? w.storageBucket.trim() : "",
      messagingSenderId:
        typeof w.messagingSenderId === "string" ? w.messagingSenderId.trim() : "",
      appId: typeof w.appId === "string" ? w.appId.trim() : "",
    };
  }
  return null;
}

/** Runtime config for `initializeApp` (window bootstrap first, then NEXT_PUBLIC_*). */
export function getFirebaseEnv(): FirebasePublicClientConfig {
  const w = fromWindow();
  if (w) return w;

  return {
    apiKey: env(
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "FIREBASE_API_KEY",
      "REACT_APP_FIREBASE_API_KEY",
    ),
    authDomain: env(
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      "FIREBASE_AUTH_DOMAIN",
      "REACT_APP_FIREBASE_AUTH_DOMAIN",
    ),
    projectId: env(
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "FIREBASE_PROJECT_ID",
      "REACT_APP_FIREBASE_PROJECT_ID",
    ),
    storageBucket: env(
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      "FIREBASE_STORAGE_BUCKET",
      "REACT_APP_FIREBASE_STORAGE_BUCKET",
    ),
    messagingSenderId: env(
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      "FIREBASE_MESSAGING_SENDER_ID",
      "REACT_APP_FIREBASE_MESSAGING_SENDER_ID",
    ),
    appId: env(
      "NEXT_PUBLIC_FIREBASE_APP_ID",
      "FIREBASE_APP_ID",
      "REACT_APP_FIREBASE_APP_ID",
    ),
  };
}

export function isFirebaseConfigured(): boolean {
  const c = getFirebaseEnv();
  return Boolean(c.apiKey && c.authDomain && c.projectId);
}