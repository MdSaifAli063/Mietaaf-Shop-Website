import type { Banner } from "@/types";
import { HERO_IMAGE_LINKS } from "@/lib/data/image-links/hero-images";

export const BANNERS: Banner[] = [
  {
    id: "1",
    title: "The Wedding Edit",
    subtitle: "Hand-embellished sherwanis & indo-western",
    image: HERO_IMAGE_LINKS.weddingEdit,
    href: "/category/wedding-collection",
    cta: "Explore Wedding",
  },
  {
    id: "2",
    title: "Premium Suits",
    subtitle: "Charcoal, midnight, ivory — tailored in India",
    image: HERO_IMAGE_LINKS.premiumSuits,
    href: "/category/suits",
    cta: "Shop Suits",
  },
  {
    id: "3",
    title: "Festive Gold",
    subtitle: "Silk textures & metallic accents",
    image: HERO_IMAGE_LINKS.festiveGold,
    href: "/category/festive-collection",
    cta: "View Festive",
  },
];
