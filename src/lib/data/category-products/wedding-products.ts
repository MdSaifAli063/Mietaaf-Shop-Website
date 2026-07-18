import { product, type EditableCategoryProduct } from "./product-entry";

/**
 * EDIT WEDDING PRODUCTS HERE
 * number, name, image, selling price, original price, discount %, rating, reviews
 */
export const WEDDING_PRODUCTS: readonly EditableCategoryProduct[] = [
  product(1, "Ceremonial Threadwork Sherwani", "/categories/wedding-collection.webp", 52999, 60999, 13, 4.9, 74),
  product(2, "Groom Cape Sherwani", "/categories/sherwani.webp", 58999, 67999, 13, 4.8, 36),
  product(3, "Ivory Lotus Achkan Set", "/categories/festive-collection.webp", 38999, 44999, 13, 4.8, 52),
  product(4, "Champagne Ceremony Bandhgala", "/hero/wedding-edit.webp", 42999, 49999, 14, 4.7, 31),
  product(5, "Pearl Groom Sherwani", "/categories/wedding-collection.webp", 48999, 56999, 14, 4.9, 19),
  product(6, "Rosewood Reception Set", "/categories/sherwani.webp", 32999, 37999, 13, 4.7, 24),
  product(7, "Ivory Maharaja Groom Set", "/categories/festive-collection.webp", 42999, 49999, 14, 4.8, 73),
  product(8, "Emerald Palace Wedding Set", "/hero/wedding-edit.webp", 46799, 54399, 14, 4.9, 84),
];
