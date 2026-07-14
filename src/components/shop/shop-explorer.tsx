"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CategorySlug } from "@/types";
import type { SortValue } from "@/lib/constants";
import { SORT_OPTIONS } from "@/lib/constants";
import { ProductCard } from "@/components/product/product-card";
import { PageEnter } from "@/components/motion/page-enter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShopData } from "@/hooks/use-shop-data";

const ALL_CATEGORIES: { slug: CategorySlug | "all"; label: string }[] = [
  { slug: "all", label: "All" },
  { slug: "sherwani", label: "Sherwani" },
  { slug: "blazer", label: "Blazer" },
  { slug: "suits", label: "Suits" },
  { slug: "kurta", label: "Kurta" },
  { slug: "wedding-collection", label: "Wedding" },
  { slug: "premium-collection", label: "Premium" },
  { slug: "indo-western", label: "Indo-Western" },
];

export function ShopExplorer() {
  const { products, loading } = useShopData();
  const sp = useSearchParams();
  const initialCat = (sp.get("category") as CategorySlug | null) ?? "all";
  const [category, setCategory] = useState<CategorySlug | "all">(
    initialCat && ALL_CATEGORIES.some((c) => c.slug === initialCat)
      ? initialCat
      : "all",
  );
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortValue>("newest");
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") {
      list = list.filter((p) => p.categorySlug === category);
    }
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(t) ||
          p.tags.some((tag) => tag.includes(t)),
      );
    }
    list = list.filter((p) => p.rating >= minRating);
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        list.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        list.sort((a, b) => (b.newArrival === true ? 1 : 0) - (a.newArrival === true ? 1 : 0));
        break;
    }
    return list;
  }, [category, q, sort, minRating, priceRange, products]);

  const filterPanel = (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label>Search</Label>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className="rounded-full"
        />
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={category}
          onValueChange={(v) => setCategory(v as CategorySlug | "all")}
        >
          <SelectTrigger className="rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALL_CATEGORIES.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        <Label>Price range (₹)</Label>
        <Slider
          min={0}
          max={100000}
          step={1000}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
        />
        <p className="text-xs text-muted-foreground">
          ₹{priceRange[0].toLocaleString("en-IN")} — ₹{priceRange[1].toLocaleString("en-IN")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="r4"
          checked={minRating >= 4}
          onCheckedChange={(c) => setMinRating(c ? 4 : 0)}
        />
        <label htmlFor="r4" className="text-sm">
          4+ stars only
        </label>
      </div>
    </div>
  );

  return (
    <PageEnter>
      <div className="page-container min-w-0 py-8 sm:py-10 md:py-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Shop</p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl">Collections</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Filter by category, price, and rating — curated for clarity, designed for desire.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={sort} onValueChange={(v) => setSort(v as SortValue)}>
              <SelectTrigger className="h-11 w-full min-w-0 rounded-full sm:h-10 sm:w-[200px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-full lg:hidden",
                )}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[min(calc(100dvw-1.25rem),380px)] max-w-dvw overflow-y-auto pt-[env(safe-area-inset-top,0px)]"
              >
                <h2 className="mb-6 font-heading text-xl">Filters</h2>
                {filterPanel}
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="flex min-w-0 gap-6 lg:gap-10">
          <aside className="hidden w-64 shrink-0 lg:block">{filterPanel}</aside>
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 py-24 text-center">
                <p className="font-heading text-xl text-muted-foreground">Loading products...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 py-24 text-center">
                <p className="font-heading text-xl">No pieces match</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Adjust filters or explore another category.
                </p>
                <Button
                  className="mt-6 rounded-full"
                  variant="outline"
                  onClick={() => {
                    setCategory("all");
                    setQ("");
                    setMinRating(0);
                    setPriceRange([0, 100000]);
                  }}
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageEnter>
  );
}
