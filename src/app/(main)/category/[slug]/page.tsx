import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/data/categories";
import { getProductsByCategorySlug } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { PageEnter } from "@/components/motion/page-enter";
import type { CategorySlug } from "@/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const slugs = CATEGORIES.map((c) => c.slug);

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return { title: "Category" };
  return { title: cat.name, description: cat.description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slugs.includes(slug as CategorySlug)) notFound();
  const cat = CATEGORIES.find((c) => c.slug === slug)!;
  const products = getProductsByCategorySlug(slug);

  return (
    <PageEnter>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-8">
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
              <BreadcrumbPage>{cat.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted lg:aspect-auto lg:min-h-[420px]">
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent lg:bg-gradient-to-r" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
              Category
            </p>
            <h1 className="mt-2 font-heading text-4xl md:text-5xl">{cat.name}</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">{cat.description}</p>
            <Link
              href="/shop"
              className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              View all collections
            </Link>
          </div>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </PageEnter>
  );
}
