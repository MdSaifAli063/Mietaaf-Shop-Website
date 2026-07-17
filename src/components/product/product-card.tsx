"use client";

import Link from "next/link";
import { Eye, Heart, ShoppingBag } from "lucide-react";
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
import { ProductThumbnailImage } from "@/components/product/catalog-product-photo";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { buildProductHref } from "@/lib/product-links";

export function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const toggleWish = useWishlistStore((s) => s.toggle);
  const storedHasWish = useWishlistStore((s) => s.has(product.id));
  const addItem = useCartStore((s) => s.addItem);
  const setQuick = useUiStore((s) => s.setQuickView);
  const addCompare = useCompareStore((s) => s.add);
  const mounted = useHasMounted();
  const hasWish = mounted && storedHasWish;

  const primary = product.images[0]!;
  const productHref = buildProductHref(product.slug, primary);
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
    const ok = addCompare(product.slug, primary);
    toast[ok ? "success" : "error"](
      ok ? "Added to compare" : "Compare list is full (max 4)",
    );
  }

  return (
    <Card className="group relative flex min-w-0 flex-col overflow-hidden border-border/70 bg-card/90 shadow-[0_18px_45px_rgba(58,48,38,0.06)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(58,48,38,0.1)]">
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          compact ? "aspect-[4/5]" : "aspect-[3/4]",
        )}
      >
        <Link href={productHref} className="absolute inset-0 z-0" />
        <ProductThumbnailImage
          src={primary}
          alt={product.name}
          sizes={
            compact
              ? "(max-width:639px) 92vw, (max-width:1024px) 45vw, 280px"
              : "(max-width:639px) 100vw, (max-width:1024px) 50vw, 25vw"
          }
          className="transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.02]"
          priority={false}
        />
        {discount ? (
          <Badge className="absolute left-3 top-3 bg-[rgb(95_107_84/0.18)] text-[rgb(72_82_64)]">
            {discount}% off
          </Badge>
        ) : null}
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-2 sm:right-3 sm:top-3">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className={cn(
              "h-10 w-10 touch-manipulation rounded-full bg-background/80 shadow-sm backdrop-blur-sm sm:h-9 sm:w-9",
              hasWish && "text-primary",
            )}
            onClick={(e) => {
              e.preventDefault();
              toggleWish(product.id, primary);
              toast.success(hasWish ? "Removed from wishlist" : "Saved to wishlist");
            }}
            aria-label={hasWish ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          >
            <Heart className={cn("h-4 w-4", hasWish && "fill-primary")} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-10 w-10 touch-manipulation rounded-full bg-background/80 shadow-sm backdrop-blur-sm sm:h-9 sm:w-9"
            onClick={(e) => {
              e.preventDefault();
              setQuick(product.slug, primary);
            }}
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        {/* Desktop hover tray */}
        <div className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full bg-gradient-to-t from-[rgb(245_241_234/0.96)] to-transparent p-3 transition-transform duration-300 [@media(hover:hover)]:group-hover:translate-y-0 lg:block">
          <div className="flex gap-2">
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
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col space-y-2 p-3 sm:p-4">
        <Link href={productHref} className="block min-w-0">
          <h3 className="font-heading text-base leading-snug tracking-[0.03em] text-foreground transition-colors hover:text-primary sm:text-lg">
            {product.name}
          </h3>
        </Link>
        <StarRating value={product.rating} count={product.reviewCount} />
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-base font-semibold text-foreground sm:text-lg">
            {formatInr(product.price)}
          </span>
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
