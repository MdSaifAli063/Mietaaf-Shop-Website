import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DUMMY_PRODUCTS, getProductBySlug } from "@/lib/data/products";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { CatalogProductDetailView } from "@/components/product/catalog-product-detail-view";
import { isCatalogProduct } from "@/lib/data/catalog-suits";

export function generateStaticParams() {
  return DUMMY_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
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
  const p = getProductBySlug(slug);
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
