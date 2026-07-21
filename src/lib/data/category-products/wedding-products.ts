import { product, type EditableCategoryProduct } from "./product-entry";

/**
 * EDIT WEDDING PRODUCTS HERE
 * number, name, image, selling price, original price, discount %, rating, reviews
 */
export const WEDDING_PRODUCTS: readonly EditableCategoryProduct[] = [
  product(1, "Ceremonial Threadwork Sherwani", "/categories/wedding-collection.webp", 52999, 60999, 13, 4.9, 74),
  product(2, "Groom Cape Sherwani", "https://ik.imagekit.io/c5zhitarg/WhatsApp%20Image%202026-07-16%20at%2011.36.02%20AM%20(1).jpeg?updatedAt=1784303069977", 58999, 67999, 13, 4.8, 36),
  product(3, "Ivory Lotus Achkan Set", "https://ik.imagekit.io/c5zhitarg/WhatsApp%20Image%202026-07-16%20at%2011.36.03%20AM.jpeg?updatedAt=1784303276701", 38999, 44999, 13, 4.8, 52),
  product(4, "Champagne Ceremony Bandhgala", "/categories/festive-collection.webp", 15999, 19999, 14, 4.7, 31),
  product(5, "Pearl Groom Sherwani", "/placeholders/product-coming-soon.svg", 48999, 56999, 14, 4.9, 19),
  product(6, "Rosewood Reception Set", "/placeholders/product-coming-soon.svg", 32999, 37999, 13, 4.7, 24),
  product(7, "Ivory Maharaja Groom Set", "/placeholders/product-coming-soon.svg", 42999, 49999, 14, 4.8, 73),
  product(8, "Emerald Palace Wedding Set", "", 46799, 54399, 14, 4.9, 84),
];
