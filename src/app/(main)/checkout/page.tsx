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
    const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";
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
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <p className="font-heading text-2xl">Nothing to checkout</p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/shop">Browse collections</Link>
          </Button>
        </div>
      </PageEnter>
    );
  }

  return (
    <PageEnter>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Orders are confirmed via WhatsApp — no card payment on site.
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]"
        >
          <Card className="space-y-6 border-border/60 p-6 md:p-8">
            <h2 className="font-heading text-xl">Delivery details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" {...form.register("fullName")} className="rounded-xl" />
                {form.formState.errors.fullName ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.fullName.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...form.register("phone")} className="rounded-xl" />
                {form.formState.errors.phone ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.phone.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...form.register("address")} className="rounded-xl" />
                {form.formState.errors.address ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.address.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...form.register("city")} className="rounded-xl" />
                {form.formState.errors.city ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.city.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...form.register("state")} className="rounded-xl" />
                {form.formState.errors.state ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.state.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" {...form.register("pincode")} className="rounded-xl" />
                {form.formState.errors.pincode ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.pincode.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Delivery notes (optional)</Label>
                <Textarea id="notes" rows={3} {...form.register("notes")} className="rounded-xl" />
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full sm:w-auto"
              disabled={form.formState.isSubmitting}
            >
              Place order via WhatsApp
            </Button>
          </Card>
          <Card className="h-fit space-y-4 border-border/60 p-6">
            <h2 className="font-heading text-xl">Order summary</h2>
            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
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
