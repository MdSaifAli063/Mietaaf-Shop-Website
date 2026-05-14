"use client";

import Link from "next/link";
import { DUMMY_PRODUCTS } from "@/lib/data/products";
import { useWishlistStore } from "@/store/wishlist-store";
import { ProductCard } from "@/components/product/product-card";
import { PageEnter } from "@/components/motion/page-enter";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const products = DUMMY_PRODUCTS.filter((p) => ids.includes(p.id));

  if (products.length === 0) {
    return (
      <PageEnter>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <p className="font-heading text-3xl">Wishlist is empty</p>
          <p className="mt-3 text-muted-foreground">
            Tap the heart on any piece to save it for later.
          </p>
          <Button asChild className="mt-8 rounded-full">
            <Link href="/shop">Discover products</Link>
          </Button>
        </div>
      </PageEnter>
    );
  }

  return (
    <PageEnter>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl">Wishlist</h1>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </PageEnter>
  );
}
