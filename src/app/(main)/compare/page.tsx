"use client";

import Link from "next/link";
import Image from "next/image";
import { useCompareStore } from "@/store/compare-store";
import { DUMMY_PRODUCTS } from "@/lib/data/products";
import { PageEnter } from "@/components/motion/page-enter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatInr } from "@/lib/format";

export default function ComparePage() {
  const slugs = useCompareStore((s) => s.slugs);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const products = slugs
    .map((slug) => DUMMY_PRODUCTS.find((p) => p.slug === slug))
    .filter(Boolean) as typeof DUMMY_PRODUCTS;

  if (products.length === 0) {
    return (
      <PageEnter>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <p className="font-heading text-2xl">Nothing to compare</p>
          <p className="mt-2 text-muted-foreground">
            Use &ldquo;Compare&rdquo; on product cards (up to four pieces).
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/shop">Browse shop</Link>
          </Button>
        </div>
      </PageEnter>
    );
  }

  return (
    <PageEnter>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-heading text-3xl">Compare</h1>
          <Button variant="outline" className="rounded-full" onClick={clear}>
            Clear all
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Card key={p.id} className="overflow-hidden border-border/60">
              <div className="relative aspect-[3/4] bg-muted">
                <Image src={p.images[0]!} alt={p.name} fill className="object-cover" />
              </div>
              <div className="space-y-2 p-4 text-sm">
                <p className="font-heading text-lg leading-snug">{p.name}</p>
                <p>{formatInr(p.price)}</p>
                <p className="text-muted-foreground">Fabric: {p.fabric.slice(0, 80)}…</p>
                <p className="text-muted-foreground">Sizes: {p.sizes.join(", ")}</p>
                <Button variant="ghost" size="sm" onClick={() => remove(p.slug)}>
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageEnter>
  );
}
