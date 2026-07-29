import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/data/categories";
import { PageEnter } from "@/components/motion/page-enter";
import type { CategorySlug } from "@/types";
import { BreadcrumbJsonLd, CategoryJsonLd } from "@/components/seo/json-ld";
import { publicPageMetadata } from "@/lib/seo";
import { CategoryCollectionView } from "@/components/category/category-collection-view";
import { fetchCollectionREST } from "@/lib/firebase-rest";
import type { Category } from "@/types";

const slugs = CATEGORIES.map((category) => category.slug);

const resolveCategory = cache(async (slug: string): Promise<Category | null> => {
  const local = CATEGORIES.find((item) => item.slug === slug);
  if (local) return local;
  const documents = await fetchCollectionREST("categories");
  const match = documents?.find(
    (entry) => (entry as Record<string, unknown>).slug === slug,
  ) as Record<string, unknown> | undefined;
  if (
    !match ||
    typeof match.name !== "string" ||
    typeof match.description !== "string" ||
    typeof match.image !== "string"
  ) {
    return null;
  }
  return {
    slug,
    name: match.name,
    description: match.description,
    image: match.image,
    hidden: match.hidden === true,
    deleted: match.deleted === true,
  };
});

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await resolveCategory(slug);
  if (!category) return { title: "Category" };
  return publicPageMetadata({
    title: category.name,
    description: category.description,
    path: `/category/${category.slug}`,
    image: category.image,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await resolveCategory(slug);
  if (!category || category.hidden || category.deleted) notFound();

  return (
    <PageEnter>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
          { name: category.name, url: `/category/${category.slug}` },
        ]}
      />
      <CategoryJsonLd category={category} />
      <CategoryCollectionView slug={slug as CategorySlug} fallbackCategory={category} />
    </PageEnter>
  );
}
