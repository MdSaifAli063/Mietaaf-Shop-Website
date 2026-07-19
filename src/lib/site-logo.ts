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
	"https://ik.imagekit.io/77nsbwefl/ChatGPT%20Image%20Jul%2014,%202026,%2007_56_57%20PM.png";
