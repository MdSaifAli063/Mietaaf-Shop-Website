/** Customer-facing phone (UI copy). */
export const SITE_PHONE_DISPLAY = "+91 74110 25321";

/** E.164 digits only (no +) — WhatsApp `wa.me` and `NEXT_PUBLIC_WHATSAPP_NUMBER` default. */
export const SITE_WHATSAPP_E164_DIGITS = "917411025321";

/** `tel:` and schema.org `telephone`. */
export const SITE_PHONE_E164_PLUS = "+917411025321";

export const SITE_ADDRESS_DISPLAY =
  "Dharmaraja Koil St, Shivaji Nagar, Bengaluru, Karnataka, India";

/** Public inbox for UI + mailto: links */
export const SITE_EMAIL_DISPLAY = "care@mietaaf.com";

/** Open in Maps app / browser (canonical search link). */
export const SITE_GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_ADDRESS_DISPLAY)}`;

/** Google Maps iframe (address query — no API key required). */
export function getSiteMapsEmbedSrc(): string {
  const q = encodeURIComponent(`${SITE_ADDRESS_DISPLAY}, India`);
  return `https://maps.google.com/maps?q=${q}&hl=en&z=16&output=embed`;
}

/** Organization / LocalBusiness PostalAddress fragment for JSON-LD. */
export const SITE_ADDRESS_SCHEMA_POSTAL = {
  "@type": "PostalAddress" as const,
  streetAddress: "Dharmaraja Koil St, Shivaji Nagar",
  addressLocality: "Bengaluru",
  addressRegion: "Karnataka",
  addressCountry: "IN",
};
