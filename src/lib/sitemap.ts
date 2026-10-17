import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { FABRIC_HERO_IMAGE } from "@/lib/data/fabrics";
import { getServerFabrics } from "@/lib/server-fabrics";
import { getServerCategories, getServerProducts, hasIndexableProductImage } from "@/lib/server-catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fabrics = await getServerFabrics();
  const paths = ["/", "/shop", "/lookbook", "/fabrics", "/appointment", "/about", "/contact", "/faq", "/privacy", "/terms", "/returns"];
  const entries: MetadataRoute.Sitemap = paths.map(path => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" || path === "/shop" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/shop" ? 0.9 : 0.7,
    ...(path === "/fabrics" ? { images: [FABRIC_HERO_IMAGE, ...fabrics.map(catalogue => catalogue.image)].map(absoluteUrl) } : {}),
  }));
  const [categories, products] = await Promise.all([getServerCategories(), getServerProducts()]);
  for (const category of categories) {
    entries.push({
      url: absoluteUrl(`/category/${category.slug}`),
      changeFrequency: "weekly", priority: 0.8,
      images: category.image ? [absoluteUrl(category.image)] : undefined,
    });
  }
  for (const product of products) {
    if (!hasIndexableProductImage(product)) continue;
    entries.push({
      url: absoluteUrl(`/product/${product.slug}`),
      changeFrequency: "weekly", priority: 0.8,
      images: product.images.filter(image => image.trim() && !image.includes("/placeholders/product-coming-soon.svg")).map(absoluteUrl),
    });
  }
  return entries;
}

const xmlEntities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };
const escapeXml = (value: string) => value.replace(/[&<>"']/g, character => xmlEntities[character]);

/** Escape every URL, including query strings in first- and third-party images. */
export function renderSitemap(entries: MetadataRoute.Sitemap): string {
  const rows = entries.map(entry => {
    const modified = entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified;
    return [
      "<url>",
      `<loc>${escapeXml(entry.url)}</loc>`,
      ...(modified ? [`<lastmod>${escapeXml(modified)}</lastmod>`] : []),
      ...(entry.changeFrequency ? [`<changefreq>${entry.changeFrequency}</changefreq>`] : []),
      ...(typeof entry.priority === "number" ? [`<priority>${entry.priority}</priority>`] : []),
      ...(entry.images ?? []).map(image => `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`),
      "</url>",
    ].join("\n");
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${rows.join("\n")}\n</urlset>\n`;
}
