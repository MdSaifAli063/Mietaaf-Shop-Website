"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUiStore } from "@/store/ui-store";
import { useDebounce } from "@/hooks/use-debounce";
import { useShopData } from "@/hooks/use-shop-data";
import { formatInr } from "@/lib/format";
import { ProductThumbnailImage } from "@/components/product/catalog-product-photo";
import { buildProductHref } from "@/lib/product-links";

export function SearchOverlay() {
  const open = useUiStore((s) => s.searchOpen);
  const setOpen = useUiStore((s) => s.setSearchOpen);
  const [q, setQ] = useState("");
  const debounced = useDebounce(q, 200);
  const { products } = useShopData();

  const results = useMemo(() => {
    const t = debounced.trim().toLowerCase();
    if (!t) return products.slice(0, 6);
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(t) ||
        p.tags.some((tag) => tag.includes(t)) ||
        p.category.toLowerCase().includes(t),
    ).slice(0, 8);
  }, [debounced, products]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        position="bottom-sheet"
        className="gap-4 overflow-y-auto overscroll-contain border-border/80 bg-card/95 p-4 sm:p-6"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Search Mietaaf
          </DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Sherwani, suits, wedding…"
            className="h-12 rounded-full pl-10 pr-10"
          />
          {q ? (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setQ("")}
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="max-h-[min(50dvh,400px)] space-y-2 overflow-y-auto overscroll-contain sm:max-h-[50vh]">
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No matches. Try another keyword.
            </p>
          ) : (
            results.map((p) => (
              <Link
                key={p.id}
                href={buildProductHref(p.slug, p.images[0])}
                onClick={() => setOpen(false)}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-border hover:bg-muted/60"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <ProductThumbnailImage
                    src={p.images[0]!}
                    alt=""
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.category}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold">{formatInr(p.price)}</span>
              </Link>
            ))
          )}
        </div>
        <p className="text-center text-[11px] text-muted-foreground">
          <Link
            href={q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search"}
            className="text-primary hover:underline"
            onClick={() => setOpen(false)}
          >
            Open full search results
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}
