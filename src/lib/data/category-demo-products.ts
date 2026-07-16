import type { CategorySlug, Product, ProductColor } from "@/types";

type CategoryDemoConfig = {
  category: string;
  names: string[];
  description: string;
  basePrice: number;
  priceStep: number;
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  fabric: string;
  tags: string[];
};

const CATEGORY_DEMO_CONFIG: Record<CategorySlug, CategoryDemoConfig> = {
  sherwani: {
    category: "Sherwani",
    names: [
      "Ivory Palace Sherwani",
      "Emerald Heritage Sherwani",
      "Champagne Zari Sherwani",
      "Midnight Regal Sherwani",
      "Rosewood Groom Sherwani",
      "Pearl Jaal Sherwani",
      "Royal Blue Ceremony Sherwani",
      "Antique Gold Achkan Sherwani",
    ],
    description: "A ceremonial silhouette with refined hand-finished detailing and a structured groom-ready fit.",
    basePrice: 36999,
    priceStep: 3200,
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Ivory", hex: "#f5f0e6" },
      { name: "Emerald", hex: "#14532d" },
      { name: "Royal Blue", hex: "#1e3a8a" },
    ],
    images: [
      "/categories/sherwani.webp",
      "/categories/wedding-collection.webp",
      "/categories/festive-collection.webp",
    ],
    fabric: "Silk blend with tonal embroidery and breathable lining.",
    tags: ["sherwani", "ceremony", "wedding"],
  },
  blazer: {
    category: "Blazer",
    names: [
      "Midnight Peak Blazer",
      "Charcoal Atelier Blazer",
      "Emerald Evening Blazer",
      "Ivory Dinner Blazer",
      "Cobalt Windowpane Blazer",
      "Burgundy Velvet Blazer",
      "Camel Textured Blazer",
      "Onyx Satin-Lapel Blazer",
    ],
    description: "Contemporary tailoring with clean shoulders, precise lapels, and an elegant evening profile.",
    basePrice: 11999,
    priceStep: 1800,
    sizes: ["36", "38", "40", "42", "44"],
    colors: [
      { name: "Midnight", hex: "#172554" },
      { name: "Charcoal", hex: "#334155" },
      { name: "Burgundy", hex: "#7f1d1d" },
    ],
    images: [
      "/categories/blazer.webp",
      "/categories/premium-collection.webp",
      "/categories/suits.webp",
    ],
    fabric: "Premium wool blend with soft construction and satin lining.",
    tags: ["blazer", "formal", "tailoring"],
  },
  coat: {
    category: "Coat",
    names: [
      "Camel Regent Overcoat",
      "Midnight Wool Topcoat",
      "Charcoal Double-Breasted Coat",
      "Olive Heritage Coat",
      "Black Cashmere Coat",
      "Stone Tailored Trench",
      "Navy Ceremony Overcoat",
      "Cognac Belted Coat",
    ],
    description: "A refined outer layer designed with considered proportions, warmth, and polished structure.",
    basePrice: 17999,
    priceStep: 2100,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Camel", hex: "#b88a5a" },
      { name: "Midnight", hex: "#111827" },
      { name: "Olive", hex: "#3f4a36" },
    ],
    images: [
      "/categories/coat.webp",
      "/categories/blazer.webp",
      "/categories/premium-collection.webp",
    ],
    fabric: "Wool-rich blend with satin-lined sleeves.",
    tags: ["coat", "outerwear", "winter"],
  },
  suits: {
    category: "Suits",
    names: [
      "Midnight Executive Suit",
      "Charcoal Ceremony Suit",
      "Ivory Evening Suit",
      "Emerald Tuxedo Suit",
      "Slate Double-Breasted Suit",
      "Onyx Three-Piece Suit",
      "Cognac Dinner Suit",
      "Royal Blue Tailored Suit",
    ],
    description: "Precision tailoring with balanced proportions and a clean, occasion-ready drape.",
    basePrice: 29999,
    priceStep: 2600,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Midnight", hex: "#111827" },
      { name: "Charcoal", hex: "#334155" },
      { name: "Ivory", hex: "#f5f0e6" },
    ],
    images: [
      "/categories/suits.webp",
      "/categories/premium-collection.webp",
      "/categories/blazer.webp",
    ],
    fabric: "Premium textured suiting with tailored construction.",
    tags: ["suits", "formal", "tailoring"],
  },
  kurta: {
    category: "Kurta",
    names: [
      "Sage Embroidered Kurta Set",
      "Ivory Silk Kurta Set",
      "Midnight Festive Kurta",
      "Maroon Jacquard Kurta",
      "Powder Blue Linen Kurta",
      "Mustard Celebration Kurta",
      "Emerald Pintuck Kurta",
      "Stone Minimal Kurta",
    ],
    description: "An effortless kurta silhouette elevated with premium texture and understated festive details.",
    basePrice: 5999,
    priceStep: 900,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Sage", hex: "#a3b18a" },
      { name: "Ivory", hex: "#f5f0e6" },
      { name: "Maroon", hex: "#7f1d1d" },
    ],
    images: [
      "/categories/kurta.webp",
      "/categories/festive-collection.webp",
      "/categories/indo-western.webp",
    ],
    fabric: "Silk-linen blend with breathable cotton lining.",
    tags: ["kurta", "festive", "ethnic"],
  },
  pants: {
    category: "Pants",
    names: [
      "Black Satin-Stripe Trousers",
      "Charcoal Tailored Trousers",
      "Navy Pleated Trousers",
      "Stone Gurkha Trousers",
      "Olive Tapered Trousers",
      "Midnight Formal Trousers",
      "Cognac Relaxed Trousers",
      "Ivory Ceremony Trousers",
    ],
    description: "Tailored trousers with a clean waist, considered taper, and an elegant full-length drape.",
    basePrice: 4499,
    priceStep: 650,
    sizes: ["30", "32", "34", "36", "38", "40"],
    colors: [
      { name: "Black", hex: "#0a0a0a" },
      { name: "Charcoal", hex: "#334155" },
      { name: "Navy", hex: "#172554" },
    ],
    images: [
      "/categories/pants.webp",
      "/categories/suits.webp",
      "/categories/blazer.webp",
    ],
    fabric: "Wool-blend suiting with a smooth, crease-resistant finish.",
    tags: ["pants", "trousers", "formal"],
  },
  "designer-dresses": {
    category: "Designer Dresses",
    names: [
      "Onyx Sculpted Designer Set",
      "Midnight Drape Jacket Set",
      "Emerald Runway Bandhgala",
      "Ivory Asymmetric Designer Set",
      "Burgundy Velvet Statement Set",
      "Cobalt Panelled Jacket Set",
      "Champagne Couture Achkan",
      "Black Embroidered Runway Set",
    ],
    description: "A directional designer look combining sculpted tailoring, statement detail, and occasion-ready comfort.",
    basePrice: 18999,
    priceStep: 2400,
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Onyx", hex: "#111111" },
      { name: "Emerald", hex: "#14532d" },
      { name: "Champagne", hex: "#e8dcc4" },
    ],
    images: [
      "/categories/designer-dresses.webp",
      "/categories/premium-collection.webp",
      "/categories/indo-western.webp",
    ],
    fabric: "Textured wool-silk blend with hand-finished accents.",
    tags: ["designer", "statement", "runway"],
  },
  "indo-western": {
    category: "Indo-Western",
    names: [
      "Teal Architectural Indo-Western",
      "Onyx Draped Indo-Western Set",
      "Ivory Crossover Bandhgala",
      "Burgundy Layered Indo-Western",
      "Midnight Asymmetric Achkan",
      "Sage Contemporary Jacket Set",
      "Cobalt Fusion Bandhgala",
      "Champagne Modern Ceremony Set",
    ],
    description: "Indian craft meets contemporary structure in a versatile fusion silhouette for modern occasions.",
    basePrice: 14999,
    priceStep: 1900,
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Teal", hex: "#115e59" },
      { name: "Onyx", hex: "#111111" },
      { name: "Ivory", hex: "#f5f0e6" },
    ],
    images: [
      "/categories/indo-western.webp",
      "/categories/designer-dresses.webp",
      "/categories/festive-collection.webp",
    ],
    fabric: "Lightweight wool-silk blend with soft structured lining.",
    tags: ["indo-western", "fusion", "ceremony"],
  },
  "wedding-collection": {
    category: "Wedding Collection",
    names: [
      "Ivory Maharaja Groom Set",
      "Emerald Palace Wedding Set",
      "Champagne Heirloom Sherwani",
      "Rosewood Reception Achkan",
      "Pearl Zardozi Groom Set",
      "Royal Blue Wedding Bandhgala",
      "Antique Gold Ceremony Set",
      "Midnight Groom Tuxedo",
    ],
    description: "A groom-focused ceremonial look shaped by heirloom craft, refined proportion, and luxurious finish.",
    basePrice: 42999,
    priceStep: 3800,
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Ivory Gold", hex: "#f5f0e6" },
      { name: "Emerald", hex: "#14532d" },
      { name: "Rosewood", hex: "#6b2f35" },
    ],
    images: [
      "/categories/wedding-collection.webp",
      "/categories/sherwani.webp",
      "/categories/festive-collection.webp",
    ],
    fabric: "Premium silk base with zari and tonal hand embroidery.",
    tags: ["wedding", "groom", "ceremony"],
  },
  "festive-collection": {
    category: "Festive Collection",
    names: [
      "Emerald Diwali Bandhgala",
      "Marigold Brocade Kurta Set",
      "Wine Festive Achkan",
      "Ivory Celebration Jacket Set",
      "Royal Blue Jacquard Kurta",
      "Sage Festive Layered Set",
      "Rust Silk Bandhgala",
      "Midnight Metallic Kurta Set",
    ],
    description: "Rich festive colour, tactile fabric, and considered detailing for celebrations throughout the season.",
    basePrice: 10999,
    priceStep: 1500,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Emerald", hex: "#14532d" },
      { name: "Marigold", hex: "#d97706" },
      { name: "Wine", hex: "#722f37" },
    ],
    images: [
      "/categories/festive-collection.webp",
      "/categories/kurta.webp",
      "/categories/wedding-collection.webp",
    ],
    fabric: "Silk-brocade blend with jacquard texture.",
    tags: ["festive", "celebration", "brocade"],
  },
  "premium-collection": {
    category: "Premium Collection",
    names: [
      "Noir Atelier Tuxedo",
      "Ivory Signature Bandhgala",
      "Emerald Full-Canvas Suit",
      "Camel Cashmere Dinner Jacket",
      "Midnight Hand-Finished Tuxedo",
      "Slate Bespoke Double-Breasted Suit",
      "Burgundy Velvet Atelier Set",
      "Champagne Limited-Edition Achkan",
    ],
    description: "Limited-edition tailoring made with elevated fabric, meticulous construction, and signature finishing.",
    basePrice: 34999,
    priceStep: 3600,
    sizes: ["36", "38", "40", "42", "44", "46"],
    colors: [
      { name: "Noir", hex: "#0a0a0a" },
      { name: "Ivory", hex: "#f5f0e6" },
      { name: "Emerald", hex: "#14532d" },
    ],
    images: [
      "/categories/premium-collection.webp",
      "/categories/suits.webp",
      "/categories/blazer.webp",
    ],
    fabric: "Luxury wool-silk blend with full-canvas construction.",
    tags: ["premium", "atelier", "limited"],
  },
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createCategoryDemoProducts(
  existingProducts: Product[],
  minimumPerCategory = 8,
): Product[] {
  return (Object.entries(CATEGORY_DEMO_CONFIG) as [CategorySlug, CategoryDemoConfig][])
    .flatMap(([categorySlug, config]) => {
      const existingCount = existingProducts.filter(
        (product) => product.categorySlug === categorySlug,
      ).length;
      const needed = Math.max(0, minimumPerCategory - existingCount);

      return config.names.slice(0, needed).map((name, index): Product => {
        const price = config.basePrice + config.priceStep * index;
        const primaryImage = config.images[index % config.images.length]!;
        const secondaryImage = config.images[(index + 1) % config.images.length]!;

        return {
          id: `demo-${categorySlug}-${index + 1}`,
          slug: `demo-${slugify(name)}`,
          name,
          description: config.description,
          price,
          compareAtPrice: Math.round((price * 1.16) / 100) * 100 - 1,
          discountPercent: 14,
          category: config.category,
          categorySlug,
          sizes: config.sizes,
          colors: config.colors,
          images: [primaryImage, secondaryImage],
          rating: Number((4.5 + (index % 5) * 0.1).toFixed(1)),
          reviewCount: 18 + index * 11,
          stock: 8 + index * 3,
          fabric: config.fabric,
          tags: config.tags,
          featured: index < 2,
          trending: index % 3 === 0,
          newArrival: index % 2 === 0,
          wedding: categorySlug === "wedding-collection" || categorySlug === "sherwani",
          popularity: 78 + index * 2,
        };
      });
    });
}
