"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { PageEnter } from "@/components/motion/page-enter";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import { useShopData } from "@/hooks/use-shop-data";

function SearchBody() {
  const router = useRouter();
  const sp = useSearchParams();
  const urlQ = sp.get("q") ?? "";
  const [input, setInput] = useState(urlQ);
  const debounced = useDebounce(input, 250);
  const { products } = useShopData();

  useEffect(() => {
    setInput(urlQ);
  }, [urlQ]);

  useEffect(() => {
    const t = debounced.trim();
    const current = sp.get("q") ?? "";
    if (t === current) return;
    if (t) {
      router.replace(`/search?q=${encodeURIComponent(t)}`, { scroll: false });
    } else if (current) {
      router.replace("/search", { scroll: false });
    }
  }, [debounced, router, sp]);

  const results = useMemo(() => {
    const t = debounced.trim().toLowerCase();
    if (!t) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(t) ||
        p.category.toLowerCase().includes(t) ||
        p.tags.some((tag) => tag.includes(t)),
    );
  }, [debounced, products]);

  return (
    <PageEnter>
      <div className={`${PAGE_CONTAINER} ${PAGE_PY}`}>
        <h1 className="font-heading text-3xl sm:text-4xl">Search</h1>
        <form
          className="mt-6 flex touch-manipulation flex-col gap-2 sm:flex-row sm:items-stretch"
          onSubmit={(e) => {
            e.preventDefault();
            const t = input.trim();
            router.push(t ? `/search?q=${encodeURIComponent(t)}` : "/search");
          }}
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Search sherwani, suits, wedding…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-11 min-h-11 rounded-full pl-10"
            />
          </div>
          <Button type="submit" className="h-11 shrink-0 rounded-full px-8">
            Search
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          {urlQ ? (
            <>
              {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{urlQ}&rdquo;
            </>
          ) : (
            "Enter a keyword to search the collection."
          )}
        </p>
        {urlQ && results.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border/80 bg-muted/30 px-4 py-16 text-center sm:py-20">
            <p className="font-heading text-xl sm:text-2xl">No products found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another keyword or browse collections.
            </p>
            <Button asChild variant="outline" className="mt-6 h-11 rounded-full">
              <a href="/shop">Browse shop</a>
            </Button>
          </div>
        ) : results.length > 0 ? (
          <div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : null}
      </div>
    </PageEnter>
  );
}

function SearchFallback() {
  return (
    <div className={`${PAGE_CONTAINER} ${PAGE_PY}`}>
      <Skeleton className="h-10 w-48" />
      <Skeleton className="mt-6 h-11 w-full max-w-xl rounded-full" />
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

