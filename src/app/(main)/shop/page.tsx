import type { Metadata } from "next";
import { ShopExplorer } from "@/components/shop/shop-explorer";
import { publicPageMetadata } from "@/lib/seo";
import { getServerCategories, getServerProducts } from "@/lib/server-catalog";
import { BreadcrumbJsonLd, PageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = publicPageMetadata({
  title: "Shop Men's Wedding & Formal Wear",
  description:
    "Shop Mietaaf Couture suits, sherwanis, blazers, kurtas and Indo-Western menswear. Visit our Bangalore atelier by appointment or order through WhatsApp.",
  path: "/shop",
});

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const query = await searchParams;
  const initialCategory = typeof query.category === "string" ? query.category : "all";
  const [products, categories] = await Promise.all([getServerProducts(), getServerCategories()]);
  return (
    <>
      <PageJsonLd type="CollectionPage" title="Shop Mietaaf Couture Menswear" description="Custom-tailored suits, sherwanis, wedding and formal menswear from Mietaaf Couture, Bangalore." path="/shop" />
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Shop", url: "/shop" }]} />
      <ShopExplorer key={initialCategory} initialCategory={initialCategory} fallbackProducts={products} fallbackCategories={categories} />
    </>
  );
}
