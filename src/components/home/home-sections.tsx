"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  Play,
  X,
} from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { CatalogProductPanel } from "@/components/product/catalog-product-panel";
import { ProductThumbnailImage } from "@/components/product/catalog-product-photo";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useShopData } from "@/hooks/use-shop-data";
import { HOME_SECTION_IMAGE_LINKS } from "@/lib/data/image-links/home-section-images";
import { HOME_PRODUCT_SECTIONS } from "@/lib/data/home-product-sections";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { buildProductHref } from "@/lib/product-links";
import { bypassImageOptimization } from "@/lib/image-source";
import { DoorstepServiceBanner } from "@/components/home/doorstep-service-banner";
import { ClientStories } from "@/components/home/client-stories";

function takeUniqueProducts(
  preferredSlugs: readonly string[],
  fallback: Product[],
  count: number,
  usedIds: Set<string>,
  usedNames: Set<string>,
): Product[] {
  const selected: Product[] = [];
  const preferred = preferredSlugs
    .map((slug) => fallback.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));

  for (const product of [...preferred, ...fallback]) {
    const normalizedName = product.name.trim().toLocaleLowerCase();
    if (usedIds.has(product.id) || usedNames.has(normalizedName)) continue;
    selected.push(product);
    usedIds.add(product.id);
    usedNames.add(normalizedName);
    if (selected.length === count) break;
  }

  return selected;
}

