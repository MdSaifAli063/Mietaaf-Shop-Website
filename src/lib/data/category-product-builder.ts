import type { CategorySlug, Product, ProductColor } from "@/types";
import { CATEGORY_PRODUCTS } from "@/lib/data/category-products";
import { CATEGORY_IMAGE_LINKS } from "@/lib/data/image-links/category-images";

type CategoryDetails = {
  category: string;
  description: string;
  sizes: string[];
  colors: ProductColor[];
  fabric: string;
  tags: string[];
};

/** Shared category copy used to build the canonical storefront inventory. */
const CATEGORY_DETAILS: Record<CategorySlug, CategoryDetails> = {
  sherwani: {
    category: "Sherwani",
    description: "A ceremonial silhouette with refined hand-finished detailing and a structured groom-ready fit.",
    sizes: ["38", "40", "42", "44", "46"],
    colors: [{ name: "Ivory", hex: "#f5f0e6" }, { name: "Emerald", hex: "#14532d" }, { name: "Royal Blue", hex: "#1e3a8a" }],
    fabric: "Silk blend with tonal embroidery and breathable lining.",
    tags: ["sherwani", "ceremony", "wedding"],
  },
  blazer: {
    category: "Blazer",
    description: "Contemporary tailoring with clean shoulders, precise lapels, and an elegant evening profile.",
    sizes: ["36", "38", "40", "42", "44"],
    colors: [{ name: "Midnight", hex: "#172554" }, { name: "Charcoal", hex: "#334155" }, { name: "Burgundy", hex: "#7f1d1d" }],
    fabric: "Premium wool blend with soft construction and satin lining.",
    tags: ["blazer", "formal", "tailoring"],
  },
  coat: {
    category: "Coat",
    description: "A refined outer layer designed with considered proportions, warmth, and polished structure.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Camel", hex: "#b88a5a" }, { name: "Midnight", hex: "#111827" }, { name: "Olive", hex: "#3f4a36" }],
    fabric: "Wool-rich blend with satin-lined sleeves.",
    tags: ["coat", "outerwear", "winter"],
  },
  suits: {
    category: "Suits",
    description: "Precision tailoring with balanced proportions and a clean, occasion-ready drape.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Midnight", hex: "#111827" }, { name: "Charcoal", hex: "#334155" }, { name: "Ivory", hex: "#f5f0e6" }],
    fabric: "Premium textured suiting with tailored construction.",
    tags: ["suits", "formal", "tailoring"],
  },
  kurta: {
    category: "Kurta",
    description: "An effortless kurta silhouette elevated with premium texture and understated festive details.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Sage", hex: "#a3b18a" }, { name: "Ivory", hex: "#f5f0e6" }, { name: "Maroon", hex: "#7f1d1d" }],
    fabric: "Silk-linen blend with breathable cotton lining.",
    tags: ["kurta", "festive", "ethnic"],
  },
  pants: {
    category: "Pants",
    description: "Tailored trousers with a clean waist, considered taper, and an elegant full-length drape.",
    sizes: ["30", "32", "34", "36", "38", "40"],
    colors: [{ name: "Black", hex: "#0a0a0a" }, { name: "Charcoal", hex: "#334155" }, { name: "Navy", hex: "#172554" }],
    fabric: "Wool-blend suiting with a smooth, crease-resistant finish.",
    tags: ["pants", "trousers", "formal"],
  },
  "designer-dresses": {
    category: "Designer Dresses",
    description: "A directional designer look combining sculpted tailoring, statement detail, and occasion-ready comfort.",
    sizes: ["38", "40", "42", "44", "46"],
    colors: [{ name: "Onyx", hex: "#111111" }, { name: "Emerald", hex: "#14532d" }, { name: "Champagne", hex: "#e8dcc4" }],
    fabric: "Textured wool-silk blend with hand-finished accents.",
    tags: ["designer", "statement", "runway"],
  },
  "indo-western": {
    category: "Indo-Western",
    description: "Indian craft meets contemporary structure in a versatile fusion silhouette for modern occasions.",
    sizes: ["38", "40", "42", "44", "46"],
    colors: [{ name: "Teal", hex: "#115e59" }, { name: "Onyx", hex: "#111111" }, { name: "Ivory", hex: "#f5f0e6" }],
    fabric: "Lightweight wool-silk blend with soft structured lining.",
    tags: ["indo-western", "fusion", "ceremony"],
  },
  "wedding-collection": {
    category: "Wedding Collection",
    description: "A groom-focused ceremonial look shaped by heirloom craft, refined proportion, and luxurious finish.",
    sizes: ["38", "40", "42", "44", "46"],
    colors: [{ name: "Ivory Gold", hex: "#f5f0e6" }, { name: "Emerald", hex: "#14532d" }, { name: "Rosewood", hex: "#6b2f35" }],
    fabric: "Premium silk base with zari and tonal hand embroidery.",
    tags: ["wedding", "groom", "ceremony"],
  },
  "festive-collection": {
    category: "Festive Collection",
    description: "Rich festive colour, tactile fabric, and considered detailing for celebrations throughout the season.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Emerald", hex: "#14532d" }, { name: "Marigold", hex: "#d97706" }, { name: "Wine", hex: "#722f37" }],
    fabric: "Silk-brocade blend with jacquard texture.",
    tags: ["festive", "celebration", "brocade"],
  },
  "premium-collection": {
    category: "Premium Collection",
    description: "Limited-edition tailoring made with elevated fabric, meticulous construction, and signature finishing.",
    sizes: ["36", "38", "40", "42", "44", "46"],
    colors: [{ name: "Noir", hex: "#0a0a0a" }, { name: "Ivory", hex: "#f5f0e6" }, { name: "Emerald", hex: "#14532d" }],
    fabric: "Luxury wool-silk blend with full-canvas construction.",
    tags: ["premium", "atelier", "limited"],
  },
};

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function createCategoryDemoProducts(
  existingProducts: Product[],
  minimumPerCategory = 8,
): Product[] {
  return (Object.entries(CATEGORY_DETAILS) as [CategorySlug, CategoryDetails][]).flatMap(
    ([categorySlug, details]) => {
      const existingCount = existingProducts.filter(
        (product) => product.categorySlug === categorySlug,
      ).length;
      const items = CATEGORY_PRODUCTS[categorySlug].slice(
        existingCount,
        Math.max(existingCount, minimumPerCategory),
      );

      return items.map((item): Product => ({
        id: `demo-${categorySlug}-${item.number}`,
        slug: `demo-${slugify(item.name)}`,
        name: item.name,
        description: details.description,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        discountPercent: item.discountPercent,
        category: details.category,
        categorySlug,
        sizes: details.sizes,
        colors: details.colors,
        images: [item.image || CATEGORY_IMAGE_LINKS[categorySlug]],
        rating: item.rating,
        reviewCount: item.reviewCount,
        stock: 8 + item.number * 3,
        fabric: details.fabric,
        tags: details.tags,
        featured: item.number <= 2,
        trending: item.number % 3 === 1,
        newArrival: item.number % 2 === 1,
        wedding: categorySlug === "wedding-collection" || categorySlug === "sherwani",
        popularity: 76 + item.number * 2,
      }));
    },
  );
}

/** Applies the canonical editable row to each visible category product. */
export function applyNumberedCategoryProductDetails(products: Product[]): Product[] {
  const positions = new Map<CategorySlug, number>();

  return products.map((product) => {
    const position = positions.get(product.categorySlug) ?? 0;
    positions.set(product.categorySlug, position + 1);
    const item = CATEGORY_PRODUCTS[product.categorySlug][position];
    if (!item) return product;

    return {
      ...product,
      name: item.name,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      discountPercent: item.discountPercent,
      rating: item.rating,
      reviewCount: item.reviewCount,
      images: item.image ? [item.image] : product.images,
    };
  });
}
