"use client";

import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist-store";
import { ProductCard } from "@/components/product/product-card";
import { PageEnter } from "@/components/motion/page-enter";
import { Button } from "@/components/ui/button";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import { useShopData } from "@/hooks/use-shop-data";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const { products: allProducts } = useShopData();
  const products = allProducts.filter((p) => ids.includes(p.id));

  if (products.length === 0) {
    return (
      <PageEnter>
        <div className={`${PAGE_CONTAINER} ${PAGE_PY} mx-auto max-w-lg text-center`}>
          <p className="font-heading text-2xl sm:text-3xl">Wishlist is empty</p>
          <p className="mt-3 text-muted-foreground">
            Tap the heart on any piece to save it for later.
          </p>
          <Button asChild className="mt-8 h-11 rounded-full">
            <Link href="/shop">Discover products</Link>
          </Button>
        </div>
      </PageEnter>
    );
  }

  return (
    <PageEnter>
      <div className={`${PAGE_CONTAINER} ${PAGE_PY} min-w-0`}>
        <h1 className="font-heading text-3xl sm:text-4xl">Wishlist</h1>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </PageEnter>
  );
}
