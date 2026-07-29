import type { MetadataRoute } from "next";
import { DUMMY_PRODUCTS } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";
import { fetchCollectionREST } from "@/lib/firebase-rest";
import { getSiteUrl } from "@/lib/seo";

export const revalidate = 3600;

function hasIndexableImage(images: readonly string[]): boolean {
  return images.some((image) => !image.includes("/placeholders/product-coming-soon.svg"));
}

function stringField(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value.trim() : "";
}

function imageFields(record: Record<string, unknown>): string[] {
  const images = record.images;
  if (Array.isArray(images)) {
    return images.filter(
      (image): image is string => typeof image === "string" && image.trim().length > 0,
    );
  }
  const image = stringField(record, "image");
  return image ? [image] : [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticPaths = [
    "",
    "/shop",
    "/lookbook",
    "/fabrics",
    "/appointment",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/returns",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" || path === "/shop" ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.7,
  }));

  const categories = new Map(CATEGORIES.map((category) => [category.slug, category]));
  const products = new Map(
    DUMMY_PRODUCTS.map((product) => [
      product.slug,
      { slug: product.slug, images: product.images },
    ]),
  );
  const [remoteCategories, remoteProducts] = await Promise.all([
    fetchCollectionREST("categories"),
    fetchCollectionREST("products"),
  ]);

  for (const raw of remoteCategories ?? []) {
    const slug = stringField(raw, "slug");
    if (!slug) continue;
    if (raw.hidden === true || raw.deleted === true) {
      categories.delete(slug);
      continue;
    }
    const fallback = categories.get(slug);
    categories.set(slug, {
      slug,
      name: stringField(raw, "name") || fallback?.name || slug,
      description: stringField(raw, "description") || fallback?.description || "",
      image: stringField(raw, "image") || fallback?.image || "",
    });
  }

  for (const raw of remoteProducts ?? []) {
    const slug = stringField(raw, "slug");
    if (!slug) continue;
    if (raw.hidden === true || raw.deleted === true) {
      products.delete(slug);
      continue;
    }
    const images = imageFields(raw);
    const fallback = products.get(slug);
    products.set(slug, {
      slug,
      images: images.length ? images : fallback?.images ?? [],
    });
  }

  for (const c of categories.values()) {
    entries.push({
      url: `${base}/category/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  for (const p of products.values()) {
    if (!hasIndexableImage(p.images)) continue;
    entries.push({
      url: `${base}/product/${p.slug}`,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }
  return entries;
}
