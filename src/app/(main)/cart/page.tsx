"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { ProductThumbnailImage } from "@/components/product/catalog-product-photo";
import { useCartStore, cartLineKey } from "@/store/cart-store";
import { useAuth } from "@/context/auth-context";
import { formatInr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageEnter } from "@/components/motion/page-enter";
import { Separator } from "@/components/ui/separator";
import { MOBILE_STICKY_BAR, MOBILE_STICKY_OFFSET } from "@/lib/layout";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { buildProductHref } from "@/lib/product-links";

const cartBenefits = [
  {
    icon: BadgeCheck,
    title: "Quality checked",
    text: "Every piece is reviewed before dispatch.",
  },
  {
    icon: Truck,
    title: "Delivery support",
    text: "Timelines are confirmed by our concierge.",
  },
  {
    icon: LockKeyhole,
    title: "Secure checkout",
    text: "Sign in is requested only at checkout.",
  },
];

export default function CartPage() {
  const storedItems = useCartStore((state) => state.items);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const { user } = useAuth();
  const mounted = useHasMounted();
  const items = mounted ? storedItems : [];

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <PageEnter>
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          <div className="flex flex-col items-center rounded-[2rem] border border-border/60 bg-card/75 px-5 py-14 text-center shadow-[0_24px_70px_rgba(58,48,38,0.08)] sm:px-10 sm:py-20">
            <span className="flex size-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
              <ShoppingBag className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Shopping bag
            </p>
            <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Your bag is empty</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              Explore the wedding edit and premium tailoring to begin your selection.
            </p>
            <Button
              asChild
              className="mt-8 h-11 w-full max-w-xs touch-manipulation rounded-full sm:w-auto sm:px-8"
            >
              <Link href="/shop">
                Discover products
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </PageEnter>
    );
  }

  return (
    <PageEnter>
      <div
        className={`mx-auto w-full min-w-0 max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 ${MOBILE_STICKY_OFFSET}`}
      >
        <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
              Your selection
            </p>
            <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Shopping bag</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {itemCount} {itemCount === 1 ? "item" : "items"} ready for checkout
            </p>
          </div>
          <Button asChild variant="outline" className="h-10 w-fit rounded-full px-5">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>

        <div className="mt-7 grid min-w-0 gap-7 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(310px,390px)] lg:gap-8">
          <div className="min-w-0 space-y-4">
            {items.map((item) => {
              const key = cartLineKey(item);

              return (
                <Card
                  key={key}
                  className="flex min-w-0 flex-row gap-3 border-border/60 bg-card/75 p-3 shadow-[0_16px_45px_rgba(58,48,38,0.06)] sm:gap-5 sm:p-5"
                >
                  <Link
                    href={buildProductHref(item.slug, item.image)}
                    className="relative h-36 w-24 shrink-0 overflow-hidden rounded-2xl bg-white sm:h-44 sm:w-32"
                  >
                    <ProductThumbnailImage
                      src={item.image}
                      alt={item.name}
                      sizes="(max-width:640px) 96px, 128px"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="min-w-0">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                        Mietaaf selection
                      </p>
                      <Link
                        href={buildProductHref(item.slug, item.image)}
                        className="font-heading text-lg leading-snug transition-colors hover:text-primary sm:text-2xl"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground sm:text-sm">
                        <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1">
                          Size {item.size}
                        </span>
                        <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1">
                          {item.color}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
                      <div>
                        <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          Quantity
                        </p>
                        <div className="flex w-fit touch-manipulation items-center rounded-full border border-border bg-background/60">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 shrink-0 rounded-full"
                            onClick={() => updateQty(key, item.quantity - 1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="min-w-8 px-1 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 shrink-0 rounded-full"
                            onClick={() => updateQty(key, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end sm:gap-1">
                        <span className="text-base font-semibold sm:text-lg">
                          {formatInr(item.price * item.quantity)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-9 shrink-0 touch-manipulation rounded-full px-3 text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(key)}
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {cartBenefits.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-border/60 bg-card/45 p-4">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <Card className="space-y-5 border-border/60 bg-card/80 p-5 shadow-[0_22px_60px_rgba(58,48,38,0.08)] sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  Order details
                </p>
                <h2 className="mt-2 font-heading text-2xl">Summary</h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Items ({itemCount})</span>
                  <span>{formatInr(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-right">Confirmed by concierge</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatInr(subtotal)}</span>
              </div>

              {!user ? (
                <div className="flex gap-2 rounded-2xl bg-primary/10 p-3 text-xs leading-5 text-muted-foreground">
                  <LockKeyhole
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  You can shop as a guest. Sign in will be requested at the next checkout step.
                </div>
              ) : null}

              <Button asChild className="h-12 w-full touch-manipulation rounded-full" size="lg">
                <Link href="/checkout">
                  Proceed to checkout
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>

              <p className="text-center text-[11px] leading-5 text-muted-foreground">
                Final availability and delivery timeline are confirmed before your order is placed.
              </p>
            </Card>
          </div>
        </div>

        <div className={MOBILE_STICKY_BAR}>
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-semibold">{formatInr(subtotal)}</p>
            </div>
            <Button asChild className="h-11 shrink-0 touch-manipulation rounded-full px-6">
              <Link href="/checkout">
                Checkout
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageEnter>
  );
}
