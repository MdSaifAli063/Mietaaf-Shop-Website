import type { Category, CategorySlug } from "@/types";

/**
 * FEATURED CATEGORIES + CATEGORY PAGE IMAGES
 * The key is the category slug. Change only its image link.
 */
export const CATEGORY_IMAGE_LINKS: Record<CategorySlug, string> = {
  sherwani: "/categories/sherwani.webp",
  blazer: "/categories/blazer.webp",
  coat: "/categories/coat.webp",
  suits: "/categories/suits.webp",
  kurta: "/categories/kurta.webp",
  pants: "/categories/pants.webp",
  "designer-dresses": "/categories/designer-dresses.webp",
  "indo-western": "/categories/indo-western.webp",
  "wedding-collection": "/categories/wedding-collection.webp",
  "festive-collection": "/categories/festive-collection.webp",
  "premium-collection": "/categories/premium-collection.webp",
};

export function applyCategoryImageLink(category: Category): Category {
  return {
    ...category,
    image: CATEGORY_IMAGE_LINKS[category.slug] ?? category.image,
  };
}

