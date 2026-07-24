"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, X } from "lucide-react";
import { useCompareStore } from "@/store/compare-store";
import { PageEnter } from "@/components/motion/page-enter";
import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/format";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import type { Product } from "@/types";
import { useShopData } from "@/hooks/use-shop-data";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { buildProductHref } from "@/lib/product-links";
import { CATEGORY_IMAGE_LINKS } from "@/lib/data/image-links/category-images";

export default function ComparePage() {
  const storedSlugs = useCompareStore((s) => s.slugs);
  const storedImages = useCompareStore((s) => s.images);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const { products: allProducts } = useShopData();
  const mounted = useHasMounted();
  const slugs = mounted ? storedSlugs : [];
  const products = slugs
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter(Boolean)
    .map((compareProduct) => {
      const product = compareProduct as Product;
      const image = storedImages[product.slug] ?? CATEGORY_IMAGE_LINKS[product.categorySlug];
      return { ...product, images: [image] };
    });

  if (products.length === 0) {
    return (
      <PageEnter>
        <div className={`${PAGE_CONTAINER} ${PAGE_PY} flex min-h-[45vh] items-center justify-center`}>
          <div className="mx-auto max-w-lg rounded-[2rem] border border-border/70 bg-card/80 px-6 py-10 text-center shadow-[0_18px_45px_rgba(58,48,38,0.08)] backdrop-blur-sm sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="mt-4 font-heading text-2xl sm:text-3xl">Nothing to compare</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Tap Compare on the product cards to build a side-by-side shortlist of up to four pieces.
            </p>
            <Button asChild className="mt-6 h-11 rounded-full">
              <Link href="/shop">Browse shop</Link>
            </Button>
          </div>
        </div>
      </PageEnter>
    );
  }

  const rows = [
    { label: "Price", get: (p: Product) => formatInr(p.price) },
    { label: "Rating", get: (p: Product) => `${p.rating} (${p.reviewCount})` },
    { label: "Sizes", get: (p: Product) => p.sizes.join(", ") },
    { label: "Fabric", get: (p: Product) => p.fabric },
  ];

  const bestValueProduct = [...products].sort((a, b) => a.price - b.price)[0];

  return (
    <PageEnter>
      <div className={`${PAGE_CONTAINER} ${PAGE_PY} min-w-0`}>
        <div className="rounded-[2rem] border border-border/70 bg-gradient-to-br from-card/90 via-card/75 to-muted/40 p-4 shadow-[0_18px_50px_rgba(58,48,38,0.08)] backdrop-blur-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Compare shortlist
              </div>
              <h1 className="mt-3 font-heading text-3xl sm:text-4xl">Compare your favourites</h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Side-by-side pricing, fabric, sizing, and fit guidance in one polished view.
              </p>
            </div>

            <Button variant="outline" className="h-11 touch-manipulation rounded-full" onClick={clear}>
              Clear all
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-card/80 shadow-[0_14px_40px_rgba(58,48,38,0.06)] backdrop-blur-sm"
            >
              <div className="relative aspect-[3/4] bg-muted">
                <Image src={p.images[0]!} alt={p.name} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
              </div>
              <div className="p-3.5 sm:p-4">
                <Link href={buildProductHref(p.slug, p.images[0])} className="block font-heading text-base hover:text-primary sm:text-lg">
                  {p.name}
                </Link>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">{p.category}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-foreground sm:text-lg">{formatInr(p.price)}</span>
                  {p.compareAtPrice ? (
                    <span className="text-[11px] text-muted-foreground line-through sm:text-sm">
                      {formatInr(p.compareAtPrice)}
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{p.rating} ★ • {p.reviewCount} reviews</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full px-3 text-xs"
                    onClick={() => remove(p.slug)}
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-border/70 bg-card/80 shadow-[0_14px_40px_rgba(58,48,38,0.06)] backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted/40">
                  <th className="sticky left-0 z-20 bg-muted/40 p-3 text-left font-medium text-muted-foreground">
                    Feature
                  </th>
                  {products.map((p) => (
                    <th key={p.id} className="p-3 text-left font-medium text-muted-foreground">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border/60 bg-primary/5">
                  <td className="sticky left-0 z-10 bg-primary/5 p-3 font-medium text-primary">Best value</td>
                  {products.map((p) => (
                    <td key={`${p.id}-best-value`} className="p-3 align-top text-foreground">
                      {bestValueProduct?.id === p.id ? "✔ Lowest price" : "—"}
                    </td>
                  ))}
                </tr>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-border/60">
                    <td className="sticky left-0 z-10 bg-muted/20 p-3 font-medium text-muted-foreground">
                      {row.label}
                    </td>
                    {products.map((p) => (
                      <td key={`${p.id}-${row.label}`} className="p-3 align-top text-foreground">
                        {row.get(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageEnter>
  );
}
