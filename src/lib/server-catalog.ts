import { cache } from "react";
import { DUMMY_PRODUCTS } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";
import { fetchCollectionREST } from "@/lib/firebase-rest";
import type { Category, Product } from "@/types";

const text = (value: unknown, fallback = "") => typeof value === "string" && value.trim() ? value.trim() : fallback;
const number = (value: unknown, fallback: number) => typeof value === "number" && Number.isFinite(value) ? value : fallback;
const strings = (value: unknown, fallback: string[] = []) => Array.isArray(value)
  ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
  : fallback;

/** Apply admin edits before rendering metadata, schema, visible details, or sitemaps. */
export function mergeServerProducts(records: Record<string, unknown>[]): Product[] {
  const products = new Map(DUMMY_PRODUCTS.map(product => [product.slug, product]));
  for (const raw of records) {
    const slug = text(raw.slug);
    if (!slug) continue;
    if (raw.hidden === true || raw.deleted === true) { products.delete(slug); continue; }
    const old = products.get(slug);
    const name = text(raw.name, old?.name);
    const price = number(raw.price, old?.price ?? -1);
    if (!name || price < 0) continue;
    const categorySlug = text(raw.categorySlug, old?.categorySlug ?? "premium-collection");
    const colors = Array.isArray(raw.colors) ? raw.colors.flatMap(value => {
      if (!value || typeof value !== "object") return [];
      const color = value as Record<string, unknown>;
      return text(color.name) ? [{ name: text(color.name), hex: text(color.hex, "#302a24") }] : [];
    }) : old?.colors ?? [];
    products.set(slug, {
      ...old,
      id: text(raw.id, old?.id ?? slug), slug, name, price, categorySlug,
      description: text(raw.description, old?.description ?? "A thoughtfully crafted Mietaaf Couture piece."),
      category: text(raw.category, old?.category ?? CATEGORIES.find(c => c.slug === categorySlug)?.name ?? "Collection"),
      compareAtPrice: number(raw.compareAtPrice, old?.compareAtPrice ?? 0) || undefined,
      discountPercent: number(raw.discountPercent, old?.discountPercent ?? 0) || undefined,
      images: strings(raw.images, text(raw.image) ? [text(raw.image)] : old?.images ?? ["/placeholders/product-coming-soon.svg"]),
      sizes: strings(raw.sizes, old?.sizes ?? ["S", "M", "L", "XL"]),
      colors,
      rating: Math.min(5, Math.max(0, number(raw.rating, old?.rating ?? 0))),
      reviewCount: Math.max(0, Math.round(number(raw.reviewCount, old?.reviewCount ?? 0))),
      stock: Math.max(0, Math.round(number(raw.stock, old?.stock ?? 0))),
      fabric: text(raw.fabric, old?.fabric ?? "Premium fabric"),
      tags: strings(raw.tags, old?.tags),
      catalogTitle: text(raw.catalogTitle, old?.catalogTitle) || undefined,
      catalogBullets: strings(raw.catalogBullets, old?.catalogBullets),
      featured: typeof raw.featured === "boolean" ? raw.featured : old?.featured,
      trending: typeof raw.trending === "boolean" ? raw.trending : old?.trending,
      newArrival: typeof raw.newArrival === "boolean" ? raw.newArrival : old?.newArrival,
      wedding: typeof raw.wedding === "boolean" ? raw.wedding : old?.wedding,
      popularity: number(raw.popularity, old?.popularity ?? 0),
      hidden: false, deleted: false,
    });
  }
  return [...products.values()].filter(product => !product.hidden && !product.deleted);
}

export function mergeServerCategories(records: Record<string, unknown>[]): Category[] {
  const categories = new Map(CATEGORIES.map(category => [category.slug, category]));
  for (const raw of records) {
    const slug = text(raw.slug);
    if (!slug) continue;
    if (raw.hidden === true || raw.deleted === true) { categories.delete(slug); continue; }
    const old = categories.get(slug);
    const name = text(raw.name, old?.name);
    if (!name) continue;
    categories.set(slug, {
      slug, name,
      description: text(raw.description, old?.description),
      image: text(raw.image, old?.image),
    });
  }
  return [...categories.values()].filter(category => !category.hidden && !category.deleted);
}

export const getServerProducts = cache(async () => mergeServerProducts(await fetchCollectionREST("products") ?? []));
export const getServerCategories = cache(async () => mergeServerCategories(await fetchCollectionREST("categories") ?? []));

export function hasIndexableProductImage(product: Pick<Product, "images">): boolean {
  return product.images.some(image => Boolean(image.trim()) && !image.includes("/placeholders/product-coming-soon.svg"));
}
