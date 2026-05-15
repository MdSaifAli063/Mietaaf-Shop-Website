import type { CategorySlug } from "@/types";

export const SITE_NAME = "MIETAAF";
export const SITE_TAGLINE = "Luxury Men’s Ethnic & Formal";

/** LinkedIn, Instagram, Facebook — set `NEXT_PUBLIC_SOCIAL_*` in `.env.local` or edit these fallbacks. */
export const SITE_SOCIAL_URLS = {
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN?.trim() || "#",
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM?.trim() || "#",
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK?.trim() || "#",
} as const;

export const NAV_CATEGORIES: { slug: CategorySlug; label: string }[] = [
  { slug: "sherwani", label: "Sherwani" },
  { slug: "blazer", label: "Blazer" },
  { slug: "coat", label: "Coat" },
  { slug: "suits", label: "Suits" },
  { slug: "kurta", label: "Kurta" },
  { slug: "pants", label: "Pants" },
  { slug: "designer-dresses", label: "Designer Dresses" },
  { slug: "indo-western", label: "Indo-Western" },
  { slug: "wedding-collection", label: "Wedding" },
  { slug: "festive-collection", label: "Festive" },
  { slug: "premium-collection", label: "Premium" },
];

export const FOOTER_LINKS = {
  shop: [
    { href: "/shop", label: "All Collections" },
    { href: "/lookbook", label: "Lookbook" },
    { href: "/compare", label: "Compare" },
    { href: "/category/wedding-collection", label: "Wedding" },
    { href: "/category/premium-collection", label: "Premium" },
    { href: "/category/indo-western", label: "Indo-Western" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/returns", label: "Return Policy" },
  ],
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Popularity" },
  { value: "rating", label: "Top Rated" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
