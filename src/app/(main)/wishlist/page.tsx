"use client";

import Link from "next/link";
import { ArrowRight, Heart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/store/wishlist-store";
import { ProductCard } from "@/components/product/product-card";
import { PageEnter } from "@/components/motion/page-enter";
import { Button } from "@/components/ui/button";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import { useShopData } from "@/hooks/use-shop-data";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { CATEGORY_IMAGE_LINKS } from "@/lib/data/image-links/category-images";

export default function WishlistPage() {
  const storedIds = useWishlistStore((state) => state.ids);
  const storedImages = useWishlistStore((state) => state.images);
  const clear = useWishlistStore((state) => state.clear);
  const { products: allProducts } = useShopData();
  const mounted = useHasMounted();
  const ids = mounted ? storedIds : [];
  const products = allProducts
    .filter((product) => ids.includes(product.id))
    .map((product) => {
      const savedImage = storedImages[product.id] ?? CATEGORY_IMAGE_LINKS[product.categorySlug];
      return { ...product, images: [savedImage] };
    });

  if (products.length === 0) {
    return (
      <PageEnter>
        <div className={`${PAGE_CONTAINER} ${PAGE_PY}`}>
          <div className="mx-auto flex max-w-2xl flex-col items-center rounded-[2rem] border border-border/60 bg-card/75 px-5 py-14 text-center shadow-[0_24px_70px_rgba(58,48,38,0.08)] sm:px-10 sm:py-20">
            <span className="flex size-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
              <Heart className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Your edit
            </p>
            <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Your wishlist is waiting</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              Save the pieces you love and return whenever you are ready to choose.
            </p>
            <Button asChild className="mt-8 h-11 rounded-full px-7">
              <Link href="/shop">
                Explore collections
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </PageEnter>
    );
  }

  return (
    <PageEnter>
      <div className={`${PAGE_CONTAINER} ${PAGE_PY} min-w-0`}>
        <section className="rounded-[2rem] border border-border/60 bg-card/55 px-5 py-6 shadow-[0_18px_55px_rgba(58,48,38,0.06)] sm:px-8 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                Saved selection
              </p>
              <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Your wishlist</h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {products.length} {products.length === 1 ? "piece" : "pieces"} saved for later
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="h-10 rounded-full px-5">
                <Link href="/shop">Continue shopping</Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-full px-4 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  clear();
                  toast.success("Wishlist cleared");
                }}
              >
                <Trash2 className="mr-2 size-4" aria-hidden="true" />
                Clear all
              </Button>
            </div>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </div>
    </PageEnter>
  );
}
