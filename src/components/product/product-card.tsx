"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, GitCompareArrows, Heart, ShoppingBag } from "lucide-react";
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
  const storedHasCompare = useCompareStore((s) => s.slugs.includes(product.slug));
  const router = useRouter();
  const mounted = useHasMounted();
  const hasWish = mounted && storedHasWish;
  const hasCompare = mounted && storedHasCompare;

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

    if (!ok) {
      toast.error("Compare list is full (max 4)");
      return;
    }

    toast.success("Added to compare");
    router.push("/compare");
  }

  return (
    <Card className="group relative flex h-full min-w-0 flex-col gap-0 overflow-visible rounded-none border-0 bg-transparent py-0 shadow-none">
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-surface-silver ring-1 ring-black/4 dark:ring-white/5",
          compact ? "aspect-[4/5]" : "aspect-[3/4]",
        )}
      >
        <Link href={productHref} aria-label={`View ${product.name}`} className="absolute inset-0 z-0">
          <ProductThumbnailImage
            src={primary}
            alt={product.name}
            sizes={
              compact
                ? "(max-width:639px) 50vw, (max-width:1024px) 45vw, 280px"
                : "(max-width:639px) 50vw, (max-width:1024px) 50vw, 25vw"
            }
            className="transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.02]"
            priority={false}
          />
        </Link>
        {discount ? (
          <Badge className="absolute left-2 top-2 rounded-sm border-0 bg-surface-paper/95 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.08em] text-foreground shadow-none sm:left-3 sm:top-3 sm:text-[10px]">
            {discount}% off
          </Badge>
        ) : null}
        <div className="absolute right-1.5 top-1.5 z-10 flex flex-col gap-1.5 sm:right-3 sm:top-3 sm:gap-2">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className={cn(
              "size-11 touch-manipulation rounded-full border-white/60 bg-surface-paper/95 text-foreground shadow-none backdrop-blur-sm",
              hasWish && "text-primary",
            )}
            onClick={(e) => {
              e.preventDefault();
              toggleWish(product.id, primary);
              toast.success(hasWish ? "Removed from wishlist" : "Saved to wishlist");
            }}
            aria-label={hasWish ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          >
            <Heart className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", hasWish && "fill-primary")} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="size-11 touch-manipulation rounded-full border-white/60 bg-surface-paper/95 text-foreground shadow-none backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              setQuick(product.slug, primary);
            }}
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
        {/* Desktop hover tray */}
        <div className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full bg-surface-paper/95 p-3 backdrop-blur-md transition-transform duration-300 group-focus-within:translate-y-0 [@media(hover:hover)]:group-hover:translate-y-0 lg:block [@media(hover:none)]:hidden">
          <div className="flex gap-2">
            <Button className="h-11 min-w-0 flex-1 touch-manipulation rounded-md px-3" onClick={addToCart}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add
            </Button>
            <Button
              variant="outline"
              className={cn(
                "h-11 touch-manipulation rounded-md px-3",
                hasCompare && "border-primary bg-primary/10 text-primary",
              )}
              type="button"
              onClick={addToCompare}
            >
              {hasCompare ? "Selected" : "Compare"}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col space-y-2 px-0.5 pb-2 pt-3 sm:space-y-2.5 sm:pt-4">
        <p className="truncate text-[9px] font-medium uppercase tracking-[0.13em] text-muted-foreground sm:text-[10px]">{product.category}</p>
        <Link href={productHref} className="block min-w-0">
          <h3 className="line-clamp-2 min-h-[2.5rem] font-heading text-base font-medium leading-5 tracking-[-0.01em] text-foreground transition-colors hover:text-primary sm:min-h-0 sm:text-[1.35rem] sm:leading-snug">
            {product.name}
          </h3>
        </Link>
        <StarRating value={product.rating} count={product.reviewCount} />
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 sm:gap-2">
          <span className="text-sm font-semibold text-foreground sm:text-lg">
            {formatInr(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-[10px] text-muted-foreground line-through sm:text-sm">
              {formatInr(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
        {/* Mobile / touch: always-visible actions (same as desktop hover) */}
        <div className="mt-auto flex items-center gap-1.5 pt-1 sm:gap-2 lg:hidden [@media(hover:none)]:flex">
          <Button
            className="h-11 min-w-0 flex-1 touch-manipulation rounded-md px-1.5 text-xs sm:px-4 sm:text-sm"
            onClick={addToCart}
          >
            <ShoppingBag className="mr-1 h-3.5 w-3.5 shrink-0 sm:mr-1.5 sm:h-4 sm:w-4" />
            <span className="md:hidden">Add</span>
            <span className="hidden md:inline">Add to bag</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "size-11 shrink-0 touch-manipulation rounded-md p-0",
              hasCompare && "border-primary bg-primary/10 text-primary",
            )}
            type="button"
            onClick={addToCompare}
            aria-label={hasCompare ? `Selected in compare: ${product.name}` : `Compare ${product.name}`}
          >
            <GitCompareArrows className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
