"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageEnter } from "@/components/motion/page-enter";
import { ProductThumbnailImage } from "@/components/product/catalog-product-photo";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import { useShopData } from "@/hooks/use-shop-data";
import { cn } from "@/lib/utils";

export default function LookbookPage() {
  const { products } = useShopData();
  const looks = products.slice(0, 8);

  return (
    <PageEnter>
      <div className="min-h-screen bg-[#fbf8f2] dark:bg-[#181613]">
        <div className={`${PAGE_CONTAINER} ${PAGE_PY} min-w-0`}>
          <header className="rounded-[2rem] border border-border/60 bg-[#eee4d6] px-6 py-9 sm:px-10 sm:py-12 lg:flex lg:items-end lg:justify-between lg:gap-12 dark:bg-[#201d19]">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                Lookbook
              </p>
              <h1 className="mt-3 font-heading text-4xl leading-none sm:text-5xl md:text-6xl">
                Atelier lens
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                A study in drape, lapel, texture, and light—the Mietaaf man styled for ceremony and evening.
              </p>
            </div>
            <Link
              href="/shop"
              className="mt-7 inline-flex w-fit items-center rounded-full border border-border bg-background/75 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-background lg:mt-0"
            >
              Shop the looks <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </header>

          <section className="mt-8 sm:mt-10" aria-label="Mietaaf lookbook">
            <div className="grid auto-rows-[210px] grid-cols-2 gap-3 sm:auto-rows-[260px] lg:grid-cols-4 lg:gap-4">
              {looks.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl bg-muted outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    (index === 0 || index === 5) && "col-span-2 row-span-2",
                    (index === 1 || index === 6 || index === 7) && "col-span-2",
                  )}
                >
                  <ProductThumbnailImage
                    src={product.images[0]!}
                    alt={product.name}
                    sizes={index === 0 || index === 5 ? "(max-width:1024px) 100vw, 50vw" : "(max-width:1024px) 50vw, 25vw"}
                    className="transition-transform duration-700 group-hover:scale-105"
                    priority={index === 0}
                  />
                  <span className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-white sm:p-5">
                    <span>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                        {product.category}
                      </span>
                      <span className="mt-1 block font-heading text-lg leading-tight sm:text-xl">
                        {product.name}
                      </span>
                    </span>
                    <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageEnter>
  );
}
