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
  waistcoat: "/categories/waistcoat.webp",
  "indo-western": "/categories/indo-western.webp",
  "wedding-collection": "/categories/wedding-collection.webp",
  "festive-collection": "/categories/festive-collection.webp",
  "premium-collection": "/categories/premium-collection.webp",
};

export function applyCategoryImageLink(category: Category): Category {
  if ((category.slug as string) === "designer-dresses") {
    return {
      slug: "waistcoat",
      name: "Waistcoat",
      description: "Refined layers for celebrations and formal evenings.",
      image: CATEGORY_IMAGE_LINKS.waistcoat,
    };
  }

  return {
    ...category,
    image: CATEGORY_IMAGE_LINKS[category.slug] ?? category.image,
  };
}
