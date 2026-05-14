import type { Metadata } from "next";

/**
 * Canonical origin for metadata, sitemap, and JSON-LD (no trailing slash).
 * - Production: set `NEXT_PUBLIC_SITE_URL` in Vercel (e.g. https://mietaaf.com).
 * - Preview: if unset, uses `https://${VERCEL_URL}` so OG/sitemap match the deployment.
 * - Local: http://localhost:3000 when neither is set.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

const base = getSiteUrl();

export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(base),
    title: {
      default: "Mietaaf | Luxury Men’s Ethnic & Formal",
      template: "%s | Mietaaf",
    },
    description:
      "Discover sherwanis, suits, indo-western, wedding and premium festive menswear. Crafted for the modern gentleman.",
    keywords: [
      "men ethnic wear",
      "sherwani",
      "wedding collection",
      "luxury menswear India",
      "Mietaaf",
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "Mietaaf",
      title: "Mietaaf | Luxury Men’s Ethnic & Formal",
      description:
        "Premium men’s ethnic and formal clothing — cinematic luxury, tailored experience.",
      url: base,
    },
    twitter: {
      card: "summary_large_image",
      title: "Mietaaf",
      description: "Luxury men’s ethnic & formal fashion.",
    },
    robots: { index: true, follow: true },
  };
}

export function pageTitle(title: string): Metadata {
  return { title };
}

/** Home route: canonical, OG/Twitter aligned with root `metadataBase`. */
export function homePageMetadata(): Metadata {
  const description =
    "Sherwani, suits, indo-western, wedding and premium menswear — Mietaaf atelier experience.";
  return {
    title: "Luxury Men’s Ethnic & Formal",
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      title: "Luxury Men’s Ethnic & Formal | Mietaaf",
      description,
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: "Luxury Men’s Ethnic & Formal | Mietaaf",
      description,
    },
  };
}
