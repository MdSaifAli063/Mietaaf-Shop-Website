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

export function QuickViewDialog() {
  const slug = useUiStore((s) => s.quickViewSlug);
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

  const img = product.images[0]!;
  const selSize = size ?? product.sizes[0]!;
  const selColor = color ?? product.colors[0]!.name;

  return (
    <Dialog open onOpenChange={(o) => !o && setQuick(null)}>
      <DialogContent
        position="mobile-sheet"
        className="gap-0 overflow-y-auto overscroll-contain border-border/80 bg-card/95 p-0"
      >
        <div className="grid min-w-0 gap-0 md:grid-cols-2">
          <div className="relative aspect-[4/5] max-h-[45dvh] bg-muted sm:aspect-[3/4] sm:max-h-none">
            <ProductThumbnailImage
              src={img}
              alt={product.name}
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-8">
            <DialogHeader className="text-left">
              <DialogTitle className="font-heading text-2xl md:text-3xl">
                {product.name}
              </DialogTitle>
            </DialogHeader>
            <StarRating value={product.rating} count={product.reviewCount} />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <Separator />
            <div className="grid gap-3 sm:grid-cols-2">
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
              <span className="text-2xl font-semibold">{formatInr(product.price)}</span>
              {product.compareAtPrice ? (
                <span className="text-muted-foreground line-through">
                  {formatInr(product.compareAtPrice)}
                </span>
              ) : null}
            </div>
            <div className="mt-auto flex flex-col gap-2 sm:flex-row">
              <Button
                className="flex-1 rounded-full"
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
              <Button variant="outline" className="flex-1 rounded-full" asChild>
                <Link href={`/product/${product.slug}`} onClick={() => setQuick(null)}>
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
