/** Server-only: reads all Firebase web keys from process.env (any supported name). */

function trimVal(v: string): string {
  let t = v.trim().replace(/^\uFEFF/, "");
  if (t.length >= 2) {
    const q = t[0];
    if ((q === '"' || q === "'") && t[t.length - 1] === q) {
      t = t.slice(1, -1).trim();
    }
  }
  return t;
}

export function readFirebaseEnvValue(...keys: string[]): string {
  for (const k of keys) {
    const v = process.env[k];
    if (typeof v === "string") {
      const t = trimVal(v);
      if (t.length > 0) return t;
    }
  }
  return "";
}

export type FirebasePublicClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

/** Values safe to expose to the browser (Firebase web SDK is designed for this). */
export function getFirebasePublicClientConfig(): FirebasePublicClientConfig | null {
  const apiKey = readFirebaseEnvValue(
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "FIREBASE_API_KEY",
    "REACT_APP_FIREBASE_API_KEY",
  );
  const authDomain = readFirebaseEnvValue(
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "FIREBASE_AUTH_DOMAIN",
    "REACT_APP_FIREBASE_AUTH_DOMAIN",
  );
  const projectId = readFirebaseEnvValue(
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "FIREBASE_PROJECT_ID",
    "REACT_APP_FIREBASE_PROJECT_ID",
  );
  if (!apiKey || !authDomain || !projectId) return null;

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: readFirebaseEnvValue(
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      "FIREBASE_STORAGE_BUCKET",
      "REACT_APP_FIREBASE_STORAGE_BUCKET",
    ),
    messagingSenderId: readFirebaseEnvValue(
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      "FIREBASE_MESSAGING_SENDER_ID",
      "REACT_APP_FIREBASE_MESSAGING_SENDER_ID",
    ),
    appId: readFirebaseEnvValue(
      "NEXT_PUBLIC_FIREBASE_APP_ID",
      "FIREBASE_APP_ID",
      "REACT_APP_FIREBASE_APP_ID",
    ),
  };
}
