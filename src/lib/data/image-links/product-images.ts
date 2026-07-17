import type { Product } from "@/types";

/**
 * OPTIONAL PRODUCT IMAGE OVERRIDES
 * Add one line using the product slug. This works for local and Firebase products.
 *
 * Example:
 * "royal-embroidered-sherwani": ["https://example.com/front.jpg", "https://example.com/back.jpg"],
 */
export const PRODUCT_IMAGE_LINKS: Record<string, readonly string[]> = {};

export function applyProductImageLinks(product: Product): Product {
  const customImages = PRODUCT_IMAGE_LINKS[product.slug];
  if (!customImages?.length) return product;
  return { ...product, images: [...customImages] };
}

