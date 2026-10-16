import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DUMMY_PRODUCTS } from "@/lib/data/products";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/seo/json-ld";
import { noIndexMetadata, publicPageMetadata } from "@/lib/seo";
import { getServerCategories, getServerProducts, hasIndexableProductImage } from "@/lib/server-catalog";
import { ManagedProductDetail } from "@/components/product/managed-product-detail";

export const revalidate = 60;

async function resolveProduct(slug: string) {
  return (await getServerProducts()).find(product => product.slug === slug);
}

export function generateStaticParams() {
  return DUMMY_PRODUCTS.map(product => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProduct(slug);
  if (!product) notFound();
  const image = product.images.find(image => !image.includes("/placeholders/product-coming-soon.svg"));
  const metadata = publicPageMetadata({
    title: product.name,
    description: `${product.name} by Mietaaf Couture. ${product.description}`.slice(0, 160),
    path: `/product/${product.slug}`,
    image,
    keywords: [product.name, product.category, `${product.category} Bangalore`],
  });
  return hasIndexableProductImage(product) ? metadata : { ...metadata, ...noIndexMetadata };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await resolveProduct(slug);
  if (!product) notFound();
  const category = (await getServerCategories()).find(category => category.slug === product.categorySlug);
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Shop", url: "/shop" },
        ...(category ? [{ name: category.name, url: `/category/${category.slug}` }] : []),
        { name: product.name, url: `/product/${product.slug}` },
      ]} />
      <ProductJsonLd product={product} />
      <Suspense fallback={<ProductDetailFallback />}>
        <ManagedProductDetail fallbackProduct={product} />
      </Suspense>
    </>
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
