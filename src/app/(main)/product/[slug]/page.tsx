import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DUMMY_PRODUCTS, getProductBySlug } from "@/lib/data/products";
import { ProductDetailView } from "@/components/product/product-detail-view";

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
  return <ProductDetailView product={p} />;
}
