"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Minus, Plus, Share2, ShoppingBag, MessageCircle } from "lucide-react";
import type { Product } from "@/types";
import { reviewsForProduct } from "@/lib/data/reviews";
import { useShopData } from "@/hooks/use-shop-data";
import { formatInr } from "@/lib/format";
import { buildProductInquiryWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/product/star-rating";
import { ProductCard } from "@/components/product/product-card";
import { useCartStore } from "@/store/cart-store";
import { useRecentStore } from "@/store/recent-store";
import { useHasMounted } from "@/hooks/use-has-mounted";
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
import { SITE_WHATSAPP_E164_DIGITS } from "@/lib/site-contact";
import { normalizeProductImageParam } from "@/lib/product-links";
const waNumber = () =>
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? SITE_WHATSAPP_E164_DIGITS;

export function ProductDetailView({ product: originalProduct }: { product: Product }) {
  const searchParams = useSearchParams();
  const selectedImage = normalizeProductImageParam(searchParams.get("image"));
  const product = useMemo(
    () =>
      selectedImage
        ? { ...originalProduct, images: [selectedImage] }
        : originalProduct,
    [originalProduct, selectedImage],
  );
  const addItem = useCartStore((s) => s.addItem);
  const pushRecent = useRecentStore((s) => s.push);
  const mounted = useHasMounted();
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState(product.sizes[0]!);
  const [color, setColor] = useState(product.colors[0]!.name);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    pushRecent(product.slug);
  }, [product.slug, pushRecent]);

  const { products: allProducts } = useShopData();

  const similar = useMemo(
    () =>
      allProducts.filter(
        (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
      ).slice(0, 4),
    [product.categorySlug, product.id, allProducts],
  );

  const storedRecentSlugs = useRecentStore((s) => s.slugs);
  const recentSlugs = (mounted ? storedRecentSlugs : []).filter(
    (slug) => slug !== product.slug,
  );
  const recentProducts = recentSlugs
    .map((slug) => allProducts.find((p) => p.slug === slug))
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
    <div className="page-container min-w-0 py-8 sm:py-10 md:py-12">
      <p className="mb-4 text-sm text-muted-foreground sm:hidden">
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.categorySlug}`} className="hover:text-primary">
          {product.category}
        </Link>
      </p>
      <Breadcrumb className="mb-6 hidden sm:block">
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
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted transition-transform duration-300 hover:scale-[1.01]">
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
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {product.images.map((src, i) => (
              <button
                type="button"
                key={`${product.id}-${i}-${src}`}
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
            <h1 className="font-heading text-2xl leading-tight sm:text-4xl md:text-5xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <StarRating value={product.rating} count={product.reviewCount} />
              <span className="text-sm text-muted-foreground">
                {product.stock} in stock
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
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
                  className="h-10 min-h-10 touch-manipulation rounded-full px-4"
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

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="h-12 w-full touch-manipulation rounded-full sm:h-11"
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
              className="h-12 w-full touch-manipulation rounded-full border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10 sm:h-11"
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
            <Button
              size="lg"
              variant="secondary"
              className="h-12 w-full touch-manipulation rounded-full sm:h-11"
              onClick={share}
            >
              <Share2 className="mr-2 h-5 w-5 sm:mr-0" />
              <span className="sm:sr-only">Share</span>
              <span className="sm:hidden">Share product</span>
            </Button>
          </div>

          <Tabs defaultValue="desc" className="w-full min-w-0">
            <TabsList className="flex h-auto w-full gap-1 overflow-x-auto rounded-full bg-muted/80 p-1">
              <TabsTrigger value="desc" className="shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm">
                Details
              </TabsTrigger>
              <TabsTrigger value="fabric" className="shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm">
                Fabric
              </TabsTrigger>
              <TabsTrigger value="reviews" className="shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm">
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
        <section className="mt-12 sm:mt-16 md:mt-20">
          <h2 className="font-heading text-2xl">Recently viewed</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 sm:mt-16 md:mt-20">
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
