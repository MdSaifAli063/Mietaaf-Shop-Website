"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Home, MapPin, Pause, Play, Ruler, SwatchBook } from "lucide-react";
import { useShopData } from "@/hooks/use-shop-data";
import { Button } from "@/components/ui/button";
import { usePageInteraction } from "@/hooks/use-page-interaction";
import { HeroImage } from "@/components/home/hero-image";

export function HeroCarousel() {
  const { banners } = useShopData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const interacted = usePageInteraction();
  const heroRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const activeBanner = banners[activeIndex] ?? banners[0];

  useEffect(() => {
    if (banners.length < 2 || paused || !interacted || !visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % banners.length), 6500);
    return () => window.clearInterval(timer);
  }, [banners.length, paused, interacted, visible]);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry!.isIntersecting));
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeIndex >= banners.length) setActiveIndex(0);
  }, [activeIndex, banners.length]);

  if (!activeBanner) return null;

  return (
    <section ref={heroRef} aria-label="Featured collections" aria-roledescription="carousel" className="storefront-hero-height relative overflow-hidden bg-[#30332d] text-white">
      <HeroImage key={activeBanner.id} src={activeBanner.image} alt={activeBanner.title} first={activeIndex === 0} />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#171d16]/65 via-[#171d16]/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#11170f]/80 via-transparent to-black/5" />
      <div className="page-container relative flex min-h-[inherit] flex-col gap-7 py-6 sm:gap-8 sm:py-8">
        <aside aria-label="Door-to-door tailoring service" className="hanging-service-sign relative hidden w-full max-w-[21rem] shrink-0 pt-4 text-mietaaf-charcoal xl:block">
          <div aria-hidden="true" className="pointer-events-none absolute -top-8 inset-x-0 z-10 h-12">
            {["left-[22%]", "left-[78%]"].map((position) => (
              <span key={position} className={`absolute top-0 h-full w-px bg-linear-to-b from-[#dfc58b]/60 to-[#ad7d38] ${position}`}>
                <span className="absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-[#dfbb76] bg-[#ad7d38] shadow-[0_2px_4px_rgba(48,42,36,0.3)]" />
              </span>
            ))}
          </div>
          <div className="relative rounded-[1.375rem] border border-[#cba156] bg-linear-to-br from-[#fffdf8] via-[#f8f5ef] to-[#f5f1e9] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-[7px] rounded-[1rem] border border-[#d7b976]/55" />
            <div className="relative">
              <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#956b2e]">
                <span aria-hidden="true" className="flex size-[18px] items-center justify-center rounded-full border border-[#d7b976]/65 bg-[#f6e9cd]">
                  <span className="size-1.5 rounded-full bg-[#b8873f]" />
                </span>
                Door-to-door service
              </p>
              <h2 className="mt-3 font-heading text-[1.875rem] leading-[0.98] tracking-[-0.02em]">Tailoring,<br />brought home.</h2>
              <p className="mt-3 text-xs leading-5 text-mietaaf-charcoal/75">Handling Premium fabric Selection, Master fitting and Personal Design consultation right at your doorstep.</p>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-mietaaf-charcoal/75">
                <span className="flex items-center gap-2 text-[#ad7d38]" aria-hidden="true"><SwatchBook className="size-3.5" /><Ruler className="size-3.5" /><MapPin className="size-3.5" /></span>
                <span>Fabric · Fit · Final detail</span>
              </div>
              <Link prefetch={false} href="/appointment" className="group relative mt-4 inline-flex min-h-11 min-w-44 items-center justify-center gap-3 px-6 text-[11px] font-semibold uppercase tracking-[0.1em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#795c40]">
                <span aria-hidden="true" className="absolute inset-0 translate-y-1 bg-mietaaf-charcoal [clip-path:polygon(8%_0,100%_0,92%_100%,0%_100%)]" />
                <span aria-hidden="true" className="absolute inset-0 bg-[#e6b956] transition-colors [clip-path:polygon(8%_0,100%_0,92%_100%,0%_100%)] group-hover:bg-[#efc66c]" />
                <span className="relative">Book now</span><ArrowUpRight className="relative size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </aside>
        <div className="mt-auto min-w-0 shrink-0">
          <div className="max-w-2xl">
            <Link prefetch={false} href="/appointment" className="mb-6 inline-flex min-h-11 items-center gap-2 border-b border-white/45 text-[9px] font-medium uppercase tracking-[0.16em] text-white/90 xl:hidden"><Home className="size-3.5" aria-hidden="true" /> Doorstep service available <ArrowUpRight className="size-3.5" aria-hidden="true" /></Link>
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.32em] text-white/75">Mietaaf Couture</p>
            <h2 className="font-heading text-[clamp(2.75rem,5.2vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.035em] text-mietaaf-cream">{activeBanner.title}</h2>
            {activeBanner.subtitle ? (
              <p className="mt-5 max-w-md text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
                {activeBanner.subtitle}
              </p>
            ) : null}
            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              {activeBanner.href ? (
                <Button asChild size="lg" className="h-12 rounded-md border-mietaaf-cream/80 bg-mietaaf-cream px-5 text-mietaaf-charcoal hover:border-mietaaf-cream hover:bg-mietaaf-cream/90 sm:px-7">
                  <Link prefetch={false} href={activeBanner.href}>
                    {activeBanner.cta ?? "Explore"}
                    <ArrowUpRight className="ml-1 size-4" aria-hidden="true" />
                  </Link>
                </Button>
              ) : null}
              <Button asChild size="lg" variant="outline" className="h-12 rounded-md border-white/40 bg-transparent px-5 text-white hover:border-white hover:bg-white/10 hover:text-white sm:px-7">
                <Link prefetch={false} href="/shop">Shop all</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="mr-1 text-[10px] tabular-nums tracking-[0.12em] text-white/70">{String(activeIndex + 1).padStart(2, "0")} <span className="mx-1 text-white/35">/</span> {String(banners.length).padStart(2, "0")}</span>
          <div className="flex">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="flex h-11 w-9 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={`Show ${banner.title}`}
                aria-pressed={index === activeIndex}
              >
                <span className={`h-px w-7 bg-white transition-opacity ${index === activeIndex ? "opacity-100" : "opacity-30"}`} />
              </button>
            ))}
          </div>
          {banners.length > 1 ? (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              className="group flex size-11 items-center justify-center rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full border border-white/25 transition-colors group-hover:bg-white/10">
                {paused ? <Play className="size-3" /> : <Pause className="size-3" />}
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
