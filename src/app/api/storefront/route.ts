import { fetchCollectionREST, fetchDocumentREST } from "@/lib/firebase-rest";
import { SHOP_PRODUCTS } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";
import { BANNERS } from "@/lib/data/banners";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import { mergeStorefrontRecords, type PublicStorefront } from "@/lib/public-storefront";
import type { Banner, Category, Product, SiteSettings } from "@/types";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    // Only public catalogue/settings documents: never users, cart or order data.
    const [products, categories, banners, site, global] = await Promise.all([
      fetchCollectionREST("products"), fetchCollectionREST("categories"), fetchCollectionREST("banners"),
      fetchDocumentREST("settings", "site", true), fetchDocumentREST("settings", "global", true),
    ]);
    // Do not turn a temporary outage into a successful empty/default publication.
    if (products === null || categories === null || banners === null) return Response.json({ error: "The catalogue is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
    const data: PublicStorefront = {
      allProducts: mergeStorefrontRecords(SHOP_PRODUCTS, products as unknown as Product[], item => item.slug),
      allCategories: mergeStorefrontRecords(CATEGORIES, categories as unknown as Category[], item => item.slug),
      allBanners: mergeStorefrontRecords(BANNERS, banners as unknown as Banner[], item => item.id),
      settings: { ...DEFAULT_SITE_SETTINGS, ...Object.fromEntries(Object.keys(DEFAULT_SITE_SETTINGS).filter(key => site && key in site).map(key => [key, site![key]])) } as SiteSettings,
      logoUrl: typeof global?.logoUrl === "string" ? global.logoUrl : null,
    };
    return Response.json(data, { headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=120" } });
  } catch {
    return Response.json({ error: "The catalogue is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
