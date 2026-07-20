import type { Metadata } from "next";

export const SITE_NAME = "Mietaaf";
export const SITE_TITLE = "Mietaaf | Luxury Men's Ethnic & Formal";
export const SITE_DESCRIPTION =
  "Discover sherwanis, suits, indo-western, wedding and premium festive menswear. Crafted for the modern gentleman.";
export const SITE_DEFAULT_IMAGE = "/opengraph-image";

/**
 * Canonical origin for metadata, sitemap, and JSON-LD (no trailing slash).
 * - Production: set NEXT_PUBLIC_SITE_URL in Vercel, e.g. https://mietaaf.com.
 * - Preview: if unset, uses Vercel's deployment URL so OG/sitemap match the deployment.
 * - Local: http://localhost:3000 when neither is set.
 */
function normalizeSiteUrl(value: string | undefined): string | null {
  const raw = value?.trim().replace(/\/$/, "");
  if (!raw) return null;

  const localHostPattern = /^(localhost|127\.0\.0\.1)(:\d+)?$/i;
  const candidate = /^https?:\/\//i.test(raw)
    ? raw
    : localHostPattern.test(raw)
      ? `http://${raw}`
      : `https://${raw}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  return (
    normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeSiteUrl(process.env.VERCEL_URL) ??
    normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    "http://localhost:3000"
  );
}

const base = getSiteUrl();

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

function isIndexingDisabled(): boolean {
  return (
    process.env.VERCEL_ENV === "preview" ||
    process.env.NEXT_PUBLIC_INDEXING_DISABLED === "true"
  );
}

type PublicPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function publicPageMetadata({
  title,
  description,
  path,
  image = SITE_DEFAULT_IMAGE,
}: PublicPageMetadataInput): Metadata {
  const imageUrl = absoluteUrl(image);
  const imageEntry =
    image === SITE_DEFAULT_IMAGE
      ? { url: imageUrl, width: 1200, height: 630, alt: SITE_NAME }
      : { url: imageUrl, alt: title };
  return {
    title,
    description,
    alternates: { canonical: path || "/" },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: title === SITE_NAME ? SITE_TITLE : `${title} | ${SITE_NAME}`,
      description,
      url: path || "/",
      images: [imageEntry],
    },
    twitter: {
      card: "summary_large_image",
      title: title === SITE_NAME ? SITE_TITLE : `${title} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  };
}

export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(base),
    applicationName: SITE_NAME,
    title: {
      default: SITE_TITLE,
      template: "%s | Mietaaf",
    },
    description: SITE_DESCRIPTION,
    keywords: [
      "men ethnic wear",
      "sherwani",
      "wedding collection",
      "luxury menswear India",
      "Mietaaf",
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "fashion",
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title: SITE_TITLE,
      description:
        "Premium men's ethnic and formal clothing for weddings, festive occasions, and refined tailoring.",
      url: base,
      images: [
        {
          url: SITE_DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: SITE_TITLE,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: "Luxury men's ethnic and formal fashion.",
      images: [SITE_DEFAULT_IMAGE],
    },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
    robots: isIndexingDisabled() ? noIndexMetadata.robots : undefined,
  };
}

export function pageTitle(title: string): Metadata {
  return { title };
}

export function homePageMetadata(): Metadata {
  return publicPageMetadata({
    title: "Luxury Men's Ethnic & Formal",
    description:
      "Sherwani, suits, indo-western, wedding and premium menswear from the Mietaaf atelier experience.",
    path: "/",
  });
}
