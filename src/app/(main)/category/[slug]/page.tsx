import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/data/categories";
import { getCollectionPageProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { CatalogSuitsCategory } from "@/components/product/catalog-suits-category";
import { PageEnter } from "@/components/motion/page-enter";
import type { CategorySlug } from "@/types";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const slugs = CATEGORIES.map((category) => category.slug);

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((item) => item.slug === slug);
  if (!category) return { title: "Category" };
  return { title: category.name, description: category.description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slugs.includes(slug as CategorySlug)) notFound();

  const category = CATEGORIES.find((item) => item.slug === slug)!;
  const products = getCollectionPageProducts(slug);
  const isSuits = slug === "suits";

  return (
    <PageEnter>
      <div className="min-h-screen bg-[#fbf8f2] dark:bg-[#181613]">
        <div className={`${PAGE_CONTAINER} ${PAGE_PY} min-w-0`}>
          <Breadcrumb className="mb-6 overflow-x-auto sm:mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {isSuits ? (
            <header className="rounded-[2rem] border border-border/60 bg-[#eee4d6] px-6 py-8 sm:px-10 sm:py-10 dark:bg-[#201d19]">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                Mietaaf catalog
              </p>
              <h1 className="mt-2 font-heading text-3xl sm:text-4xl md:text-5xl">
                {category.name}
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                {category.description}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {products.length} tailored looks from the Mietaaf catalogue.
              </p>
            </header>
          ) : (
            <header className="grid overflow-hidden rounded-[2rem] border border-border/60 bg-[#eee4d6] shadow-[0_22px_60px_rgba(58,48,38,0.07)] lg:grid-cols-[0.9fr_1.1fr] dark:bg-[#201d19]">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted lg:aspect-auto lg:min-h-[420px]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width:1024px) 100vw, 45vw"
                />
              </div>
              <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                  Mietaaf collection
                </p>
                <h1 className="mt-2 font-heading text-3xl sm:text-4xl md:text-5xl">
                  {category.name}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                  {category.description}
                </p>
                <p className="mt-4 text-sm font-medium text-foreground/75">
                  {products.length} pieces available
                </p>
                <Link
                  href="/shop"
                  className="mt-7 inline-flex w-fit items-center rounded-full border border-border bg-background/70 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-background"
                >
                  Browse all collections <span className="ml-2" aria-hidden="true">→</span>
                </Link>
              </div>
            </header>
          )}

          {isSuits ? (
            <CatalogSuitsCategory products={products} />
          ) : (
            <section className="mt-12 sm:mt-16">
              <div className="mb-7 flex items-end justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                    Curated for you
                  </p>
                  <h2 className="mt-2 font-heading text-2xl sm:text-3xl">
                    Explore the collection
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">{products.length} products</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </PageEnter>
  );
}
