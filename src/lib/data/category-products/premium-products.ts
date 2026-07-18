import { product, type EditableCategoryProduct } from "./product-entry";

/**
 * EDIT PREMIUM PRODUCTS HERE
 * number, name, image, selling price, original price, discount %, rating, reviews
 */
export const PREMIUM_PRODUCTS: readonly EditableCategoryProduct[] = [
  product(1, "Atelier Double-Breasted Suit", "/categories/premium-collection.webp", 34999, 40999, 15, 4.9, 57),
  product(2, "Heritage Zardozi Sherwani", "/categories/suits.webp", 62999, 71999, 13, 4.9, 44),
  product(3, "Midnight Velvet Tuxedo", "/categories/blazer.webp", 36999, 42999, 14, 4.9, 43),
  product(4, "Slate Double-Breasted Suit", "/hero/premium-suits.webp", 34999, 39999, 13, 4.8, 32),
  product(5, "Onyx Embroidered Bandhgala", "/categories/premium-collection.webp", 41999, 47999, 13, 4.9, 21),
  product(6, "Camel Tailored Dinner Jacket", "/categories/suits.webp", 28999, 33999, 15, 4.7, 18),
  product(7, "Noir Atelier Tuxedo", "/categories/blazer.webp", 34999, 40699, 14, 4.8, 73),
  product(8, "Ivory Signature Bandhgala", "/hero/premium-suits.webp", 38599, 44899, 14, 4.9, 84),
];
