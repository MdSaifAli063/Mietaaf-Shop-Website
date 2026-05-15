"use client";

import Link from "next/link";
import Image from "next/image";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { BANNERS } from "@/lib/data/banners";
import { Button } from "@/components/ui/button";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export function HeroCarousel() {
  return (
    <section className="relative h-[min(calc(100dvh-4rem),820px)] w-full overflow-hidden bg-black sm:h-[min(calc(100dvh-4.5rem),860px)] lg:h-[min(100dvh,900px)]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={520}
        autoplay={{ delay: 5200, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="absolute inset-0 h-full w-full [&_.swiper-slide]:!h-full [&_.swiper-wrapper]:!h-full [&_.swiper-pagination-bullet]:bg-white/50 [&_.swiper-pagination-bullet-active]:bg-primary"
      >
        {BANNERS.map((b, index) => (
          <SwiperSlide key={b.id} className="!h-full">
            <div className="relative h-full min-h-[inherit] w-full">
              <Image
                src={b.image}
                alt={b.title}
                fill
                priority={index === 0}
                className="object-cover opacity-90"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end px-4 pb-[max(6rem,env(safe-area-inset-bottom))] sm:px-12 sm:pb-28 lg:px-16 lg:pb-32">
                <div className="max-w-xl space-y-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.45em] text-primary">
                    Mietaaf Atelier
                  </p>
                  <h1 className="font-heading text-3xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                    {b.title}
                  </h1>
                  {b.subtitle ? (
                    <p className="text-lg text-muted-foreground sm:text-xl">{b.subtitle}</p>
                  ) : null}
                  <div className="flex flex-wrap gap-3">
                    {b.href ? (
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full px-8 shadow-lg shadow-primary/20"
                      >
                        <Link href={b.href}>{b.cta ?? "Explore"}</Link>
                      </Button>
                    ) : null}
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-full border-primary/40 bg-background/40 backdrop-blur"
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
