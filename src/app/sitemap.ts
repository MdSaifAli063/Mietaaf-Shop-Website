import type { MetadataRoute } from "next";
import { DUMMY_PRODUCTS } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";
import { getSiteUrl } from "@/lib/seo";

function hasIndexableImage(images: readonly string[]): boolean {
  return images.some((image) => !image.includes("/placeholders/product-coming-soon.svg"));
}

export default function sitemap(): MetadataRoute.Sitemap {
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

  for (const c of CATEGORIES) {
    entries.push({
      url: `${base}/category/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  const seenProductSlugs = new Set<string>();
  for (const p of DUMMY_PRODUCTS) {
    if (seenProductSlugs.has(p.slug)) continue;
    if (!hasIndexableImage(p.images)) continue;
    seenProductSlugs.add(p.slug);
    entries.push({
      url: `${base}/product/${p.slug}`,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }
  return entries;
}
