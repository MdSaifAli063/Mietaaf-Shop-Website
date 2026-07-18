/**
 * EDIT HOMEPAGE PRODUCT PLACEMENT HERE
 *
 * Product details are edited once in category-products.ts. These unique slugs
 * only decide which canonical products appear in each homepage section.
 * Do not place the same slug in two sections; runtime selection also guards
 * against duplicate IDs or names if this file is edited accidentally.
 */
export const HOME_PRODUCT_SECTIONS = {
  trending: [
    "royal-embroidered-sherwani",
    "midnight-architect-blazer",
    "silk-festive-kurta-set",
    "midnight-velvet-tuxedo",
  ],
  newArrivals: [
    "cashmere-overcoat",
    "minimal-linen-kurta",
    "onyx-embroidered-bandhgala",
    "ivory-royale-suit-set",
  ],
  weddingCollection: [
    "ceremonial-threadwork-sherwani",
    "ivory-lotus-achkan-set",
    "champagne-ceremony-bandhgala",
  ],
  premiumSuits: [
    "noir-panther-suit-set",
    "burgundy-beaded-tuxedo-set",
  ],
  feed: [
    "pleated-tuxedo-trousers",
    "velvet-designer-drape",
    "indo-western-bandhgala",
    "silk-brocade-festive-bandhgala",
    "structured-trench-coat",
    "monochrome-indo-set",
  ],
} as const;
