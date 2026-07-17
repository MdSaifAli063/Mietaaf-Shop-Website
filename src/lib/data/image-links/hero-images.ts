import type { Banner } from "@/types";

/**
 * HOMEPAGE HERO IMAGES
 * Replace only the value on the right with a local path or a full https:// URL.
 */
export const HERO_IMAGE_LINKS = {
  weddingEdit: "/hero/wedding-edit.webp",
  premiumSuits: "/hero/premium-suits.webp",
  festiveGold: "/hero/festive-gold.webp",
} as const;

const HERO_IMAGE_BY_BANNER_ID: Record<string, string> = {
  "1": HERO_IMAGE_LINKS.weddingEdit,
  "2": HERO_IMAGE_LINKS.premiumSuits,
  "3": HERO_IMAGE_LINKS.festiveGold,
};

export function applyHeroImageLink(banner: Banner): Banner {
  return { ...banner, image: HERO_IMAGE_BY_BANNER_ID[banner.id] ?? banner.image };
}
