import { product, type EditableCategoryProduct } from "./product-entry";

/**
 * EDIT PREMIUM PRODUCTS HERE
 * number, name, image, selling price, original price, discount %, rating, reviews
 */
export const PREMIUM_PRODUCTS: readonly EditableCategoryProduct[] = [
  product(1, "Atelier Double-Breasted Suit", "/placeholders/product-coming-soon.svg", 34999, 40999, 15, 4.9, 57, "Super 130s wool with full-canvas shaping and soft lining."),
  product(2, "Heritage Zardozi Sherwani", "/placeholders/product-coming-soon.svg", 62999, 71999, 13, 4.9, 44, "Luxury silk-gold blend with zardozi embroidery and couture finish."),
  product(3, "Midnight Velvet Tuxedo", "https://ik.imagekit.io/c5zhitarg/WhatsApp%20Image%202026-07-17%20at%209.57.51%20PM.jpeg?updatedAt=1784306161280", 13999, 15999, 14, 4.9, 43, "Midnight velvet-touch suiting with satin collar and formal structure."),
  product(4, "Slate Double-Breasted Suit", "/placeholders/product-coming-soon.svg", 34999, 39999, 13, 4.8, 32, "Slate textured wool blend with understated polished finish."),
  product(5, "Premium Suit", "/categories/premium-collection.webp", 41999, 47999, 13, 4.9, 21, "Luxury wool-silk blend with full-canvas construction and high-end drape."),
  product(6, "Camel Tailored Dinner Jacket", "/placeholders/product-coming-soon.svg", 28999, 33999, 15, 4.7, 18, "Camel wool blend with dinner-jacket structure and soft interior."),
  product(7, "Noir Atelier Tuxedo", "/placeholders/product-coming-soon.svg", 34999, 40699, 14, 4.8, 73, "Noir premium suiting with tonal sheen and custom-cut lapels."),
  product(8, "Ivory Signature Bandhgala", "/placeholders/product-coming-soon.svg", 38599, 44899, 14, 4.9, 84, "Ivory silk-rich suit fabric with crafted bandhgala styling."),
];
