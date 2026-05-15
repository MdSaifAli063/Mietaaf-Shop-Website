/** Customer-facing phone (UI copy). */
export const SITE_PHONE_DISPLAY = "+91 74110 25321";

/** E.164 digits only (no +) — WhatsApp `wa.me` and `NEXT_PUBLIC_WHATSAPP_NUMBER` default. */
export const SITE_WHATSAPP_E164_DIGITS = "917411025321";

/** `tel:` and schema.org `telephone`. */
export const SITE_PHONE_E164_PLUS = "+917411025321";

export const SITE_ADDRESS_DISPLAY =
  "Dharmaraja Koil St, Shivaji Nagar, Bengaluru, Karnataka, India";

/** Organization / LocalBusiness PostalAddress fragment for JSON-LD. */
export const SITE_ADDRESS_SCHEMA_POSTAL = {
  "@type": "PostalAddress" as const,
  streetAddress: "Dharmaraja Koil St, Shivaji Nagar",
  addressLocality: "Bengaluru",
  addressRegion: "Karnataka",
  addressCountry: "IN",
};
