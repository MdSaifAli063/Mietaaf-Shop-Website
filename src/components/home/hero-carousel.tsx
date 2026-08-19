"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Home, MapPin, Ruler, SwatchBook } from "lucide-react";
import { useShopData } from "@/hooks/use-shop-data";
import { bypassImageOptimization } from "@/lib/image-source";
import { Button } from "@/components/ui/button";

export function HeroCarousel() {
  const { banners } = useShopData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMobileHomeService, setShowMobileHomeService] = useState(true);
  const activeBanner = banners[activeIndex] ?? banners[0];

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    if (activeIndex >= banners.length) setActiveIndex(0);
  }, [activeIndex, banners.length]);

  useEffect(() => {
    let hideTimer: number | undefined;
    let restartTimer: number | undefined;

    const cycleHomeService = () => {
      setShowMobileHomeService(true);
      hideTimer = window.setTimeout(() => {
        setShowMobileHomeService(false);
        restartTimer = window.setTimeout(cycleHomeService, 2000);
      }, 4000);
    };

    cycleHomeService();

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(restartTimer);
    };
  }, []);

  if (!activeBanner) return null;

  return (
    <section className="relative h-[calc(100svh-6.25rem)] min-h-[450px] w-full overflow-hidden bg-background sm:h-[calc(100svh-7.25rem)] sm:min-h-[520px] lg:h-[calc(100svh-8.25rem)] lg:min-h-[600px]">
      <div className="relative h-full min-h-[inherit] w-full">
        <Image
          key={activeBanner.id}
          src={activeBanner.image}
          unoptimized={bypassImageOptimization(activeBanner.image)}
          alt={activeBanner.title}
          fill
          priority={activeIndex === 0}
          className="object-cover object-[72%_18%] animate-in fade-in duration-700 sm:object-[center_18%]"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/45 via-black/10 to-transparent sm:w-3/4" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
        <aside className="absolute left-10 top-0 z-10 hidden w-[21.5rem] origin-top lg:block lg:left-16 motion-safe:animate-[mietaaf-hanging-sign_5.5s_ease-in-out_infinite] motion-reduce:animate-none">
          <span className="absolute left-[23%] top-0 h-10 w-px bg-linear-to-b from-[#efd7a8]/90 to-[#b98747]/75" />
          <span className="absolute right-[23%] top-0 h-10 w-px bg-linear-to-b from-[#efd7a8]/90 to-[#b98747]/75" />
          <span className="absolute left-[calc(23%-0.32rem)] top-8 z-10 size-2.5 rounded-full border border-[#f7e3bc] bg-[#a87337] shadow-[0_1px_8px_rgba(0,0,0,0.45)]" />
          <span className="absolute right-[calc(23%-0.32rem)] top-8 z-10 size-2.5 rounded-full border border-[#f7e3bc] bg-[#a87337] shadow-[0_1px_8px_rgba(0,0,0,0.45)]" />
          <div className="relative mt-9 overflow-hidden rounded-[1.5rem] border-2 border-[#c49342] bg-[#fffdf8]/96 p-5 text-[#2a211a] shadow-[0_22px_48px_rgba(0,0,0,0.34)] backdrop-blur-md">
            <span className="pointer-events-none absolute inset-2 rounded-[1.02rem] border border-[#dfbd78]/65" />
            <span className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-[#e7bd73]/28 blur-3xl motion-safe:animate-[mietaaf-doorstep-glow_4s_ease-in-out_infinite]" />
            <span className="mietaaf-doorstep-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-[#d2a552]/14 to-transparent" />
            <div className="relative">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#95692f]">
                <span className="flex size-5 items-center justify-center rounded-full border border-[#b98747]/50 bg-[#f8ead0]">
                  <span className="size-1.5 rounded-full bg-[#b98747] motion-safe:animate-pulse" />
                </span>
                Door-to-door service
              </p>
              <h2 className="mt-3 max-w-sm font-heading text-[2.05rem] leading-[0.96] tracking-[0.01em] text-[#2a211a]">
                Tailoring,<br />brought home.
              </h2>
              <p className="mt-3 max-w-sm text-[13px] leading-5 text-[#65594e]">
                Handling Premium fabric Selection, Master fitting and Personal Design consultation right at your doorstep.
              </p>
              <div className="mt-3.5 flex items-center gap-2 text-[11px] font-medium text-[#51463c]">
                <SwatchBook className="size-3.5 text-[#af7b38]" aria-hidden="true" />
                <Ruler className="size-3.5 text-[#af7b38]" aria-hidden="true" />
                <MapPin className="size-3.5 text-[#af7b38]" aria-hidden="true" />
                <span>Fabric · Fit · Final detail</span>
              </div>
              <Link
                href="/appointment"
                className="group relative mt-4 inline-flex h-10 min-w-48 items-center justify-center bg-[#e4b657] px-5 text-[13px] font-bold uppercase tracking-[0.08em] text-[#1c160f] transition-transform hover:-translate-y-0.5 hover:bg-[#f0c96f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b78335] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf8]"
                style={{ clipPath: "polygon(7% 0, 100% 0, 93% 100%, 0 100%)" }}
              >
                <span className="absolute -inset-x-1.5 bottom-[-0.34rem] -z-10 h-3 bg-[#17120e]" style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" }} />
                <span className="relative inline-flex items-center">
                  Book now <ArrowUpRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        </aside>
        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-12 sm:pb-12 lg:px-16 lg:pb-10">
          <div className="max-w-xl space-y-4 sm:space-y-5">
            <div className="relative h-10 overflow-hidden lg:hidden">
              <Link
                href="/appointment"
                className={`absolute left-0 top-0 inline-flex h-9 max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-full border border-[#efd7a8]/65 bg-[#201812]/88 px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#fff9ee] shadow-[0_8px_22px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-500 ease-out ${
                  showMobileHomeService
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-[calc(100%+1rem)] opacity-0 pointer-events-none"
                }`}
                aria-hidden={!showMobileHomeService}
                tabIndex={showMobileHomeService ? 0 : -1}
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-[#efd7a8]/45 bg-[#efd7a8]/12">
                  <Home className="size-3 text-[#f4d79d]" aria-hidden="true" />
                </span>
                <span className="truncate">Doorstep service available</span>
                <ArrowUpRight className="size-3.5 shrink-0 text-[#f4d79d]" aria-hidden="true" />
              </Link>
            </div>
            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.48em] text-mietaaf-cream/80 lg:block">
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
          {banners.map((banner, index) => (
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
