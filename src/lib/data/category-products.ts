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
    product(1, "Royal Embroidered Sherwani", "https://ik.imagekit.io/c5zhitarg/image_ebd76a09.png?updatedAt=1784387675301", 29999, 33999, 13, 4.9, 128, "Silk blend with zari accents and breathable cotton lining."),
    product(2, "Ivory Palace Sherwani", "https://ik.imagekit.io/c5zhitarg/image_1811519d.png?updatedAt=1784387632919", 15999, 19999, 14, 4.7, 18, "Ivory silk blend with tonal threadwork and soft lining."),
    product(3, "Emerald Heritage Sherwani", "https://ik.imagekit.io/c5zhitarg/WhatsApp%20Image%202026-07-16%20at%2011.36.02%20AM%20(2).jpeg?updatedAt=1784303238199", 26999, 29999, 14, 4.8, 29, "Emerald raw silk base with zari highlighting and structured lining."),
    product(4, "Champagne Zari Sherwani", "https://ik.imagekit.io/c5zhitarg/WhatsApp%20Image%202026-07-17%20at%209.57.54%20PM.jpeg?updatedAt=1784306208099", 22999, 25999, 14, 4.9, 40, "Champagne silk-brocade with subtle gold zari detailing."),
    product(5, "Midnight Regal Sherwani", "", 46599, 54099, 14, 4.6, 51, "Midnight velvet-silk blend with satin-lined construction."),
    product(6, "Rosewood Groom Sherwani", "", 49799, 57799, 14, 4.7, 62, "Rosewood jacquard silk with soft hand-finished surface."),
    product(7, "Pearl Jaal Sherwani", "", 52999, 61599, 14, 4.8, 73, "Pearl silk blend with delicate jaal motif and matching lining."),
    product(8, "Royal Blue Ceremony Sherwani", "", 56199, 65299, 14, 4.9, 84, "Royal blue silk blend with ceremonial threadwork and polished lining."),
  ],
  blazer: [
    product(1, "Midnight Architect Blazer", "https://ik.imagekit.io/c5zhitarg/WhatsApp%20Image%202026-07-16%20at%2011.36.02%20AM.jpeg?updatedAt=1784303257661", 16999, 19999, 13, 4.7, 86, "Italian wool blend with clean lapel structure and satin lining."),
    product(2, "Tuxedo Velvet Blazer", "/categories/premium-collection.webp", 11999, 13999, 14, 4.6, 18, "Premium wool blend with sharp peak lapel and soft drape."),
    product(3, "Charcoal Atelier Blazer", "https://ik.imagekit.io/c5zhitarg/937568-11971928.jpg_asp=true&crop=700&auto=format", 13799, 15999, 14, 4.7, 29, "Charcoal textured wool blend with structured shoulder line."),
    product(4, "Emerald Evening Blazer", "https://ik.imagekit.io/c5zhitarg/emerald-green-wool-blazer-multi.webp", 13599, 15999, 14, 4.8, 40, "Emerald suiting fabric with tonal weave and refined finish."),
    product(5, "Ivory Dinner Blazer", "/placeholders/product-coming-soon.svg", 17399, 20199, 14, 4.9, 51, "Ivory wool-silk blend with polished collar and soft lining."),
    product(6, "Cobalt Windowpane Blazer", "/placeholders/product-coming-soon.svg", 19199, 22299, 14, 4.6, 62, "Cobalt windowpane suiting with crisp tailored cut."),
    product(7, "Burgundy Velvet Blazer", "/placeholders/product-coming-soon.svg", 20999, 24399, 14, 4.7, 73, "Burgundy velvet-touch blend with formal drape and satin lining."),
    product(8, "Camel Textured Blazer", "/placeholders/product-coming-soon.svg", 22799, 26499, 14, 4.8, 84, "Camel textured wool blend with tailored structure and smooth interior."),
  ],
  coat: [
    product(1, "Cashmere Overcoat", "/categories/coat.webp", 18999, 22999, 14, 4.8, 54, "Wool-cashmere blend with satin-lined sleeves and soft warmth."),
    product(2, "Structured Trench Coat", "/categories/blazer.webp", 5999, 8999, 14, 4.6, 38, "Wool-rich trench fabric with sharp drape and clean finish."),
    product(3, "Slim Fit Coat", "https://ik.imagekit.io/c5zhitarg/b96219ad8356c52725613f87073206b4d2aa8a6e.jpg", 4999, 5999, 14, 4.7, 29, "Camel wool blend with polished outerwear structure."),
    product(4, "Midnight Wool Topcoat", "https://ik.imagekit.io/c5zhitarg/sutton-black-wool-topcoat-mens-cardinal-of-canada-us-6612206.jpg_v=1780570576&width=1300", 17999, 19999, 14, 4.8, 40, "Midnight wool topcoat fabric with smooth layered construction."),
    product(5, "Charcoal Double-Breasted Coat", "/placeholders/product-coming-soon.svg", 22199, 25799, 14, 4.9, 51, "Charcoal wool blend with wide collar and structured button line."),
    product(6, "Olive Heritage Coat", "/placeholders/product-coming-soon.svg", 24299, 28199, 14, 4.6, 62, "Olive textured wool coating with subtle matte finish."),
    product(7, "Black Cashmere Coat", "/placeholders/product-coming-soon.svg", 26399, 30699, 14, 4.7, 73, "Black cashmere-rich wool blend with elegant interior lining."),
    product(8, "Stone Tailored Trench", "/placeholders/product-coming-soon.svg", 28499, 33099, 14, 4.8, 84, "Stone tailored trench fabric with smooth and crease-resistant feel."),
  ],
  suits: [
    product(1, "Emerald Royale Tuxedo Set", "/catalog-photos/catalog-page-01.webp", 44999, 52999, 15, 4.9, 48, "Premium textured suiting with refined sheen and tailored construction."),
    product(2, "Midnight Gold Velvet Tuxedo Set", "/catalog-photos/catalog-page-02.webp", 54999, 62999, 13, 4.8, 37, "Midnight velvet-touch suiting with luxe gold-thread finish."),
    product(3, "Ivory Royale Suit Set", "/catalog-photos/catalog-page-03.webp", 41999, 48999, 14, 4.7, 31, "Ivory premium suiting with tonal finish and smooth drape."),
    product(4, "Royal Amethyst Bandhgala Set", "/catalog-photos/catalog-page-04.webp", 38999, 45999, 15, 4.8, 28, "Royal amethyst suiting with rich texture and embroidery accents."),
    product(5, "Noir Panther Suit Set", "/catalog-photos/catalog-page-05.webp", 47999, 55999, 14, 4.9, 42, "Noir premium suiting with tonal sheen and polished lapel details."),
    product(6, "Burgundy Beaded Tuxedo Set", "/catalog-photos/catalog-page-06.webp", 42999, 49999, 14, 4.8, 34, "Burgundy textured suiting with beadwork accents and soft lining."),
    product(7, "Peacock Heritage Bandhgala Set", "/catalog-photos/catalog-page-07.webp", 45999, 53999, 15, 4.7, 26, "Peacock heritage suiting with hand-finished zari detailing."),
    product(8, "Cognac Heritage Three-Piece Tuxedo", "/catalog-photos/catalog-page-08.webp", 49999, 57999, 14, 4.9, 39, "Cognac premium textured suiting with structured three-piece profile."),
  ],
  kurta: [
    product(1, "Silk Festive Kurta Set", "https://ik.imagekit.io/c5zhitarg/image_11b3b7cd.png", 4999, 6999, 14, 4.6, 210, "Matka silk blend with breathable lining and festive drape."),
    product(2, "Minimal Linen Kurta", "https://ik.imagekit.io/c5zhitarg/image_3989acf6.png?updatedAt=1784387591694", 3999, 5799, 14, 4.5, 72, "European linen with airy structure and clean tailoring."),
    product(3, "Sage Embroidered Kurta Set", "https://ik.imagekit.io/c5zhitarg/image_f83d279d.png?updatedAt=1784387692414", 5999, 6999, 14, 4.7, 29, "Sage silk-linen blend with delicate embroidery and soft lining."),
    product(4, "Embroidered Kurta Set", "https://ik.imagekit.io/c5zhitarg/image_229411d4%20(1).png?updatedAt=1784387614171", 6899, 7999, 14, 4.8, 40, "Ivory silk blend with premium hand-finished sheen."),
    product(5, "Midnight Festive Kurta", "/placeholders/product-coming-soon.svg", 7799, 9099, 14, 4.9, 51, "Midnight elegant kurta fabric with festive sheen and soft lining."),
    product(6, "Maroon Jacquard Kurta", "/placeholders/product-coming-soon.svg", 8699, 10099, 14, 4.6, 62, "Maroon jacquard weave with subtle texture and comfortable drape."),
    product(7, "Powder Blue Linen Kurta", "/placeholders/product-coming-soon.svg", 9599, 11199, 14, 4.7, 73, "Powder blue linen-cotton blend with breathable finish."),
    product(8, "Mustard Celebration Kurta", "/placeholders/product-coming-soon.svg", 10499, 12199, 14, 4.8, 84, "Mustard festive fabric with soft texture and celebratory sheen."),
  ],
  pants: [
    product(1, "Pleated Tuxedo Trousers", "https://ik.imagekit.io/c5zhitarg/Eaton_Suit_-_Plain_Navy26769.jpg_v=1771339236", 2999, 3299, 14, 4.5, 67, "Wool barathea with satin stripe and clean pleat structure."),
    product(2, "Black Satin-Stripe Trousers", "https://ik.imagekit.io/c5zhitarg/images_q=tbn:ANd9GcTNG_RXZs74qnMRYYn4Bd5hTVLeO4PbnJSdatFZan3lCKSjVYAQhw0_OAAR&s=10", 3499, 5199, 14, 4.6, 18, "Black satin-striped suiting with smooth formal finish."),
    product(3, "Charcoal Tailored Trousers", "https://ik.imagekit.io/c5zhitarg/MP000000031132685_437Wx649H_202605151849361.jpeg", 3199, 5999, 14, 4.7, 29, "Charcoal wool-blend trouser with crisp, tailored line."),
    product(4, "Navy Pleated Trousers", "https://ik.imagekit.io/c5zhitarg/bluefront3.jpg_v=1771665311&width=1188", 2799, 3699, 14, 4.8, 40, "Navy wool blend with a soft drape and elegant pleat."),
    product(5, "Stone Gurkha Trousers", "/placeholders/product-coming-soon.svg", 6449, 7499, 14, 4.9, 51, "Stone textured wool blend with classic tapered cut."),
    product(6, "Olive Tapered Trousers", "/placeholders/product-coming-soon.svg", 7099, 8299, 14, 4.6, 62, "Olive suiting fabric with clean taper and crease-friendly finish."),
    product(7, "Midnight Formal Trousers", "/placeholders/product-coming-soon.svg", 7749, 8999, 14, 4.7, 73, "Midnight premium wool blend with polished movement."),
    product(8, "Cognac Relaxed Trousers", "/placeholders/product-coming-soon.svg", 8399, 9799, 14, 4.8, 84, "Cognac relaxed suiting with soft hand and elegant drape."),
  ],
  waistcoat: [
    product(1, "Ivory Embroidered Waistcoat Set", "/products/waistcoats/waistcoat-01.webp", 14999, 17499, 14, 4.9, 128, "Silk blend with tonal embroidery and satin lining."),
    product(2, "Midnight Velvet Waistcoat Set", "/products/waistcoats/waistcoat-02.webp", 16999, 19799, 14, 4.8, 86, "Midnight velvet-touch blend with smooth tailored finish."),
    product(3, "Sage Jacquard Waistcoat Set", "/products/waistcoats/waistcoat-03.webp", 12999, 15099, 14, 4.7, 72, "Sage jacquard weave with soft structure and satin lining."),
    product(4, "Burgundy Brocade Waistcoat Set", "/products/waistcoats/waistcoat-04.webp", 15999, 18599, 14, 4.8, 64, "Burgundy brocade weave with rich festive texture."),
    product(5, "Charcoal Herringbone Waistcoat", "/products/waistcoats/waistcoat-05.webp", 11999, 13999, 14, 4.7, 51, "Charcoal herringbone wool blend with crisp finish."),
    product(6, "Teal Raw Silk Waistcoat Set", "/products/waistcoats/waistcoat-06.webp", 13999, 16299, 14, 4.8, 62, "Teal raw silk blend with light sheen and satin lining."),
    product(7, "Champagne Double-Breasted Waistcoat", "/products/waistcoats/waistcoat-07.webp", 17999, 20999, 14, 4.9, 73, "Champagne satin-backed wool blend with refined drape."),
    product(8, "Rust Heritage Waistcoat Set", "/products/waistcoats/waistcoat-08.webp", 13499, 15699, 14, 4.7, 84, "Rust heritage weave with soft finish and formal structure."),
  ],
  "indo-western": [
    product(1, "Kurta Silk Bandhgala", "https://ik.imagekit.io/c5zhitarg/WhatsApp%20Image%202026-07-17%20at%209.57.55%20PM.jpeg?updatedAt=1784303275123", 8999, 12999, 14, 4.7, 93, "Linen-wool blend with lightweight structure and sharp collar."),
    product(2, "Monochrome Indo Set", "https://ik.imagekit.io/c5zhitarg/KA-5585-7236-T306-01.jpg_crop=region&crop_height=2880&crop_left=115&crop_top=0&crop_width=1929&v=1757058266&width=2160", 26999, 29799, 14, 4.6, 33, "Monochrome fusion fabric with clean, modern drape."),
    product(3, "Teal Architectural Indo-Western", "https://ik.imagekit.io/c5zhitarg/teal_blue_indo_western_set_for_men_with_ivory_floral-sg354502-1_1.jpg_v=1758267126", 34999, 37399, 14, 4.7, 29, "Teal wool-silk blend with architectural tailoring."),
    product(4, "Onyx Draped Indo-Western Set", "https://ik.imagekit.io/c5zhitarg/black-silk-indo-western-set-for-men-with-patch-work-and-embroidery-sg335556-3.jpg_v=1759561767", 36899, 39699, 14, 4.8, 40, "Onyx draped suiting with subtle sheen and contouring."),
    product(5, "Ivory Crossover Bandhgala", "/placeholders/product-coming-soon.svg", 18799, 21899, 14, 4.9, 51, "Ivory textured fusion fabric with crossover layering detail."),
    product(6, "Burgundy Layered Indo-Western", "/placeholders/product-coming-soon.svg", 20699, 24099, 14, 4.6, 62, "Burgundy wool-silk blend with layered, statement silhouette."),
    product(7, "Midnight Asymmetric Achkan", "/placeholders/product-coming-soon.svg", 22599, 26299, 14, 4.7, 73, "Midnight soft-structured satin blend with asymmetric cut."),
    product(8, "Sage Contemporary Jacket Set", "/placeholders/product-coming-soon.svg", 24499, 28499, 14, 4.8, 84, "Sage lightweight suiting with contemporary movement."),
  ],
  "wedding-collection": WEDDING_PRODUCTS,
  "festive-collection": [
    product(1, "Silk Brocade Festive Bandhgala", "/placeholders/product-coming-soon.svg", 15999, 18499, 14, 4.8, 61, "Silk brocade with jacquard texture and festive sheen."),
    product(2, "Emerald Diwali Bandhgala", "/placeholders/product-coming-soon.svg", 10999, 12799, 14, 4.6, 18, "Emerald festive suiting with soft hand feel and vibrant colour."),
    product(3, "Marigold Brocade Kurta Set", "/placeholders/product-coming-soon.svg", 12499, 14499, 14, 4.7, 29, "Marigold brocade blend with lightweight festive movement."),
    product(4, "Wine Festive Achkan", "/placeholders/product-coming-soon.svg", 13999, 16299, 14, 4.8, 40, "Wine silk-rich weave with celebratory depth and drape."),
    product(5, "Ivory Celebration Jacket Set", "/placeholders/product-coming-soon.svg", 15499, 17999, 14, 4.9, 51, "Ivory bridal-inspired festive blend with soft sheen."),
    product(6, "Royal Blue Jacquard Kurta", "/placeholders/product-coming-soon.svg", 16999, 19799, 14, 4.6, 62, "Royal blue jacquard weave with intricate texture and tailored fit."),
    product(7, "Sage Festive Layered Set", "/placeholders/product-coming-soon.svg", 18499, 21499, 14, 4.7, 73, "Sage festive blend with layered silhouette and cushioning feel."),
    product(8, "Rust Silk Bandhgala", "/placeholders/product-coming-soon.svg", 19999, 23299, 14, 4.8, 84, "Rust silk bandhgala fabric with polished, formal sheen."),
  ],
  "premium-collection": PREMIUM_PRODUCTS,
};
