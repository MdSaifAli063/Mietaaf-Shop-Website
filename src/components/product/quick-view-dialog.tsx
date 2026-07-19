"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useUiStore } from "@/store/ui-store";
import { getProductBySlug } from "@/lib/data/products";
import { formatInr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/product/star-rating";
import { useCartStore } from "@/store/cart-store";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductThumbnailImage } from "@/components/product/catalog-product-photo";
import { buildProductHref } from "@/lib/product-links";

export function QuickViewDialog() {
  const slug = useUiStore((s) => s.quickViewSlug);
  const imageOverride = useUiStore((s) => s.quickViewImage);
  const setQuick = useUiStore((s) => s.setQuickView);
  const addItem = useCartStore((s) => s.addItem);
  const product = useMemo(
    () => (slug ? getProductBySlug(slug) : undefined),
    [slug],
  );
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();

  useEffect(() => {
    if (product) {
      setSize(undefined);
      setColor(undefined);
    }
  }, [product]);

  if (!slug) return null;

  if (!product) {
    return (
      <Dialog open onOpenChange={(o) => !o && setQuick(null)}>
        <DialogContent>
          <p className="text-sm text-muted-foreground">Product not found.</p>
        </DialogContent>
      </Dialog>
    );
  }

  const img = imageOverride ?? product.images[0]!;
  const selSize = size ?? product.sizes[0]!;
  const selColor = color ?? product.colors[0]!.name;

  return (
    <Dialog open onOpenChange={(o) => !o && setQuick(null)}>
      <DialogContent
        position="mobile-sheet"
        className="gap-0 overflow-hidden border-border/80 bg-card/98 p-0 shadow-[0_24px_80px_rgba(34,28,22,0.28)] [&_[data-slot=dialog-close]]:z-30 [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-background/90 [&_[data-slot=dialog-close]]:shadow-sm"
      >
        <div className="grid max-h-[calc(94dvh-1rem)] min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-0 md:h-[min(80dvh,700px)] md:grid-cols-2 md:grid-rows-1">
          <div className="relative h-[clamp(240px,40dvh,340px)] w-full shrink-0 overflow-hidden bg-[#eee7dc] sm:h-[min(44dvh,380px)] md:h-full md:min-h-0 dark:bg-[#201d19]">
            <ProductThumbnailImage
              src={img}
              alt={product.name}
              sizes="(max-width:768px) 100vw, 50vw"
              fit="contain"
            />
          </div>
          <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] bg-card/98">
            <div className="min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 md:p-8 md:pb-5">
              <div className="flex flex-col gap-3 sm:gap-4">
                <DialogHeader className="text-left">
                  <DialogTitle className="pr-9 font-heading text-xl leading-tight sm:text-2xl md:text-3xl">
                    {product.name}
                  </DialogTitle>
                </DialogHeader>
                <StarRating value={product.rating} count={product.reviewCount} />
                <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:line-clamp-none sm:text-sm">
                  {product.description}
                </p>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Size
                    </p>
                    <Select value={selSize} onValueChange={(v) => setSize(v ?? undefined)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.sizes.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Color
                    </p>
                    <Select value={selColor} onValueChange={(v) => setColor(v ?? undefined)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Color" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.colors.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-semibold sm:text-2xl">
                    {formatInr(product.price)}
                  </span>
                  {product.compareAtPrice ? (
                    <span className="text-xs text-muted-foreground line-through sm:text-sm">
                      {formatInr(product.compareAtPrice)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="z-10 flex gap-2 border-t border-border/60 bg-card/98 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4 md:px-8 md:pb-6">
              <Button
                className="h-10 min-w-0 flex-1 rounded-full px-2 text-xs sm:h-11 sm:px-4 sm:text-sm"
                onClick={() => {
                  addItem({
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    image: img,
                    price: product.price,
                    quantity: 1,
                    size: selSize,
                    color: selColor,
                  });
                  toast.success("Added to cart");
                  setQuick(null);
                }}
              >
                Add to cart
              </Button>
              <Button
                variant="outline"
                className="h-10 min-w-0 flex-1 rounded-full px-2 text-xs sm:h-11 sm:px-4 sm:text-sm"
                asChild
              >
                <Link
                  href={buildProductHref(product.slug, img)}
                  onClick={() => setQuick(null)}
                >
                  View details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
