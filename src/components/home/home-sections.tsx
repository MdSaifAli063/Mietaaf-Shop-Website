"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Play, Quote, Star } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { CatalogProductPanel } from "@/components/product/catalog-product-panel";
import { catalogPhotoCropWidth } from "@/components/product/catalog-product-photo";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useShopData } from "@/hooks/use-shop-data";
import { TESTIMONIALS } from "@/lib/data/testimonials";

export function HomeSections() {
  const { products, categories } = useShopData();

  const trending = products.filter((p) => p.trending).slice(0, 4);
  const arrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const wedding = products.filter((p) => p.wedding).slice(0, 3);
  const suits = products.filter((p) => p.categorySlug === "suits").slice(0, 2);
  const feed = products.slice(0, 8).flatMap((p) => p.images).slice(0, 12);

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
                  <Card className="overflow-hidden border-border/60 bg-card/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {c.slug === "suits" ? (
                        <div
                          className="absolute inset-y-0 left-0 h-full transition-transform duration-700 group-hover:scale-105"
                          style={{ width: catalogPhotoCropWidth }}
                        >
                          <Image
                            src={c.image}
                            alt={c.name}
                            fill
                            className="object-cover object-left"
                            sizes="(max-width:768px) 50vw, 25vw"
                          />
                        </div>
                      ) : (
                        <Image
                          src={c.image}
                          alt={c.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width:768px) 50vw, 25vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-heading text-xl">{c.name}</h3>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {c.description}
                        </p>
                      </div>
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
          <div className="mt-10 space-y-10 sm:space-y-12">
            {suits.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.07}>
                <CatalogProductPanel product={product} variant="listing" />
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
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                  <Image src={src} alt="" fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#eee4d6] py-14 sm:py-20 md:py-24 dark:bg-[#201d19]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1490114538075-5a882cff5318?w=1600&q=80&auto=format&fit=crop"
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
            <h2 className="font-heading text-2xl md:text-3xl">The feed</h2>
            <p className="text-sm text-muted-foreground">A moodboard in motion — new drops weekly.</p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2 md:grid-cols-6">
            {products.slice(0, 6).map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="relative aspect-square overflow-hidden">
                <Image
                  src={p.images[0]!}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width:640px) 50vw, 16vw"
                />
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
