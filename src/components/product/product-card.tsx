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

  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0" />
        <Image
          src={primary}
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          priority={false}
        />
        <Image
          src={secondary}
          alt=""
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        {discount ? (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
            {discount}% off
          </Badge>
        ) : null}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className={cn(
              "h-9 w-9 rounded-full bg-background/80 shadow-md backdrop-blur",
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
            className="h-9 w-9 rounded-full bg-background/80 shadow-md backdrop-blur"
            onClick={(e) => {
              e.preventDefault();
              setQuick(product.slug);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-gradient-to-t from-background/95 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0"
          initial={false}
        >
          <div className="flex gap-2">
            <Button
              className="flex-1 rounded-full"
              onClick={(e) => {
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
              }}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const ok = addCompare(product.slug);
                toast[ok ? "success" : "error"](
                  ok ? "Added to compare" : "Compare list is full (max 4)",
                );
              }}
            >
              Compare
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="space-y-2 p-4">
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="font-heading text-lg leading-snug text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <StarRating value={product.rating} count={product.reviewCount} />
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold">{formatInr(product.price)}</span>
          {product.compareAtPrice ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatInr(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
