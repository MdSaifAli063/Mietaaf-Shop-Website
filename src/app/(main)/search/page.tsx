"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DUMMY_PRODUCTS } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { PageEnter } from "@/components/motion/page-enter";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";

function SearchBody() {
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const debounced = useDebounce(q, 200);

  const results = useMemo(() => {
    const t = debounced.trim().toLowerCase();
    if (!t) return [];
    return DUMMY_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(t) ||
        p.category.toLowerCase().includes(t) ||
        p.tags.some((tag) => tag.includes(t)),
    );
  }, [debounced]);

  return (
    <PageEnter>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl">Search</h1>
        <p className="mt-2 text-muted-foreground">
          Results for &ldquo;{q || "…"}&rdquo;
        </p>
        {results.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-border/80 bg-muted/30 py-20 text-center">
            <p className="font-heading text-xl">No products found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another keyword or browse collections.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </PageEnter>
  );
}

function SearchFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Skeleton className="h-10 w-48" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchBody />
    </Suspense>
  );
}
