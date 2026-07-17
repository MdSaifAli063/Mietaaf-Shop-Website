import { UNSPLASH_PHOTOS, unsplashImageUrl } from "@/lib/unsplash-images";

/** IMAGES USED ON STANDALONE PAGES */
export const PAGE_IMAGE_LINKS = {
  about: {
    hero: unsplashImageUrl(UNSPLASH_PHOTOS.weddingSherwani, 1600, 80),
    craft: unsplashImageUrl(UNSPLASH_PHOTOS.designer, 1200, 80),
    stitch: unsplashImageUrl(UNSPLASH_PHOTOS.festiveGold, 1200, 80),
    studio: unsplashImageUrl(UNSPLASH_PHOTOS.tailoring, 1100, 80),
  },
  appointment: {
    hero: "/hero/premium-suits.webp",
  },
} as const;

