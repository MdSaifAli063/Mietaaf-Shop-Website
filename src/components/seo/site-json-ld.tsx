import { absoluteUrl, getSiteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/seo";
import { SITE_ADDRESS_SCHEMA_POSTAL, SITE_EMAIL_DISPLAY, SITE_GOOGLE_MAPS_URL, SITE_PHONE_E164_PLUS, SITE_GOOGLE_BUSINESS_PROFILE_URL } from "@/lib/site-contact";
import { SITE_MONOGRAM_URL } from "@/lib/site-logo";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import { JsonLdScript } from "./json-ld";

function validHttpUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** Shared identity for the business, studio, and first-party pages. */
export function SiteJsonLd() {
  const base = getSiteUrl();
  const sameAs = [
    SITE_GOOGLE_BUSINESS_PROFILE_URL,
    validHttpUrl(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || DEFAULT_SITE_SETTINGS.instagramUrl),
    validHttpUrl(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || DEFAULT_SITE_SETTINGS.facebookUrl),
    validHttpUrl(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || DEFAULT_SITE_SETTINGS.linkedinUrl),
  ].filter((url): url is string => Boolean(url));
  return <JsonLdScript data={{
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OnlineStore",
        "@id": `${base}/#organization`,
        name: SITE_NAME,
        alternateName: "Mietaaf",
        url: `${base}/`,
        logo: { "@type": "ImageObject", url: absoluteUrl(SITE_MONOGRAM_URL), width: 512, height: 512, caption: SITE_NAME },
        image: absoluteUrl("/about/about-atelier-fitting.webp"),
        description: SITE_DESCRIPTION,
        slogan: "Your Presence, Our Craft.",
        email: SITE_EMAIL_DISPLAY,
        telephone: SITE_PHONE_E164_PLUS,
        address: SITE_ADDRESS_SCHEMA_POSTAL,
        sameAs,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: SITE_PHONE_E164_PLUS,
          email: SITE_EMAIL_DISPLAY,
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: ["en"],
          url: absoluteUrl("/contact"),
        },
      },
      {
        "@type": "ClothingStore",
        "@id": `${base}/#bengaluru-studio`,
        name: SITE_NAME,
        alternateName: "Mietaaf Bengaluru Studio",
        description: "Mietaaf Couture's appointment-based menswear studio in Shivaji Nagar, Bengaluru (Bangalore), for custom-tailored suits, sherwanis, wedding outfits and personal fittings.",
        url: absoluteUrl("/contact"),
        image: absoluteUrl("/about/about-atelier-fitting.webp"),
        parentOrganization: { "@id": `${base}/#organization` },
        telephone: SITE_PHONE_E164_PLUS,
        email: SITE_EMAIL_DISPLAY,
        address: SITE_ADDRESS_SCHEMA_POSTAL,
        hasMap: SITE_GOOGLE_MAPS_URL,
        areaServed: { "@type": "City", name: "Bengaluru", alternateName: "Bangalore" },
        sameAs,
      },
    ],
  }} />;
}

/** Google's preferred site-name signal belongs on the canonical home page. */
export function WebsiteJsonLd() {
  const base = getSiteUrl();
  return <JsonLdScript data={{
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        name: SITE_NAME,
        alternateName: "Mietaaf",
        url: `${base}/`,
        inLanguage: "en-IN",
        publisher: { "@id": `${base}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${base}/#webpage`,
        url: `${base}/`,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${base}/#website` },
        about: { "@id": `${base}/#organization` },
        mainEntity: { "@id": `${base}/#bengaluru-studio` },
      },
    ],
  }} />;
}
