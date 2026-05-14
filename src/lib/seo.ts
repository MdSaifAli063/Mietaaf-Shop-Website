import type { Metadata } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mietaaf.com";

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
