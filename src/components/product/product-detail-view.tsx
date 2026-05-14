"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, Share2, ShoppingBag, MessageCircle } from "lucide-react";
import type { Product } from "@/types";
import { DUMMY_PRODUCTS } from "@/lib/data/products";
import { reviewsForProduct } from "@/lib/data/reviews";
import { formatInr } from "@/lib/format";
import { buildProductInquiryWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/product/star-rating";
import { ProductCard } from "@/components/product/product-card";
import { useCartStore } from "@/store/cart-store";
import { useRecentStore } from "@/store/recent-store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const waNumber = () => process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";

export function ProductDetailView({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const pushRecent = useRecentStore((s) => s.push);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState(product.sizes[0]!);
  const [color, setColor] = useState(product.colors[0]!.name);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    pushRecent(product.slug);
  }, [product.slug, pushRecent]);

  const similar = useMemo(
    () =>
      DUMMY_PRODUCTS.filter(
        (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
      ).slice(0, 4),
    [product.categorySlug, product.id],
  );

  const recentSlugs = useRecentStore((s) => s.slugs).filter((s) => s !== product.slug);
  const recentProducts = recentSlugs
    .map((slug) => DUMMY_PRODUCTS.find((p) => p.slug === slug))
    .filter(Boolean) as Product[];

  const reviews = reviewsForProduct(product.id);

  const mainImg = product.images[imgIdx] ?? product.images[0]!;

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      toast.error("Could not share");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/category/${product.categorySlug}`}>
              {product.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4">
          <motion.div
            className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={mainImg}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.images.map((src, i) => (
              <button
                type="button"
                key={src}
                onClick={() => setImgIdx(i)}
                className={cn(
                  "relative h-20 w-16 shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-background transition-all",
                  i === imgIdx ? "ring-primary" : "ring-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <div>
            {product.discountPercent ? (
              <Badge className="mb-3 rounded-full">{product.discountPercent}% off</Badge>
            ) : null}
            <h1 className="font-heading text-4xl md:text-5xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <StarRating value={product.rating} count={product.reviewCount} />
              <span className="text-sm text-muted-foreground">
                {product.stock} in stock
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-semibold">{formatInr(product.price)}</span>
              {product.compareAtPrice ? (
                <span className="text-lg text-muted-foreground line-through">
                  {formatInr(product.compareAtPrice)}
                </span>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Size
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant={size === s ? "default" : "outline"}
                  className="rounded-full px-4"
                  onClick={() => setSize(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Color
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <Button
                  key={c.name}
                  type="button"
                  variant={color === c.name ? "default" : "outline"}
                  className="rounded-full gap-2"
                  onClick={() => setColor(c.name)}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-border"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm font-medium">Quantity</p>
            <div className="flex items-center rounded-full border border-border">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="flex-1 rounded-full"
              onClick={() => {
                addItem({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.images[0]!,
                  price: product.price,
                  quantity: qty,
                  size,
                  color,
                });
                toast.success("Added to cart");
              }}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 rounded-full border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10"
              asChild
            >
              <a
                href={buildProductInquiryWhatsAppUrl(
                  product,
                  { size, color, quantity: qty },
                  waNumber(),
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Buy via WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full" onClick={share}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Tabs defaultValue="desc" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/80">
              <TabsTrigger value="desc" className="rounded-full">
                Details
              </TabsTrigger>
              <TabsTrigger value="fabric" className="rounded-full">
                Fabric
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-full">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="desc" className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </TabsContent>
            <TabsContent value="fabric" className="mt-4 text-sm text-muted-foreground">
              {product.fabric}
            </TabsContent>
            <TabsContent value="reviews" className="mt-4 space-y-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border/60 bg-card/60 p-4">
                    <StarRating value={r.rating} />
                    <p className="mt-2 font-medium">{r.title}</p>
                    <p className="text-sm text-muted-foreground">{r.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {r.authorName} · {r.createdAt}
                    </p>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {recentProducts.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-heading text-2xl">Recently viewed</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-20">
        <h2 className="font-heading text-2xl">You may also like</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
