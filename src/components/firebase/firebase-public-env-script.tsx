import { getFirebasePublicClientConfig } from "@/firebase/server-public-config";

/**
 * Inlines Firebase web config from the server so the client always sees the same values
 * as `process.env` on the server (fixes keys only in `.env` without NEXT_PUBLIC_, Turbopack
 * env quirks, and next.config `env` overriding with empty strings).
 */
export function FirebasePublicEnvScript() {
  const cfg = getFirebasePublicClientConfig();
  if (!cfg) return null;

  const json = JSON.stringify(cfg).replace(/</g, "\\u003c");

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__MIETAAF_FIREBASE__=${json};`,
      }}
    />
  );
}
