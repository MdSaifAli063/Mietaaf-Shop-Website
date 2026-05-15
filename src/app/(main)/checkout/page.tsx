"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useCartStore } from "@/store/cart-store";
import { checkoutSchema, type CheckoutSchema } from "@/lib/validations/checkout";
import { buildCheckoutWhatsAppUrl } from "@/lib/order-whatsapp";
import { getFirebaseDb } from "@/firebase/client";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageEnter } from "@/components/motion/page-enter";
import { formatInr } from "@/lib/format";
import { SITE_WHATSAPP_E164_DIGITS } from "@/lib/site-contact";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const { user } = useAuth();
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);

  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      notes: "",
    },
  });

  async function onSubmit(data: CheckoutSchema) {
    const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? SITE_WHATSAPP_E164_DIGITS;
    const url = buildCheckoutWhatsAppUrl(
      {
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        notes: data.notes,
        items,
        total: subtotal,
      },
      wa,
    );

    const db = getFirebaseDb();
    if (db) {
      try {
        await addDoc(collection(db, "orders"), {
          userId: user?.uid ?? "guest",
          customerName: data.fullName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          notes: data.notes ?? "",
          items: items.map((i) => ({
            name: i.name,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
            price: i.price,
          })),
          total: subtotal,
          status: "pending",
          createdAt: serverTimestamp(),
        });
      } catch {
        toast.error("Could not sync order to cloud — WhatsApp will still open.");
      }
    }

    clear();
    window.location.href = url;
  }

  if (items.length === 0) {
    return (
      <PageEnter>
        <div className="mx-auto w-full max-w-lg px-4 py-12 text-center sm:py-20 md:py-24">
          <p className="font-heading text-xl sm:text-2xl">Nothing to checkout</p>
          <Button asChild className="mt-6 h-11 w-full max-w-xs touch-manipulation rounded-full sm:w-auto">
            <Link href="/shop">Browse collections</Link>
          </Button>
        </div>
      </PageEnter>
    );
  }

  return (
    <PageEnter>
      <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <h1 className="font-heading text-3xl sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Orders are confirmed via WhatsApp — no card payment on site.
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-8 grid min-w-0 gap-8 touch-manipulation sm:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:gap-10"
        >
          <Card className="min-w-0 space-y-6 border-border/60 p-5 sm:p-6 md:p-8">
            <h2 className="font-heading text-xl">Delivery details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" autoComplete="name" {...form.register("fullName")} className="h-11 min-h-11 rounded-xl" />
                {form.formState.errors.fullName ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.fullName.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" autoComplete="tel" {...form.register("phone")} className="h-11 min-h-11 rounded-xl" />
                {form.formState.errors.phone ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.phone.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" autoComplete="street-address" {...form.register("address")} className="h-11 min-h-11 rounded-xl" />
                {form.formState.errors.address ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.address.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" autoComplete="address-level2" {...form.register("city")} className="h-11 min-h-11 rounded-xl" />
                {form.formState.errors.city ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.city.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" autoComplete="address-level1" {...form.register("state")} className="h-11 min-h-11 rounded-xl" />
                {form.formState.errors.state ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.state.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" inputMode="numeric" autoComplete="postal-code" {...form.register("pincode")} className="h-11 min-h-11 rounded-xl" />
                {form.formState.errors.pincode ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.pincode.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Delivery notes (optional)</Label>
                <Textarea id="notes" rows={3} {...form.register("notes")} className="min-h-[5.5rem] rounded-xl" />
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full touch-manipulation rounded-full sm:h-11 sm:w-auto"
              disabled={form.formState.isSubmitting}
            >
              Place order via WhatsApp
            </Button>
          </Card>
          <Card className="h-fit min-w-0 space-y-4 border-border/60 p-5 sm:p-6 lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-heading text-xl">Order summary</h2>
            <div className="max-h-[min(18rem,45dvh)] space-y-3 overflow-y-auto overscroll-contain pr-1">
              {items.map((i) => (
                <div key={`${i.productId}-${i.size}-${i.color}`} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={i.image} alt="" fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="truncate font-medium">{i.name}</p>
                    <p className="text-muted-foreground">
                      {i.size} · {i.color} × {i.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{formatInr(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatInr(subtotal)}</span>
            </div>
          </Card>
        </form>
      </div>
    </PageEnter>
  );
}
