"use client";

import { useId, useMemo, useState } from "react";
import type { Category, CategorySlug, Product } from "@/types";
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
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShopData } from "@/hooks/use-shop-data";

export function ShopExplorer({ initialCategory = "all", fallbackProducts, fallbackCategories }: {
  initialCategory?: string;
  fallbackProducts: Product[];
  fallbackCategories: Category[];
}) {
  const snapshot = useShopData();
  const products = snapshot.productsSynced ? snapshot.products : fallbackProducts;
  const categories = snapshot.categoriesSynced ? snapshot.categories : fallbackCategories;
  const { loading } = snapshot;
  const allCategories = useMemo(
    () => [
      { slug: "all" as const, label: "All" },
      ...categories.map((item) => ({
        slug: item.slug,
        label: item.name.replace(" Collection", ""),
      })),
    ],
    [categories],
  );
  const [category, setCategory] = useState<CategorySlug | "all">(
    initialCategory && allCategories.some((c) => c.slug === initialCategory)
      ? initialCategory
      : "all",
  );
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortValue>("newest");
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterId = useId();

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

  const filterPanel = (placement: "desktop" | "mobile") => (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor={`${filterId}-${placement}-search`}>Search</Label>
        <Input
          id={`${filterId}-${placement}-search`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className="rounded-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${filterId}-${placement}-category`}>Category</Label>
        <Select
          value={category}
          onValueChange={(v) => setCategory(v as CategorySlug | "all")}
        >
          <SelectTrigger id={`${filterId}-${placement}-category`} className="rounded-full">
            <SelectValue>{allCategories.find((item) => item.slug === category)?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {allCategories.map((c) => (
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
      <div className="flex min-h-11 items-center gap-2">
        <Checkbox
          id={`${filterId}-${placement}-rating`}
          checked={minRating >= 4}
          onCheckedChange={(c) => setMinRating(c ? 4 : 0)}
        />
        <label htmlFor={`${filterId}-${placement}-rating`} className="py-3 text-sm">
          4+ stars only
        </label>
      </div>
    </div>
  );

  return (
    <PageEnter>
      <div className="page-container min-w-0 py-8 sm:py-10 md:py-12">
        <div className="mb-8 flex flex-col gap-6 border-b border-border/70 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="atelier-eyebrow mb-3">Shop</p>
            <h1 className="atelier-heading">Collections</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Filter by category, price, and rating — curated for clarity, designed for desire.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={sort} onValueChange={(v) => setSort(v as SortValue)}>
              <SelectTrigger className="h-12 w-full min-w-0 rounded-md bg-card sm:w-[190px]">
                <SelectValue placeholder="Sort">{SORT_OPTIONS.find((option) => option.value === sort)?.label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-12 rounded-md lg:hidden",
                )}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[min(calc(100dvw-1.25rem),380px)] max-w-dvw overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]"
              >
                <SheetTitle className="mb-2 pr-12 font-heading text-xl">Filters</SheetTitle>
                {filterPanel("mobile")}
                <Button className="mt-5 h-11 w-full" onClick={() => setFiltersOpen(false)}>
                  Show {filtered.length} pieces
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <nav aria-label="Browse collections" className="mb-8 flex gap-2 overflow-x-auto overscroll-x-contain pb-3 sm:mb-10">
          {allCategories.map((item) => (
            <button key={item.slug} type="button" aria-pressed={category === item.slug} onClick={() => setCategory(item.slug)} className={cn("min-h-11 shrink-0 rounded-md border px-4 text-[11px] font-medium transition-colors", category === item.slug ? "border-foreground bg-foreground text-background" : "border-border bg-surface-paper text-muted-foreground hover:border-foreground/40 hover:text-foreground")}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex min-w-0 gap-6 lg:gap-8">
          <aside className="hidden w-60 shrink-0 self-start rounded-xl border border-border/70 bg-surface-silver p-5 lg:sticky lg:top-[calc(var(--site-header-height)+1rem)] lg:block">
            <p className="atelier-eyebrow mb-6">Refine your selection</p>
            {filterPanel("desktop")}
          </aside>
          <div className="min-w-0 flex-1">
            <p className="mb-5 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{filtered.length} pieces in the collection</p>
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
              <div className="grid grid-cols-2 gap-x-2.5 gap-y-5 sm:gap-6 xl:grid-cols-3">
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
