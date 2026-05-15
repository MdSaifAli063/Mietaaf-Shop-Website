"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { formatInr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StarRating } from "@/components/product/star-rating";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";
import { useCompareStore } from "@/store/compare-store";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const toggleWish = useWishlistStore((s) => s.toggle);
  const hasWish = useWishlistStore((s) => s.has(product.id));
  const addItem = useCartStore((s) => s.addItem);
  const setQuick = useUiStore((s) => s.setQuickView);
  const addCompare = useCompareStore((s) => s.add);

  const primary = product.images[0]!;
  const secondary = product.images[1] ?? primary;
  const discount =
    product.discountPercent ??
    (product.compareAtPrice
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
        )
      : undefined);

  function addToCart(e: React.MouseEvent) {
    e.preventDefault();
    const size = product.sizes[0]!;
    const color = product.colors[0]!.name;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: primary,
      price: product.price,
      quantity: 1,
      size,
      color,
    });
    toast.success("Added to cart");
  }

  function addToCompare(e: React.MouseEvent) {
    e.preventDefault();
    const ok = addCompare(product.slug);
    toast[ok ? "success" : "error"](
      ok ? "Added to compare" : "Compare list is full (max 4)",
    );
  }

  return (
    <Card className="group relative flex min-w-0 flex-col overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <motion.div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0" />
        <Image
          src={primary}
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-0"
          priority={false}
        />
        <Image
          src={secondary}
          alt=""
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100"
        />
        {discount ? (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
            {discount}% off
          </Badge>
        ) : null}
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-2 sm:right-3 sm:top-3">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className={cn(
              "h-10 w-10 touch-manipulation rounded-full bg-background/80 shadow-md backdrop-blur sm:h-9 sm:w-9",
              hasWish && "text-primary",
            )}
            onClick={(e) => {
              e.preventDefault();
              toggleWish(product.id);
              toast.success(hasWish ? "Removed from wishlist" : "Saved to wishlist");
            }}
          >
            <Heart className={cn("h-4 w-4", hasWish && "fill-primary")} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-10 w-10 touch-manipulation rounded-full bg-background/80 shadow-md backdrop-blur sm:h-9 sm:w-9"
            onClick={(e) => {
              e.preventDefault();
              setQuick(product.slug);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        {/* Desktop hover tray */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full bg-gradient-to-t from-background/95 to-transparent p-3 transition-transform duration-300 [@media(hover:hover)]:group-hover:translate-y-0 lg:block"
          initial={false}
        >
          <motion.div className="flex gap-2">
            <Button className="h-10 flex-1 touch-manipulation rounded-full" onClick={addToCart}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add
            </Button>
            <Button
              variant="outline"
              className="h-10 touch-manipulation rounded-full"
              type="button"
              onClick={addToCompare}
            >
              Compare
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
      <div className="flex min-w-0 flex-1 flex-col space-y-2 p-3 sm:p-4">
        <Link href={`/product/${product.slug}`} className="block min-w-0">
          <h3 className="font-heading text-base leading-snug text-foreground transition-colors hover:text-primary sm:text-lg">
            {product.name}
          </h3>
        </Link>
        <StarRating value={product.rating} count={product.reviewCount} />
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-base font-semibold sm:text-lg">{formatInr(product.price)}</span>
          {product.compareAtPrice ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatInr(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
        {/* Mobile / touch: always-visible actions (same as desktop hover) */}
        <div className="flex gap-2 pt-1 lg:hidden">
          <Button
            className="h-11 min-h-11 flex-1 touch-manipulation rounded-full text-sm"
            onClick={addToCart}
          >
            <ShoppingBag className="mr-1.5 h-4 w-4 shrink-0" />
            Add to bag
          </Button>
          <Button
            variant="outline"
            className="h-11 min-h-11 shrink-0 touch-manipulation rounded-full px-3 text-sm"
            type="button"
            onClick={addToCompare}
          >
            Compare
          </Button>
        </div>
      </div>
    </Card>
  );
}
