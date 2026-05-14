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

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <PageEnter>
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
          <p className="font-heading text-3xl">Your cart is empty</p>
          <p className="mt-3 text-muted-foreground">
            Explore the wedding edit or premium suits to begin your selection.
          </p>
          <Button asChild className="mt-8 rounded-full px-8">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </PageEnter>
    );
  }

  return (
    <PageEnter>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl">Shopping bag</h1>
        <p className="mt-2 text-muted-foreground">{items.length} items</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => {
              const key = cartLineKey(item);
              return (
                <motion.div
                  key={key}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="flex flex-col gap-4 border-border/60 p-4 sm:flex-row">
                    <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-28">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-heading text-lg hover:text-primary"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.size} · {item.color}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center rounded-full border border-border">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => updateQty(key, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => updateQty(key, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            {formatInr(item.price * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
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
          <div>
            <Card className="sticky top-24 space-y-4 border-border/60 p-6">
              <h2 className="font-heading text-xl">Summary</h2>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatInr(subtotal)}</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Coupon
                </p>
                <div className="flex gap-2">
                  <Input placeholder="Code" className="rounded-full" disabled />
                  <Button variant="outline" className="rounded-full" disabled>
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
              <Button asChild className="w-full rounded-full" size="lg">
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </PageEnter>
  );
}