export function HomeSections() {
  const { products, categories } = useShopData();

  const usedHomepageProductIds = new Set<string>();
  const usedHomepageProductNames = new Set<string>();
  const trending = takeUniqueProducts(
    HOME_PRODUCT_SECTIONS.trending,
    products,
    4,
    usedHomepageProductIds,
    usedHomepageProductNames,
  );
  const arrivals = takeUniqueProducts(
    HOME_PRODUCT_SECTIONS.newArrivals,
    products,
    4,
    usedHomepageProductIds,
    usedHomepageProductNames,
  );
  const wedding = takeUniqueProducts(
    HOME_PRODUCT_SECTIONS.weddingCollection,
    products,
    3,
    usedHomepageProductIds,
    usedHomepageProductNames,
  );
  const suits = takeUniqueProducts(
    HOME_PRODUCT_SECTIONS.premiumSuits,
    products,
    2,
    usedHomepageProductIds,
    usedHomepageProductNames,
  );
  const feed = [...HOME_SECTION_IMAGE_LINKS.fashionGallery];
  const feedProducts = takeUniqueProducts(
    HOME_PRODUCT_SECTIONS.feed,
    products,
    6,
    usedHomepageProductIds,
    usedHomepageProductNames,
  );
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const activeGalleryImage =
    activeGalleryIndex == null ? undefined : feed[activeGalleryIndex];

  function showPreviousGalleryImage() {
    if (!feed.length) return;
    setActiveGalleryIndex((current) =>
      current == null ? 0 : (current - 1 + feed.length) % feed.length,
    );
  }

  function showNextGalleryImage() {
    if (!feed.length) return;
    setActiveGalleryIndex((current) =>
      current == null ? 0 : (current + 1) % feed.length,
    );
  }

  return (
    <>
      <section className="atelier-section bg-surface-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-8 flex flex-col gap-5 sm:mb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="atelier-eyebrow mb-3">
                  Curated
                </p>
                <h2 className="atelier-heading">Featured categories</h2>
              </div>
              <Button asChild variant="link" className="w-fit rounded-none border-x-0 border-t-0 border-b border-foreground/40 px-0 text-xs uppercase tracking-[0.12em]">
                <Link prefetch={false} href="/shop">
                  View all <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {categories.slice(0, 8).map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.05}>
                <Link prefetch={false} href={`/category/${c.slug}`} className="group block h-full">
                  <Card className="h-full gap-0 overflow-visible rounded-none border-0 bg-transparent py-0 shadow-none">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-surface-silver">
                      <Image
                        src={c.image}
                        unoptimized={bypassImageOptimization(c.image)}
                        alt={c.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width:639px) 50vw, (max-width:1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="min-h-20 py-3 sm:py-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading text-xl leading-tight sm:text-2xl">{c.name}</h3>
                        <ArrowUpRight className="mt-1 size-4 shrink-0 stroke-[1.25] text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                      </div>
                      <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-muted-foreground sm:text-xs">
                        {c.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="atelier-section border-y border-border/70 bg-surface-silver">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="atelier-eyebrow mb-3">The selection</p>
            <h2 className="atelier-heading">Trending now</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Pieces our clients are wearing this season — from receptions to runway-inspired
              evenings.
            </p>
          </Reveal>
          <div className="mt-7 grid grid-cols-2 gap-x-2.5 gap-y-5 sm:mt-10 sm:gap-6 lg:grid-cols-4">
            {trending.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="atelier-section bg-surface-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="atelier-eyebrow mb-3">New to the atelier</p>
            <h2 className="atelier-heading">New arrivals</h2>
          </Reveal>
          <div className="mt-7 grid grid-cols-2 gap-x-2.5 gap-y-5 sm:mt-10 sm:gap-6 lg:grid-cols-4">
            {arrivals.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="atelier-section relative border-y border-border/60 bg-surface-cream">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="atelier-eyebrow">
                  Ceremonial
                </p>
                <h2 className="atelier-heading mt-3">Wedding collection</h2>
              </div>
              <Button asChild className="w-fit rounded-md">
                <Link prefetch={false} href="/category/wedding-collection">Enter the edit</Link>
              </Button>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-5 sm:gap-6 lg:grid-cols-3">
            {wedding.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="premium-suits" aria-labelledby="premium-suits-heading" className="atelier-section bg-surface-paper">
        <div className="page-container">
          <Reveal>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
              <div className="min-w-0 max-w-2xl">
                <p className="atelier-eyebrow">
                  Tailored distinction
                </p>
                <h2 id="premium-suits-heading" className="atelier-heading mt-3">Premium suits</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                  Refined tuxedos, bandhgalas, and three-piece suits crafted for weddings and special occasions.
                </p>
              </div>
              <Button asChild variant="outline" className="w-fit shrink-0 self-start rounded-full bg-card px-5 sm:self-auto">
                <Link prefetch={false} href="/category/suits">
                  View all suits <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 xl:grid-cols-2">
            {suits.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.07} className="h-full min-w-0">
                <CatalogProductPanel product={product} variant="showcase" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="atelier-section border-y border-border/70 bg-surface-silver">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="atelier-eyebrow mb-3">Through our lens</p>
            <h2 className="atelier-heading mb-8 sm:mb-10">Fashion gallery</h2>
          </Reveal>
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {feed.map((src, i) => (
              <div key={`${src}-${i}`} className="mb-3 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setActiveGalleryIndex(i)}
                  className="group relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-xl bg-muted text-left outline-none ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`Open fashion gallery image ${i + 1}`}
                >
                  <Image
                    src={src}
                    unoptimized={bypassImageOptimization(src)}
                    alt={`Mietaaf fashion look ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 50vw, 25vw"
                  />
                  <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                  <span className="absolute bottom-3 right-3 flex size-9 translate-y-2 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <Expand className="size-4" aria-hidden="true" />
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog
        open={activeGalleryIndex != null}
        onOpenChange={(open) => {
          if (!open) setActiveGalleryIndex(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/75 supports-backdrop-filter:backdrop-blur-md"
          className="h-dvh w-dvw max-w-none! gap-0 overflow-hidden rounded-none border-x-0 border-white/15 bg-[#171512]/98 p-0 text-white shadow-2xl ring-0 sm:h-[min(92dvh,920px)] sm:w-[min(96vw,1280px)] sm:max-w-[min(96vw,1280px)]! sm:rounded-2xl sm:border-x"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              showPreviousGalleryImage();
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              showNextGalleryImage();
            }
          }}
        >
          <DialogTitle className="sr-only">Fashion gallery image viewer</DialogTitle>
          <DialogDescription className="sr-only">
            Use the previous and next buttons or your keyboard arrow keys to browse the gallery.
          </DialogDescription>

          <div className="relative h-full w-full">
            {activeGalleryImage ? (
              <Image
                key={activeGalleryImage}
                src={activeGalleryImage}
                unoptimized={bypassImageOptimization(activeGalleryImage)}
                alt={`Mietaaf fashion look ${(activeGalleryIndex ?? 0) + 1}`}
                fill
                priority
                className="object-contain p-3 sm:p-6"
                sizes="96vw"
              />
            ) : null}

            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/55 to-transparent" />
            <DialogClose
              render={
                <button
                  type="button"
                  className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-20 flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5 sm:top-5"
                />
              }
            >
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">Close gallery</span>
            </DialogClose>

            <button
              type="button"
              onClick={showPreviousGalleryImage}
              className="absolute left-3 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5 sm:size-12"
              aria-label="Previous gallery image"
            >
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={showNextGalleryImage}
              className="absolute right-3 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5 sm:size-12"
              aria-label="Next gallery image"
            >
              <ChevronRight className="size-6" aria-hidden="true" />
            </button>

            <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs font-medium tracking-[0.18em] text-white/90 backdrop-blur-md sm:bottom-4">
              {(activeGalleryIndex ?? 0) + 1} / {feed.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <section className="bg-surface-cream">
        <div className="mx-auto grid max-w-[1600px] md:grid-cols-2">
        <div className="relative min-h-80 sm:min-h-[480px] md:min-h-[600px]">
          <Image
            src={HOME_SECTION_IMAGE_LINKS.mietaafStory}
            unoptimized={bypassImageOptimization(HOME_SECTION_IMAGE_LINKS.mietaafStory)}
            alt="Mietaaf couture details"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-14 sm:px-10 sm:py-16 lg:px-16 xl:px-20">
          <Reveal>
            <p className="atelier-eyebrow">Brand</p>
            <h2 className="atelier-heading mt-4">The Mietaaf story</h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground lg:text-base lg:leading-8">
              Born from atelier craft and a love for modern Indian masculinity, Mietaaf curates
              ceremonial and formal wardrobes with cinematic presence. Each piece is considered —
              fabric, fall, and the quiet confidence of gold on ivory.
            </p>
            <Button asChild variant="outline" className="mt-8 rounded-md px-6">
              <Link prefetch={false} href="/about">
                <Play className="mr-2 h-4 w-4" />
                Discover more
              </Link>
            </Button>
          </Reveal>
        </div>
        </div>
      </section>

      <ClientStories />

      <DoorstepServiceBanner />

      <section className="atelier-section bg-surface-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                  From the atelier
                </p>
                <h2 className="atelier-heading mt-3">The feed</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  A closer look at new silhouettes, refined details, and occasion-ready tailoring.
                </p>
              </div>
              <Button asChild variant="outline" className="w-fit rounded-full bg-background/70">
                <Link prefetch={false} href="/shop">
                  Explore the collection <ArrowUpRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <div className="mt-8 grid auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[210px] lg:auto-rows-[190px] lg:grid-cols-4">
            {feedProducts.map((product, index) => (
              <Link prefetch={false}
                key={product.id}
                href={buildProductHref(product.slug, product.images[0])}
                className={cn(
                  "group relative overflow-hidden rounded-2xl bg-muted shadow-sm outline-none ring-offset-background transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  index === 0 && "col-span-2 row-span-2",
                  index === 1 && "col-span-2",
                  (index === 4 || index === 5) && "col-span-2",
                )}
              >
                <ProductThumbnailImage
                  src={product.images[0]!}
                  alt={product.name}
                  sizes={
                    index === 0
                      ? "(max-width:1024px) 100vw, 50vw"
                      : "(max-width:1024px) 100vw, 25vw"
                  }
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-linear-to-t from-black/70 via-black/5 to-transparent transition-colors duration-300 group-hover:from-black/80" />
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                  {product.category}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
                  <span className="min-w-0">
                    <span className="block font-heading text-lg leading-tight sm:text-xl">
                      {product.name}
                    </span>
                    <span className="mt-1 block text-xs text-white/75">View the look</span>
                  </span>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition-all group-hover:bg-white group-hover:text-foreground">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/70 bg-surface-cream py-12 sm:py-16">
        <div className="page-container grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
          <p className="atelier-eyebrow mb-3">Stay in the know</p>
          <h3 className="font-heading text-4xl tracking-[-0.02em] sm:text-5xl">Private list</h3>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Be first to access limited runs and appointment slots at our Bengaluru atelier.
          </p>
          </div>
          <form
            className="flex w-full touch-manipulation flex-col gap-3 sm:flex-row sm:items-stretch"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Welcome to the private list.");
            }}
          >
            <Input
              id="mietaaf-home-private-list-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Your email"
              aria-label="Email address for the private list"
              className="h-12 min-w-0 flex-1 rounded-md bg-surface-paper"
            />
            <Button type="submit" className="h-12 w-full shrink-0 rounded-md px-8 sm:w-auto">
              Join
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
