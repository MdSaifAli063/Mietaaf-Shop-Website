"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category, CategorySlug, Product } from "@/types";
import { useShopData } from "@/hooks/use-shop-data";
import { ProductCard } from "@/components/product/product-card";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import { bypassImageOptimization } from "@/lib/image-source";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function CategoryCollectionView({ slug, fallbackCategory, fallbackProducts }: { slug: CategorySlug; fallbackCategory: Category; fallbackProducts: Product[] }) {
  const { products, allCategories, loading, productsSynced, categoriesSynced } = useShopData();
  const category = (categoriesSynced ? allCategories.find((item) => item.slug === slug) : undefined) ?? fallbackCategory;
  const collectionProducts = productsSynced ? products.filter((product) => product.categorySlug === slug) : fallbackProducts;

  if (category.hidden || category.deleted) {
    return (
      <div className="page-container py-16 text-center">
        <h1 className="font-heading text-3xl">Collection unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">This collection is not currently published.</p>
        <Link href="/shop" className="mt-6 inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-semibold">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-paper dark:bg-[#181613]">
      <div className={`${PAGE_CONTAINER} ${PAGE_PY} min-w-0`}>
        <Breadcrumb className="mb-6 overflow-x-auto sm:mb-8">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/shop">Shop</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{category.name}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="grid overflow-hidden rounded-lg border border-border/70 bg-surface-silver lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[16/9] overflow-hidden bg-muted sm:aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
            <Image src={category.image} alt={category.name} fill priority unoptimized={bypassImageOptimization(category.image)} className="object-cover transition-transform duration-700 hover:scale-[1.02]" sizes="(max-width:1024px) 100vw, 45vw" />
          </div>
          <div className="flex flex-col justify-center bg-surface-paper px-5 py-7 sm:px-10 sm:py-12 lg:px-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary sm:text-xs sm:tracking-[0.4em]">Mietaaf collection</p>
            <h1 className="atelier-heading mt-4">{category.name}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base sm:leading-7">{category.description}</p>
            <p className="mt-4 text-sm font-medium text-foreground/75">
              {loading && !collectionProducts.length ? "Loading pieces…" : `${collectionProducts.length} pieces available`}
            </p>
            <Link href="/shop" className="atelier-link mt-5 w-fit sm:mt-7">
              Browse all collections <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </div>
        </header>

        <section className="mt-9 sm:mt-16">
          <div className="mb-7 flex flex-col gap-3 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Curated for you</p>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl">Explore the collection</h2>
            </div>
            <p className="text-sm text-muted-foreground">{collectionProducts.length} products</p>
          </div>
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-5 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {collectionProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
