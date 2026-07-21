import type { CategorySlug } from "@/types";
import { product, type EditableCategoryProduct } from "@/lib/data/category-products/product-entry";
import { WEDDING_PRODUCTS } from "@/lib/data/category-products/wedding-products";
import { PREMIUM_PRODUCTS } from "@/lib/data/category-products/premium-products";

export type { EditableCategoryProduct } from "@/lib/data/category-products/product-entry";

/**
 * EDIT CATEGORY PRODUCTS HERE
 *
 * Every row is one storefront product in its category. The values are ordered as:
 * number, name, image, selling price, original price, discount %, rating, reviews.
 *
 * Keep product numbers 1-8 unique inside each category. A blank image automatically
 * shows the Coming Soon artwork until you paste a local /public path or an https URL.
 */
export const CATEGORY_PRODUCTS: Record<CategorySlug, readonly EditableCategoryProduct[]> = {
  sherwani: [
    product(1, "Royal Embroidered Sherwani", "https://ik.imagekit.io/c5zhitarg/image_ebd76a09.png?updatedAt=1784387675301", 45999, 52999, 13, 4.9, 128),
    product(2, "Ivory Palace Sherwani", "https://ik.imagekit.io/c5zhitarg/image_1811519d.png?updatedAt=1784387632919", 36999, 42899, 14, 4.7, 18),
    product(3, "Emerald Heritage Sherwani", "https://ik.imagekit.io/c5zhitarg/WhatsApp%20Image%202026-07-16%20at%2011.36.02%20AM%20(2).jpeg?updatedAt=1784303238199", 40199, 46599, 14, 4.8, 29),
    product(4, "Champagne Zari Sherwani", "https://ik.imagekit.io/c5zhitarg/WhatsApp%20Image%202026-07-17%20at%209.57.54%20PM.jpeg?updatedAt=1784306208099", 43399, 50299, 14, 4.9, 40),
    product(5, "Midnight Regal Sherwani", "", 46599, 54099, 14, 4.6, 51),
    product(6, "Rosewood Groom Sherwani", "", 49799, 57799, 14, 4.7, 62),
    product(7, "Pearl Jaal Sherwani", "", 52999, 61599, 14, 4.8, 73),
    product(8, "Royal Blue Ceremony Sherwani", "", 56199, 65299, 14, 4.9, 84),
  ],
  blazer: [
    product(1, "Midnight Architect Blazer", "https://ik.imagekit.io/c5zhitarg/WhatsApp%20Image%202026-07-16%20at%2011.36.02%20AM.jpeg?updatedAt=1784303257661", 12999, 14999, 13, 4.7, 86),
    product(2, "Midnight Peak Blazer", "/categories/premium-collection.webp", 11999, 13999, 14, 4.6, 18),
    product(3, "Charcoal Atelier Blazer", "/categories/suits.webp", 13799, 15999, 14, 4.7, 29),
    product(4, "Emerald Evening Blazer", "/hero/premium-suits.webp", 15599, 18099, 14, 4.8, 40),
    product(5, "Ivory Dinner Blazer", "/placeholders/product-coming-soon.svg", 17399, 20199, 14, 4.9, 51),
    product(6, "Cobalt Windowpane Blazer", "/placeholders/product-coming-soon.svg", 19199, 22299, 14, 4.6, 62),
    product(7, "Burgundy Velvet Blazer", "/placeholders/product-coming-soon.svg", 20999, 24399, 14, 4.7, 73),
    product(8, "Camel Textured Blazer", "/placeholders/product-coming-soon.svg", 22799, 26499, 14, 4.8, 84),
  ],
  coat: [
    product(1, "Cashmere Overcoat", "/categories/coat.webp", 24999, 28999, 14, 4.8, 54),
    product(2, "Structured Trench Coat", "/categories/blazer.webp", 17999, 20899, 14, 4.6, 38),
    product(3, "Camel Regent Overcoat", "/categories/premium-collection.webp", 17999, 20899, 14, 4.7, 29),
    product(4, "Midnight Wool Topcoat", "/categories/suits.webp", 20099, 23299, 14, 4.8, 40),
    product(5, "Charcoal Double-Breasted Coat", "/placeholders/product-coming-soon.svg", 22199, 25799, 14, 4.9, 51),
    product(6, "Olive Heritage Coat", "/placeholders/product-coming-soon.svg", 24299, 28199, 14, 4.6, 62),
    product(7, "Black Cashmere Coat", "/placeholders/product-coming-soon.svg", 26399, 30699, 14, 4.7, 73),
    product(8, "Stone Tailored Trench", "/placeholders/product-coming-soon.svg", 28499, 33099, 14, 4.8, 84),
  ],
  suits: [
    product(1, "Emerald Royale Tuxedo Set", "/catalog-photos/catalog-page-01.webp", 44999, 52999, 15, 4.9, 48),
    product(2, "Midnight Gold Velvet Tuxedo Set", "/catalog-photos/catalog-page-02.webp", 54999, 62999, 13, 4.8, 37),
    product(3, "Ivory Royale Suit Set", "/catalog-photos/catalog-page-03.webp", 41999, 48999, 14, 4.7, 31),
    product(4, "Royal Amethyst Bandhgala Set", "/catalog-photos/catalog-page-04.webp", 38999, 45999, 15, 4.8, 28),
    product(5, "Noir Panther Suit Set", "/catalog-photos/catalog-page-05.webp", 47999, 55999, 14, 4.9, 42),
    product(6, "Burgundy Beaded Tuxedo Set", "/catalog-photos/catalog-page-06.webp", 42999, 49999, 14, 4.8, 34),
    product(7, "Peacock Heritage Bandhgala Set", "/catalog-photos/catalog-page-07.webp", 45999, 53999, 15, 4.7, 26),
    product(8, "Cognac Heritage Three-Piece Tuxedo", "/catalog-photos/catalog-page-08.webp", 49999, 57999, 14, 4.9, 39),
  ],
  kurta: [
    product(1, "Silk Festive Kurta Set", "https://ik.imagekit.io/c5zhitarg/image_11b3b7cd.png", 8999, 10499, 14, 4.6, 210),
    product(2, "Minimal Linen Kurta", "https://ik.imagekit.io/c5zhitarg/image_3989acf6.png?updatedAt=1784387591694", 4999, 5799, 14, 4.5, 72),
    product(3, "Sage Embroidered Kurta Set", "https://ik.imagekit.io/c5zhitarg/image_f83d279d.png?updatedAt=1784387692414", 5999, 6999, 14, 4.7, 29),
    product(4, "Ivory Silk Kurta Set", "https://ik.imagekit.io/c5zhitarg/image_229411d4%20(1).png?updatedAt=1784387614171", 6899, 7999, 14, 4.8, 40),
    product(5, "Midnight Festive Kurta", "/placeholders/product-coming-soon.svg", 7799, 9099, 14, 4.9, 51),
    product(6, "Maroon Jacquard Kurta", "/placeholders/product-coming-soon.svg", 8699, 10099, 14, 4.6, 62),
    product(7, "Powder Blue Linen Kurta", "/placeholders/product-coming-soon.svg", 9599, 11199, 14, 4.7, 73),
    product(8, "Mustard Celebration Kurta", "/placeholders/product-coming-soon.svg", 10499, 12199, 14, 4.8, 84),
  ],
  pants: [
    product(1, "Pleated Tuxedo Trousers", "/categories/pants.webp", 4999, 5799, 14, 4.5, 67),
    product(2, "Black Satin-Stripe Trousers", "/categories/suits.webp", 4499, 5199, 14, 4.6, 18),
    product(3, "Charcoal Tailored Trousers", "/categories/blazer.webp", 5149, 5999, 14, 4.7, 29),
    product(4, "Navy Pleated Trousers", "/categories/premium-collection.webp", 5799, 6699, 14, 4.8, 40),
    product(5, "Stone Gurkha Trousers", "/placeholders/product-coming-soon.svg", 6449, 7499, 14, 4.9, 51),
    product(6, "Olive Tapered Trousers", "/placeholders/product-coming-soon.svg", 7099, 8299, 14, 4.6, 62),
    product(7, "Midnight Formal Trousers", "/placeholders/product-coming-soon.svg", 7749, 8999, 14, 4.7, 73),
    product(8, "Cognac Relaxed Trousers", "/placeholders/product-coming-soon.svg", 8399, 9799, 14, 4.8, 84),
  ],
  waistcoat: [
    product(1, "Ivory Embroidered Waistcoat Set", "/products/waistcoats/waistcoat-01.webp", 14999, 17499, 14, 4.9, 128),
    product(2, "Midnight Velvet Waistcoat Set", "/products/waistcoats/waistcoat-02.webp", 16999, 19799, 14, 4.8, 86),
    product(3, "Sage Jacquard Waistcoat Set", "/products/waistcoats/waistcoat-03.webp", 12999, 15099, 14, 4.7, 72),
    product(4, "Burgundy Brocade Waistcoat Set", "/products/waistcoats/waistcoat-04.webp", 15999, 18599, 14, 4.8, 64),
    product(5, "Charcoal Herringbone Waistcoat", "/products/waistcoats/waistcoat-05.webp", 11999, 13999, 14, 4.7, 51),
    product(6, "Teal Raw Silk Waistcoat Set", "/products/waistcoats/waistcoat-06.webp", 13999, 16299, 14, 4.8, 62),
    product(7, "Champagne Double-Breasted Waistcoat", "/products/waistcoats/waistcoat-07.webp", 17999, 20999, 14, 4.9, 73),
    product(8, "Rust Heritage Waistcoat Set", "/products/waistcoats/waistcoat-08.webp", 13499, 15699, 14, 4.7, 84),
  ],
  "indo-western": [
    product(1, "Indo-Western Bandhgala", "https://ik.imagekit.io/c5zhitarg/WhatsApp%20Image%202026-07-17%20at%209.57.55%20PM.jpeg?updatedAt=1784303275123", 13999, 16299, 14, 4.7, 93),
    product(2, "Monochrome Indo Set", "/categories/indo-western.webp", 16999, 19799, 14, 4.6, 33),
    product(3, "Teal Architectural Indo-Western", "/categories/festive-collection.webp", 14999, 17399, 14, 4.7, 29),
    product(4, "Onyx Draped Indo-Western Set", "/categories/wedding-collection.webp", 16899, 19699, 14, 4.8, 40),
    product(5, "Ivory Crossover Bandhgala", "/placeholders/product-coming-soon.svg", 18799, 21899, 14, 4.9, 51),
    product(6, "Burgundy Layered Indo-Western", "/placeholders/product-coming-soon.svg", 20699, 24099, 14, 4.6, 62),
    product(7, "Midnight Asymmetric Achkan", "/placeholders/product-coming-soon.svg", 22599, 26299, 14, 4.7, 73),
    product(8, "Sage Contemporary Jacket Set", "/placeholders/product-coming-soon.svg", 24499, 28499, 14, 4.8, 84),
  ],
  "wedding-collection": WEDDING_PRODUCTS,
  "festive-collection": [
    product(1, "Silk Brocade Festive Bandhgala", "/placeholders/product-coming-soon.svg", 15999, 18499, 14, 4.8, 61),
    product(2, "Emerald Diwali Bandhgala", "/placeholders/product-coming-soon.svg", 10999, 12799, 14, 4.6, 18),
    product(3, "Marigold Brocade Kurta Set", "/placeholders/product-coming-soon.svg", 12499, 14499, 14, 4.7, 29),
    product(4, "Wine Festive Achkan", "/placeholders/product-coming-soon.svg", 13999, 16299, 14, 4.8, 40),
    product(5, "Ivory Celebration Jacket Set", "/placeholders/product-coming-soon.svg", 15499, 17999, 14, 4.9, 51),
    product(6, "Royal Blue Jacquard Kurta", "/placeholders/product-coming-soon.svg", 16999, 19799, 14, 4.6, 62),
    product(7, "Sage Festive Layered Set", "/placeholders/product-coming-soon.svg", 18499, 21499, 14, 4.7, 73),
    product(8, "Rust Silk Bandhgala", "/placeholders/product-coming-soon.svg", 19999, 23299, 14, 4.8, 84),
  ],
  "premium-collection": PREMIUM_PRODUCTS,
};
