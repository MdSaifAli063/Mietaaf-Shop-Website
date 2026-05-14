"use client";

import Image from "next/image";
import { DUMMY_PRODUCTS } from "@/lib/data/products";
import { PageEnter } from "@/components/motion/page-enter";

export default function LookbookPage() {
  const shots = DUMMY_PRODUCTS.flatMap((p) => p.images).slice(0, 9);
  return (
    <PageEnter>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Lookbook</p>
        <h1 className="mt-2 font-heading text-4xl md:text-5xl">Atelier lens</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          A study in drape, lapel, and light — the Mietaaf man in motion.
        </p>
        <div className="mt-12 grid gap-2 md:grid-cols-3">
          {shots.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className={`relative overflow-hidden rounded-2xl bg-muted ${
                i % 4 === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto md:min-h-[420px]" : "aspect-[3/4]"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
            </div>
          ))}
        </div>
      </div>
    </PageEnter>
  );
}
