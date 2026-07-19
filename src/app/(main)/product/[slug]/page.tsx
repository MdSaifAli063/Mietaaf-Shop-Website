import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import { DUMMY_PRODUCTS, getProductBySlug } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { CatalogProductDetailView } from "@/components/product/catalog-product-detail-view";
import { isCatalogProduct } from "@/lib/data/catalog-suits";
import { fetchCollectionREST } from "@/lib/firebase-rest";
import type { CategorySlug, Product, ProductColor } from "@/types";

const categorySlugs = new Set<string>(CATEGORIES.map((category) => category.slug));

function finiteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function remoteProduct(raw: Record<string, unknown>, requestedSlug: string): Product | null {
  const slug = typeof raw.slug === "string" ? raw.slug.trim() : "";
  if (!slug || slug !== requestedSlug || typeof raw.name !== "string") return null;

  const price = finiteNumber(raw.price, -1);
  if (price < 0) return null;

  const rawImages = Array.isArray(raw.images)
    ? raw.images
    : typeof raw.image === "string"
      ? [raw.image]
      : [];
  const images = rawImages.filter(
    (image): image is string => typeof image === "string" && image.trim().length > 0,
  );

  const rawSizes = Array.isArray(raw.sizes) ? raw.sizes : [];
  const sizes = rawSizes.filter(
    (size): size is string => typeof size === "string" && size.trim().length > 0,
  );

  const colors: ProductColor[] = Array.isArray(raw.colors)
    ? raw.colors.flatMap((color) => {
        if (!color || typeof color !== "object") return [];
        const entry = color as Record<string, unknown>;
        if (typeof entry.name !== "string") return [];
        return [{
          name: entry.name,
          hex: typeof entry.hex === "string" ? entry.hex : "#2d2926",
        }];
      })
    : [];

  const requestedCategory =
    typeof raw.categorySlug === "string" && categorySlugs.has(raw.categorySlug)
      ? (raw.categorySlug as CategorySlug)
      : "premium-collection";
  const category = CATEGORIES.find((entry) => entry.slug === requestedCategory);
  const compareAtPrice = finiteNumber(raw.compareAtPrice, 0) || undefined;
  const calculatedDiscount = compareAtPrice && compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : undefined;

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : slug,
    slug,
    name: raw.name.trim(),
    description:
      typeof raw.description === "string" && raw.description.trim()
        ? raw.description.trim()
        : "A thoughtfully crafted Mietaaf piece for modern celebrations.",
    price,
    compareAtPrice,
    discountPercent: finiteNumber(raw.discountPercent, calculatedDiscount ?? 0) || undefined,
    category:
      typeof raw.category === "string" && raw.category.trim()
        ? raw.category.trim()
        : category?.name ?? "Collection",
    categorySlug: requestedCategory,
    sizes: sizes.length > 0 ? sizes : ["S", "M", "L", "XL"],
    colors: colors.length > 0 ? colors : [{ name: "Classic", hex: "#2d2926" }],
    images: images.length > 0 ? images : ["/placeholders/product-coming-soon.svg"],
    rating: Math.min(5, Math.max(0, finiteNumber(raw.rating, 0))),
    reviewCount: Math.max(0, Math.round(finiteNumber(raw.reviewCount, 0))),
    stock: Math.max(0, Math.round(finiteNumber(raw.stock, 1))),
    fabric:
      typeof raw.fabric === "string" && raw.fabric.trim()
        ? raw.fabric.trim()
        : "Premium fabric",
    tags: Array.isArray(raw.tags)
      ? raw.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    featured: raw.featured === true,
    trending: raw.trending === true,
    newArrival: raw.newArrival === true,
    wedding: raw.wedding === true,
    popularity: finiteNumber(raw.popularity, 0),
  };
}

const resolveProduct = cache(async (slug: string): Promise<Product | null> => {
  const local = getProductBySlug(slug);
  if (local) return local;

  const documents = await fetchCollectionREST("products");
  if (!documents) return null;
  for (const document of documents) {
    const product = remoteProduct(document, slug);
    if (product) return product;
  }
  return null;
});

export function generateStaticParams() {
  return DUMMY_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await resolveProduct(slug);
  if (!p) return { title: "Product" };
  return {
    title: p.name,
    description: p.description.slice(0, 160),
    openGraph: { images: [{ url: p.images[0]! }] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await resolveProduct(slug);
  if (!p) notFound();
  if (isCatalogProduct(p)) {
    return (
      <Suspense fallback={<ProductDetailFallback />}>
        <CatalogProductDetailView product={p} />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<ProductDetailFallback />}>
      <ProductDetailView product={p} />
    </Suspense>
  );
}

function ProductDetailFallback() {
  return (
    <div className="page-container py-12">
      <div className="grid animate-pulse gap-8 lg:grid-cols-2">
        <div className="aspect-[3/4] rounded-2xl bg-muted" />
        <div className="space-y-5 py-4">
          <div className="h-12 w-3/4 rounded-xl bg-muted" />
          <div className="h-6 w-1/3 rounded-lg bg-muted" />
          <div className="h-10 w-1/2 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
