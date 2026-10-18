/**
 * Sitewide logo image source.
 *
 * Set `NEXT_PUBLIC_SITE_LOGO_URL` to override this everywhere, or keep the
 * fallback below.
 *
 * Use either:
 * - A path in `public/` (starts with `/`), e.g. `/branding/my-logo.png`
 * - A full HTTPS URL, e.g. `https://cdn.example.com/logo.png`
 */
export const SITE_LOGO_URL =
	process.env.NEXT_PUBLIC_SITE_LOGO_URL?.trim() ||
	"/branding/mietaaf-logo.png";

/** Square monogram for browser icons, PWA installs, and Organization schema. */
export const SITE_MONOGRAM_URL = "/icon.png";

/** 1200 × 630 first-party card for Google, WhatsApp, and social previews. */
export const SITE_SOCIAL_CARD_URL = "/branding/mietaaf-social-card.png";

/** Same supplied artwork, resized for UI use; custom CMS logos retain their URL. */
export function displayLogoUrl(source: string): string {
  if (source === "/branding/mietaaf-logo.png") return "/branding/mietaaf-logo-display.webp";
  try {
    const url = new URL(source);
    if (url.hostname === "ik.imagekit.io" && url.pathname.startsWith("/77nsbwefl/") && /07[_:]56[_:]57/.test(decodeURIComponent(url.pathname))) return "/branding/mietaaf-logo-display.webp";
  } catch { /* Local/custom paths are supported unchanged. */ }
  return source;
}
