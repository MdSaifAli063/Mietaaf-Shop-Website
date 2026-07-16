"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BANNERS } from "@/lib/data/banners";
import { Button } from "@/components/ui/button";

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBanner = BANNERS[activeIndex] ?? BANNERS[0]!;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % BANNERS.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[calc(100svh-6.25rem)] min-h-[450px] w-full overflow-hidden bg-background sm:h-[calc(100svh-7.25rem)] sm:min-h-[520px] lg:h-[calc(100svh-8.25rem)] lg:min-h-[600px]">
      <div className="relative h-full min-h-[inherit] w-full">
        <Image
          key={activeBanner.id}
          src={activeBanner.image}
          alt={activeBanner.title}
          fill
          priority={activeIndex === 0}
          className="object-cover object-[72%_18%] animate-in fade-in duration-700 sm:object-[center_18%]"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/45 via-black/10 to-transparent sm:w-3/4" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-12 sm:pb-12 lg:px-16 lg:pb-10">
          <div className="max-w-xl space-y-4 sm:space-y-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.48em] text-mietaaf-cream/80">
              Mietaaf Couture
            </p>
            <h1 className="max-w-lg font-heading text-3xl leading-[0.95] tracking-[0.01em] text-mietaaf-cream sm:text-5xl lg:text-6xl">
              {activeBanner.title}
            </h1>
            {activeBanner.subtitle ? (
              <p className="max-w-lg text-base leading-6 text-mietaaf-cream/80 sm:text-lg lg:text-xl lg:leading-7">
                {activeBanner.subtitle}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              {activeBanner.href ? (
                <Button
                  asChild
                  size="lg"
                  className="rounded-full border-border/70 px-8 shadow-sm"
                >
                  <Link href={activeBanner.href}>{activeBanner.cta ?? "Explore"}</Link>
                </Button>
              ) : null}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-mietaaf-cream/35 bg-black/10 text-mietaaf-cream"
              >
                <Link href="/shop">Shop all</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {BANNERS.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`size-2 rounded-full transition-colors ${
                index === activeIndex ? "bg-[rgb(138_120_100)]" : "bg-white/45"
              }`}
              aria-label={`Show ${banner.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
