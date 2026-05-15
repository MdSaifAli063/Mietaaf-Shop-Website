import { getSiteUrl } from "@/lib/seo";
import { SITE_ADDRESS_SCHEMA_POSTAL, SITE_PHONE_E164_PLUS } from "@/lib/site-contact";

/** Organization + WebSite schema for rich results (server-rendered). */
export function SiteJsonLd() {
  const base = getSiteUrl();
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: "Mietaaf",
        url: base,
        telephone: SITE_PHONE_E164_PLUS,
        address: SITE_ADDRESS_SCHEMA_POSTAL,
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: "Mietaaf",
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
