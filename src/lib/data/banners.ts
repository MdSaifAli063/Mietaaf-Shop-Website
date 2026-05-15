import type { Banner } from "@/types";
import { UNSPLASH_PHOTOS, unsplashImageUrl } from "@/lib/unsplash-images";

export const BANNERS: Banner[] = [
  {
    id: "1",
    title: "The Wedding Edit",
    subtitle: "Hand-embellished sherwanis & indo-western",
    image: unsplashImageUrl(UNSPLASH_PHOTOS.weddingSherwani, 1920, 75),
    href: "/category/wedding-collection",
    cta: "Explore Wedding",
  },
  {
    id: "2",
    title: "Premium Suits",
    subtitle: "Charcoal, midnight, ivory — tailored in India",
    image: unsplashImageUrl(UNSPLASH_PHOTOS.suitFormal, 1920, 75),
    href: "/category/suits",
    cta: "Shop Suits",
  },
  {
    id: "3",
    title: "Festive Gold",
    subtitle: "Silk textures & metallic accents",
    image: unsplashImageUrl(UNSPLASH_PHOTOS.festiveGold, 1920, 75),
    href: "/category/festive-collection",
    cta: "View Festive",
  },
];
