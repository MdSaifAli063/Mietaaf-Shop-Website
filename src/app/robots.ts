import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexingDisabled } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  if (isIndexingDisabled()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${base}/sitemap.xml`,
      host: base,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
