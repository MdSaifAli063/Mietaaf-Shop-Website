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
  Quote,
  Star,
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
import { TESTIMONIALS } from "@/lib/data/testimonials";
import { cn } from "@/lib/utils";
import { UNSPLASH_PHOTOS, unsplashImageUrl } from "@/lib/unsplash-images";

export function HomeSections() {
  const { products, categories } = useShopData();

  const trending = products.filter((p) => p.trending).slice(0, 4);
  const arrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const wedding = products.filter((p) => p.wedding).slice(0, 3);
  const suits = products.filter((p) => p.categorySlug === "suits").slice(0, 2);
  const feed = products.slice(0, 8).flatMap((p) => p.images).slice(0, 12);
  const feedProducts = products.slice(0, 6);
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
      <section className="border-b border-border/60 bg-[#eee4d6] py-12 sm:py-16 md:py-20 dark:bg-[#201d19]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                  Curated
                </p>
                <h2 className="font-heading text-3xl md:text-4xl">Featured categories</h2>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/shop">
                  View all <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 8).map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.05}>
                <Link href={`/category/${c.slug}`} className="group block">
                  <Card className="gap-0 overflow-hidden border-border/60 bg-card py-0 shadow-sm backdrop-blur-none transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width:639px) 100vw, (max-width:1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="min-h-24 bg-card px-4 py-4">
                      <h3 className="font-heading text-xl">{c.name}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
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

      <section className="bg-[#fbf8f2] py-12 sm:py-16 md:py-20 dark:bg-[#181613]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-heading text-3xl md:text-4xl">Trending now</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Pieces our clients are wearing this season — from receptions to runway-inspired
              evenings.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-[#eee4d6] py-12 sm:py-16 md:py-20 dark:bg-[#201d19]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-heading text-3xl md:text-4xl">New arrivals</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {arrivals.length ? (
              arrivals.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <ProductCard product={p} />
                </Reveal>
              ))
            ) : (
              products.slice(0, 4).map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <ProductCard product={p} />
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="relative bg-[#fbf8f2] py-14 sm:py-20 md:py-24 dark:bg-[#181613]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                  Ceremonial
                </p>
                <h2 className="font-heading text-3xl md:text-4xl">Wedding collection</h2>
              </div>
              <Button asChild className="rounded-full">
                <Link href="/category/wedding-collection">Enter the edit</Link>
              </Button>
            </div>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {wedding.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-[#eee4d6] py-12 sm:py-16 md:py-20 dark:bg-[#201d19]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                  Tailored distinction
                </p>
                <h2 className="mt-2 font-heading text-3xl md:text-4xl">Premium suits</h2>
                <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                  Refined tuxedos, bandhgalas, and three-piece suits crafted for weddings and special occasions.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full bg-background/70">
                <Link href="/category/suits">
                  View all suits <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-5 xl:grid-cols-2 xl:gap-6">
            {suits.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.07}>
                <CatalogProductPanel product={product} variant="showcase" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-[#fbf8f2] py-16 dark:bg-[#181613]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="mb-8 font-heading text-2xl md:text-3xl">Fashion gallery</h2>
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

      <section className="relative overflow-hidden bg-[#eee4d6] py-14 sm:py-20 md:py-24 dark:bg-[#201d19]">
        <div className="absolute inset-0">
          <Image
            src={unsplashImageUrl(UNSPLASH_PHOTOS.tailoring, 1600, 80)}
            alt=""
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#eee4d6]/88 backdrop-blur-sm dark:bg-[#201d19]/90" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-primary">Brand</p>
            <h2 className="mt-4 font-heading text-3xl md:text-5xl">The Mietaaf story</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Born from atelier craft and a love for modern Indian masculinity, Mietaaf curates
              ceremonial and formal wardrobes with cinematic presence. Each piece is considered —
              fabric, fall, and the quiet confidence of gold on ivory.
            </p>
            <Button asChild variant="outline" className="mt-8 rounded-full px-8">
              <Link href="/about">
                <Play className="mr-2 h-4 w-4" />
                Discover more
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border/60 bg-[#fbf8f2] py-14 sm:py-18 md:py-20 dark:bg-[#181613]">
        <div className="pointer-events-none absolute -left-24 top-10 size-64 rounded-full bg-primary/8 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-mietaaf-gold/8 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                Worn with confidence
              </p>
              <h2 className="mt-3 font-heading text-3xl md:text-5xl">Client stories</h2>
              <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted-foreground">
                Personal experiences from clients who chose Mietaaf for their most memorable moments.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3 lg:gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 0.08}>
                <Card className="group flex h-full flex-col rounded-[1.5rem] border-border/70 bg-card/90 p-6 shadow-[0_16px_45px_rgba(58,48,38,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_22px_55px_rgba(58,48,38,0.1)] sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Quote className="size-4" aria-hidden="true" />
                    </span>
                    <div className="flex gap-0.5 text-primary" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={starIndex} className="size-3.5 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                  </div>

                  <blockquote className="mt-6 flex-1 font-heading text-xl leading-7 tracking-[0.01em] text-foreground sm:text-[1.35rem]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  <div className="mt-7 flex items-center gap-3 border-t border-border/70 pt-5">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-background shadow-sm">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eee4d6] py-12 sm:py-16 md:py-20 dark:bg-[#201d19]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                  From the atelier
                </p>
                <h2 className="mt-2 font-heading text-3xl md:text-4xl">The feed</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  A closer look at new silhouettes, refined details, and occasion-ready tailoring.
                </p>
              </div>
              <Button asChild variant="outline" className="w-fit rounded-full bg-background/70">
                <Link href="/shop">
                  Explore the collection <ArrowUpRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <div className="mt-8 grid auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[210px] lg:auto-rows-[190px] lg:grid-cols-4">
            {feedProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
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

      <section className="border-t border-border/60 bg-[#fbf8f2] py-10 sm:py-14 md:py-16 dark:bg-[#181613]">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <h3 className="font-heading text-xl sm:text-2xl">Private list</h3>
          <p className="text-sm text-muted-foreground">
            Be first to access limited runs and appointment slots at our Bengaluru atelier.
          </p>
          <form
            className="mt-2 flex w-full max-w-md touch-manipulation flex-col gap-2 sm:flex-row sm:items-stretch"
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
              className="h-11 min-w-0 flex-1 rounded-full"
            />
            <Button type="submit" className="h-11 w-full shrink-0 rounded-full px-6 sm:w-auto">
              Join
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
