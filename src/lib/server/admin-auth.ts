import "server-only";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFirebaseEnvValue } from "@/firebase/server-public-config";
import { ApiError } from "@/lib/server/api";

export function getProjectId() {
  const projectId = readFirebaseEnvValue("FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_PROJECT_ID", "REACT_APP_FIREBASE_PROJECT_ID");
  if (!projectId) throw new ApiError(503, "The order service is temporarily unavailable.");
  return projectId;
}

export async function requireAdmin(request: Request) {
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer (\S+)$/i);
  if (!match || match[1].length > 16_384) throw new ApiError(401, "Please sign in again to continue.");
  const app = getApps().find((item) => item.name === "mietaaf-server-auth") ?? initializeApp({ projectId: getProjectId() }, "mietaaf-server-auth");
  try {
    // Verification checks Google's signature, issuer, audience and expiry. No
    // service-account private key is needed for ID-token verification.
    const claims = await getAuth(app).verifyIdToken(match[1]);
    if (claims.admin !== true) throw new ApiError(403, "Administrator access is required.");
    return { uid: claims.uid, token: match[1] };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Please sign in again to continue.");
  }
}
