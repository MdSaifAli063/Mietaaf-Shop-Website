"use client";

import Link from "next/link";
import Image from "next/image";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { BANNERS } from "@/lib/data/banners";
import { Button } from "@/components/ui/button";
import "swiper/css";
import "swiper/css/pagination";

export function HeroCarousel() {
  return (
    <section className="relative h-[min(calc(100dvh-4rem),820px)] w-full overflow-hidden bg-background sm:h-[min(calc(100dvh-4.5rem),860px)] lg:h-[min(100dvh,900px)]">
      <Swiper
        modules={[Autoplay, Pagination]}
        speed={520}
        autoplay={{ delay: 5200, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="absolute inset-0 h-full w-full [&_.swiper-slide]:!h-full [&_.swiper-wrapper]:!h-full [&_.swiper-pagination-bullet]:bg-white/45 [&_.swiper-pagination-bullet-active]:bg-[rgb(138_120_100)]"
      >
        {BANNERS.map((b, index) => (
          <SwiperSlide key={b.id} className="!h-full">
            <div className="relative h-full min-h-[inherit] w-full">
              <Image
                src={b.image}
                alt={b.title}
                fill
                priority={index === 0}
                className="object-cover object-[72%_center] sm:object-center"
                sizes="100vw"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/45 via-black/10 to-transparent sm:w-3/4" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end px-4 pb-[max(6rem,env(safe-area-inset-bottom))] sm:px-12 sm:pb-28 lg:px-16 lg:pb-32">
                <div className="max-w-xl space-y-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.48em] text-mietaaf-cream/80">
                    Mietaaf Atelier
                  </p>
                  <h1 className="max-w-lg font-heading text-3xl leading-[0.95] tracking-[0.01em] text-mietaaf-cream sm:text-5xl lg:text-6xl">
                    {b.title}
                  </h1>
                  {b.subtitle ? (
                    <p className="max-w-lg text-lg leading-7 text-mietaaf-cream/80 sm:text-xl">
                      {b.subtitle}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-3">
                    {b.href ? (
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full border-border/70 px-8 shadow-sm"
                      >
                        <Link href={b.href}>{b.cta ?? "Explore"}</Link>
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
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
