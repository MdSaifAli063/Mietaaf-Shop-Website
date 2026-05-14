/** Routes that stay reachable without a signed-in Firebase user. */
export const AUTH_ONLY_PATHS = ["/login", "/signup", "/forgot-password"] as const;

export function isAuthOnlyPath(pathname: string): boolean {
  return AUTH_ONLY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/** Landing page: guests may view it; every other route still requires sign-in. */
export function isGuestHomePath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === "/";
}

/** Safe internal redirect target after login (same-origin path only). */
export function sanitizeReturnUrl(raw: string | null, fallback = "/"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return fallback;
  if (AUTH_ONLY_PATHS.some((p) => raw === p || raw.startsWith(`${p}?`))) return fallback;
  return raw;
}
