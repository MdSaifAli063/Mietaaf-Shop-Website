/** One editable category product row used throughout the storefront. */
export type EditableCategoryProduct = {
  number: number;
  name: string;
  image: string;
  price: number;
  compareAtPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
};

/** Automatically shown whenever a product image link is left blank. */
export const PRODUCT_COMING_SOON_IMAGE = "/placeholders/product-coming-soon.svg";

export function product(
  number: number,
  name: string,
  image: string,
  price: number,
  compareAtPrice: number,
  discountPercent: number,
  rating: number,
  reviewCount: number,
): EditableCategoryProduct {
  return { number, name, image, price, compareAtPrice, discountPercent, rating, reviewCount };
}
