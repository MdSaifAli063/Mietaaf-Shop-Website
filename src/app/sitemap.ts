import type { MetadataRoute } from "next";
import { DUMMY_PRODUCTS } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const staticPaths = [
    "",
    "/shop",
    "/cart",
    "/checkout",
    "/wishlist",
    "/compare",
    "/lookbook",
    "/search",
    "/login",
    "/signup",
    "/forgot-password",
    "/profile",
    "/order-success",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/returns",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  for (const c of CATEGORIES) {
    entries.push({
      url: `${base}/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  for (const p of DUMMY_PRODUCTS) {
    entries.push({
      url: `${base}/product/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }
  return entries;
}
