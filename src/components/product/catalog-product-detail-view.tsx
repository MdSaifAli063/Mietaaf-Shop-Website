"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Minus, Plus, ShoppingBag, MessageCircle } from "lucide-react";
import type { Product } from "@/types";
import { CatalogProductPanel } from "@/components/product/catalog-product-panel";
import { Button } from "@/components/ui/button";
import { buildProductInquiryWhatsAppUrl } from "@/lib/whatsapp";
import { useCartStore } from "@/store/cart-store";
import { useRecentStore } from "@/store/recent-store";
import { SITE_WHATSAPP_E164_DIGITS } from "@/lib/site-contact";
import { normalizeProductImageParam } from "@/lib/product-links";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import toast from "react-hot-toast";

const waNumber = () =>
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? SITE_WHATSAPP_E164_DIGITS;

export function CatalogProductDetailView({ product: originalProduct }: { product: Product }) {
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
  const [size, setSize] = useState(product.sizes[0]!);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    pushRecent(product.slug);
  }, [product.slug, pushRecent]);

  const color = product.colors[0]!.name;

  return (
    <div className="page-container min-w-0 py-8 sm:py-10 md:py-12">
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

      <CatalogProductPanel
        product={product}
        variant="detail"
        priority
        footer={
          <>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Select size
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

            <div className="mt-5 flex items-center gap-4">
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

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                className="h-11 flex-1 rounded-full touch-manipulation"
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
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to cart
              </Button>
              <Button
                variant="outline"
                className="h-11 flex-1 rounded-full border-[#25D366]/40 text-[#128C7E] touch-manipulation"
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
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              <Link href="/category/suits" className="text-primary hover:underline">
                ← All suits
              </Link>
            </p>
          </>
        }
      />
    </div>
  );
}
