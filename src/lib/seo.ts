import type { Metadata } from "next";

export const SITE_NAME = "Mietaaf Couture";
export const SITE_ORIGIN = "https://www.mietaaf.com";
export const SITE_TITLE = "Mietaaf Couture | Custom-Tailored Menswear in Bangalore";
export const SITE_DESCRIPTION =
  "Discover Mietaaf Couture in Bangalore (Bengaluru): custom-tailored suits, sherwanis and wedding menswear. Book a studio fitting or doorstep consultation. Order via WhatsApp.";
export const SITE_DEFAULT_IMAGE = "/opengraph-image";
export const SITE_KEYWORDS = [
  "Mietaaf Couture", "Mietaaf Couture Bangalore", "Mietaaf Couture Bengaluru",
  "custom-tailored suits Bangalore", "wedding menswear Bangalore", "sherwani Bangalore",
  "men's ethnic and formal wear",
];

/** Keep canonical URLs on one production origin, including on preview builds. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return SITE_ORIGIN;
  try {
    if (/^[a-z][a-z\d+.-]*:\/\//i.test(raw) && !/^https?:\/\//i.test(raw)) return SITE_ORIGIN;
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return SITE_ORIGIN;
    const local = /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(url.hostname);
    if (local && process.env.NODE_ENV !== "development") return SITE_ORIGIN;
    if (/^(www\.)?mietaaf\.com$/i.test(url.hostname)) return SITE_ORIGIN;
    return url.origin;
  } catch {
    return SITE_ORIGIN;
  }
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`, `${getSiteUrl()}/`).href;
}

export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export function isIndexingDisabled(): boolean {
  return process.env.VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_INDEXING_DISABLED === "true";
}

export function publicRobots(): Metadata["robots"] {
  return isIndexingDisabled() ? noIndexMetadata.robots : {
    index: true,
    follow: true,
    googleBot: {
      index: true, follow: true, "max-image-preview": "large",
      "max-snippet": -1, "max-video-preview": -1,
    },
  };
}

type PublicPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
};

export function publicPageMetadata({ title, description, path, image = SITE_DEFAULT_IMAGE, keywords = [] }: PublicPageMetadataInput): Metadata {
  const imageUrl = absoluteUrl(image);
  const displayTitle = title === SITE_NAME || title === SITE_TITLE ? SITE_TITLE : `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    keywords: [...new Set([...SITE_KEYWORDS.slice(0, 3), ...keywords])],
    alternates: { canonical: absoluteUrl(path || "/") },
    robots: publicRobots(),
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title: displayTitle,
      description,
      url: absoluteUrl(path || "/"),
      images: [{
        url: imageUrl, alt: image === SITE_DEFAULT_IMAGE ? SITE_TITLE : title,
        ...(image === SITE_DEFAULT_IMAGE ? { width: 1200, height: 630 } : {}),
      }],
    },
    twitter: { card: "summary_large_image", title: displayTitle, description, images: [imageUrl] },
  };
}

export function rootMetadata(): Metadata {
  const page = publicPageMetadata({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/", keywords: SITE_KEYWORDS });
  return {
    ...page,
    alternates: undefined,
    metadataBase: new URL(getSiteUrl()),
    applicationName: SITE_NAME,
    title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
    authors: [{ name: SITE_NAME, url: getSiteUrl() }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "fashion",
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
        { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
      ],
      apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION.trim() }
      : undefined,
  };
}

export function pageTitle(title: string): Metadata {
  return { title };
}

export function homePageMetadata(): Metadata {
  return {
    ...publicPageMetadata({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/", keywords: SITE_KEYWORDS }),
    title: { absolute: SITE_TITLE },
  };
}
