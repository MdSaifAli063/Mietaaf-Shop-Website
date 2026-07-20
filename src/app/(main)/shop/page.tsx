import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopExplorer } from "@/components/shop/shop-explorer";
import { Skeleton } from "@/components/ui/skeleton";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Shop",
  description:
    "Shop Mietaaf sherwanis, suits, blazers, kurtas, waistcoats, and premium menswear for weddings and formal occasions.",
  path: "/shop",
});

function ShopFallback() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-2 gap-x-2.5 gap-y-5 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopExplorer />
    </Suspense>
  );
}
