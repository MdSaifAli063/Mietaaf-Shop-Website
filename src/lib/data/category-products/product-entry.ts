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
