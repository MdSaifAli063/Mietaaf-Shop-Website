import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/data/categories";
import { PageEnter } from "@/components/motion/page-enter";
import { BreadcrumbJsonLd, CategoryJsonLd } from "@/components/seo/json-ld";
import { publicPageMetadata } from "@/lib/seo";
import { CategoryCollectionView } from "@/components/category/category-collection-view";
import { getServerCategories, getServerProducts } from "@/lib/server-catalog";

export const revalidate = 60;

async function resolveCategory(slug: string) {
  return (await getServerCategories()).find(category => category.slug === slug);
}

export function generateStaticParams() {
  return CATEGORIES.map(category => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await resolveCategory(slug);
  if (!category) notFound();
  return publicPageMetadata({
    title: `${category.name} in Bangalore`,
    description: `Explore ${category.name.toLowerCase()} at Mietaaf Couture in Bangalore. ${category.description} Browse the collection and arrange a personal fitting.`.slice(0, 160),
    path: `/category/${category.slug}`,
    image: category.image || undefined,
    keywords: [category.name, `${category.name} Bangalore`],
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await resolveCategory(slug);
  if (!category) notFound();
  const products = (await getServerProducts()).filter(product => product.categorySlug === slug);
  return (
    <PageEnter>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Shop", url: "/shop" },
        { name: category.name, url: `/category/${category.slug}` },
      ]} />
      <CategoryJsonLd category={category} />
      <CategoryCollectionView slug={slug} fallbackCategory={category} fallbackProducts={products} />
    </PageEnter>
  );
}
