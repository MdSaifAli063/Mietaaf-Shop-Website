import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/account",
        "/profile",
        "/cart",
        "/checkout",
        "/login",
        "/signup",
        "/forgot-password",
        "/search",
        "/compare",
        "/wishlist",
        "/order-success",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
