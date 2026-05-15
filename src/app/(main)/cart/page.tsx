"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore, cartLineKey } from "@/store/cart-store";
import { formatInr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PageEnter } from "@/components/motion/page-enter";
import { Separator } from "@/components/ui/separator";
import { MOBILE_STICKY_BAR, MOBILE_STICKY_OFFSET } from "@/lib/layout";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <PageEnter>
        <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-12 text-center sm:py-20 md:py-24">
          <p className="font-heading text-2xl sm:text-3xl">Your cart is empty</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Explore the wedding edit or premium suits to begin your selection.
          </p>
          <Button asChild className="mt-8 h-11 w-full max-w-xs touch-manipulation rounded-full sm:w-auto sm:px-8">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </PageEnter>
    );
  }

  return (
    <PageEnter>
      <div className={`mx-auto w-full min-w-0 max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 ${MOBILE_STICKY_OFFSET}`}>
        <h1 className="font-heading text-3xl sm:text-4xl">Shopping bag</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">{items.length} items</p>
        <div className="mt-8 grid min-w-0 gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:gap-10">
          <div className="min-w-0 space-y-4">
            {items.map((item) => {
              const key = cartLineKey(item);
              return (
                <motion.div
                  key={key}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="flex min-w-0 flex-col gap-4 border-border/60 p-4 sm:flex-row sm:gap-5">
                    <div className="relative mx-auto aspect-[4/5] w-full max-w-[220px] shrink-0 overflow-hidden rounded-xl bg-muted sm:mx-0 sm:aspect-auto sm:h-32 sm:w-28 sm:max-w-none">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-heading text-lg leading-snug hover:text-primary sm:text-xl"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.size} · {item.color}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                        <div className="flex touch-manipulation items-center rounded-full border border-border">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 shrink-0 rounded-full"
                            onClick={() => updateQty(key, item.quantity - 1)}
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
                            className="h-11 w-11 shrink-0 rounded-full"
                            onClick={() => updateQty(key, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <span className="font-semibold">
                            {formatInr(item.price * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 shrink-0 text-destructive touch-manipulation"
                            onClick={() => removeItem(key)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <Card className="space-y-4 border-border/60 p-5 sm:p-6">
              <h2 className="font-heading text-xl">Summary</h2>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatInr(subtotal)}</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Coupon
                </p>
                <div className="flex touch-manipulation flex-col gap-2 sm:flex-row sm:items-stretch">
                  <Input
                    placeholder="Code"
                    className="h-11 min-h-11 min-w-0 flex-1 rounded-full"
                    disabled
                  />
                  <Button
                    variant="outline"
                    className="h-11 shrink-0 rounded-full sm:px-6"
                    disabled
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Coupons can be confirmed on WhatsApp with the concierge.
                </p>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatInr(subtotal)}</span>
              </div>
              <Button asChild className="h-11 w-full touch-manipulation rounded-full" size="lg">
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
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
              <Link href="/checkout">Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageEnter>
  );
}
