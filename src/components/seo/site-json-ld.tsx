import { getSiteUrl } from "@/lib/seo";
import {
  SITE_ADDRESS_SCHEMA_POSTAL,
  SITE_EMAIL_DISPLAY,
  SITE_GOOGLE_MAPS_URL,
  SITE_PHONE_E164_PLUS,
} from "@/lib/site-contact";
import { SITE_LOGO_URL } from "@/lib/site-logo";

function validHttpUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

/** Organization + WebSite schema for rich results (server-rendered). */
export function SiteJsonLd() {
  const base = getSiteUrl();
  const logo = SITE_LOGO_URL;
  const sameAs = [
    validHttpUrl(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM),
    validHttpUrl(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK),
    validHttpUrl(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN),
  ].filter((url): url is string => Boolean(url));

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OnlineStore",
        "@id": `${base}/#organization`,
        name: "Mietaaf",
        url: base,
        logo: /^https?:\/\//i.test(logo) ? logo : `${base}${logo}`,
        email: SITE_EMAIL_DISPLAY,
        telephone: SITE_PHONE_E164_PLUS,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: SITE_PHONE_E164_PLUS,
          email: SITE_EMAIL_DISPLAY,
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: "en",
        },
        sameAs: sameAs.length > 0 ? sameAs : undefined,
      },
      {
        "@type": "ClothingStore",
        "@id": `${base}/#bengaluru-studio`,
        name: "Mietaaf Bengaluru Studio",
        url: base,
        parentOrganization: { "@id": `${base}/#organization` },
        telephone: SITE_PHONE_E164_PLUS,
        email: SITE_EMAIL_DISPLAY,
        address: SITE_ADDRESS_SCHEMA_POSTAL,
        hasMap: SITE_GOOGLE_MAPS_URL,
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: "Mietaaf",
        alternateName: "MIETAAF",
        inLanguage: "en-IN",
        publisher: { "@id": `${base}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
