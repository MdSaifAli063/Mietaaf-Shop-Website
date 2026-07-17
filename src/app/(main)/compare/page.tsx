"use client";

import Link from "next/link";
import Image from "next/image";
import { useCompareStore } from "@/store/compare-store";
import { PageEnter } from "@/components/motion/page-enter";
import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/format";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import type { Product } from "@/types";
import { useShopData } from "@/hooks/use-shop-data";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { buildProductHref } from "@/lib/product-links";

export default function ComparePage() {
  const storedSlugs = useCompareStore((s) => s.slugs);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const { products: allProducts } = useShopData();
  const mounted = useHasMounted();
  const slugs = mounted ? storedSlugs : [];
  const products = slugs
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter(Boolean) as Product[];

  if (products.length === 0) {
    return (
      <PageEnter>
        <div className={`${PAGE_CONTAINER} ${PAGE_PY} text-center`}>
          <p className="font-heading text-2xl sm:text-3xl">Nothing to compare</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Use Compare on product cards (up to four pieces).
          </p>
          <Button asChild className="mt-6 h-11 rounded-full">
            <Link href="/shop">Browse shop</Link>
          </Button>
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

  return (
    <PageEnter>
      <div className={`${PAGE_CONTAINER} ${PAGE_PY} min-w-0`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-3xl sm:text-4xl">Compare</h1>
          <Button variant="outline" className="h-11 touch-manipulation rounded-full" onClick={clear}>
            Clear all
          </Button>
        </div>

        <div className="mt-6 -mx-4 overflow-x-auto overscroll-x-contain px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-background p-3 text-left font-medium text-muted-foreground" />
                {products.map((p) => (
                  <th key={p.id} className="min-w-[140px] p-3 text-left align-top">
                    <div className="relative mb-2 aspect-[3/4] w-full max-w-[140px] overflow-hidden rounded-lg bg-muted">
                      <Image src={p.images[0]!} alt={p.name} fill className="object-cover" sizes="140px" />
                    </div>
                    <Link href={buildProductHref(p.slug, p.images[0])} className="font-heading text-base hover:text-primary">
                      {p.name}
                    </Link>
                    <Button variant="ghost" size="sm" className="mt-1 h-9" onClick={() => remove(p.slug)}>
                      Remove
                    </Button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-border/60">
                  <td className="sticky left-0 z-10 bg-background p-3 font-medium text-muted-foreground">
                    {row.label}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 align-top">
                      {row.get(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageEnter>
  );
}
