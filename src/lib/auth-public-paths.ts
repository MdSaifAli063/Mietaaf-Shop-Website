/** Routes that stay reachable without a signed-in Firebase user. */
export const AUTH_ONLY_PATHS = ["/login", "/signup", "/forgot-password"] as const;

export function isAuthOnlyPath(pathname: string): boolean {
  return AUTH_ONLY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/** Checkout is the only storefront step that requires an account. */
export function isCheckoutPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === "/checkout" || pathname.startsWith("/checkout/");
}

/** Safe internal redirect target after login (same-origin path only). */
export function sanitizeReturnUrl(raw: string | null, fallback = "/"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return fallback;
  if (AUTH_ONLY_PATHS.some((p) => raw === p || raw.startsWith(`${p}?`))) return fallback;
  return raw;
}
