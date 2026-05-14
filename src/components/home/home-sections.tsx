"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { CATEGORIES } from "@/lib/data/categories";
import { DUMMY_PRODUCTS } from "@/lib/data/products";
import { TESTIMONIALS } from "@/lib/data/testimonials";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const feed = DUMMY_PRODUCTS.slice(0, 8).flatMap((p) => p.images).slice(0, 12);

export function HomeSections() {
  const trending = DUMMY_PRODUCTS.filter((p) => p.trending).slice(0, 4);
  const arrivals = DUMMY_PRODUCTS.filter((p) => p.newArrival).slice(0, 4);
  const wedding = DUMMY_PRODUCTS.filter((p) => p.wedding).slice(0, 3);
  const suits = DUMMY_PRODUCTS.filter((p) => p.categorySlug === "suits").slice(0, 3);

  return (
    <>
      <section className="border-b border-border/60 bg-muted/30 py-20">
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
            {CATEGORIES.slice(0, 8).map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.05}>
                <Link href={`/category/${c.slug}`} className="group block">
                  <Card className="overflow-hidden border-border/60 bg-card/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width:768px) 50vw, 25vw"
                      />
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

      <section className="py-20">
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

      <section className="border-y border-border/60 bg-gradient-to-br from-card via-background to-muted/40 py-20">
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
              DUMMY_PRODUCTS.slice(0, 4).map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <ProductCard product={p} />
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="relative py-24">
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

      <section className="border-t border-border/60 bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-heading text-3xl md:text-4xl">Premium suits</h2>
            <p className="mt-2 text-muted-foreground">Architectural tailoring for decisive moments.</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {suits.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.07}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center font-heading text-3xl md:text-4xl">Client stories</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <Card className="h-full border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                  <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image src={t.image} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="mb-8 font-heading text-2xl md:text-3xl">Fashion gallery</h2>
          </Reveal>
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {feed.map((src, i) => (
              <motion.div
                key={`${src}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.04 }}
                className="mb-3 break-inside-avoid"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                  <Image src={src} alt="" fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1490114538075-5a882cff5318?w=1600&q=80&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
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

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-heading text-2xl md:text-3xl">The feed</h2>
            <p className="text-sm text-muted-foreground">A moodboard in motion — new drops weekly.</p>
          </Reveal>
          <div className="mt-8 grid grid-cols-3 gap-1 sm:gap-2 md:grid-cols-6">
            {DUMMY_PRODUCTS.slice(0, 6).map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="relative aspect-square overflow-hidden">
                <Image src={p.images[0]!} alt={p.name} fill className="object-cover transition-transform hover:scale-105" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/30 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <h3 className="font-heading text-2xl">Private list</h3>
          <p className="text-sm text-muted-foreground">
            Be first to access limited runs and appointment slots at our Mumbai atelier.
          </p>
          <form
            className="mt-2 flex w-full max-w-md gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Welcome to the private list.");
            }}
          >
            <Input type="email" required placeholder="Your email" className="h-11 rounded-full" />
            <Button type="submit" className="rounded-full px-6">
              Join
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
