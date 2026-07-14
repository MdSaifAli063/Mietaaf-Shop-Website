"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { updateProfile as updateFirebaseProfile } from "firebase/auth";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Check,
  CircleHelp,
  Clock3,
  Heart,
  HelpCircle,
  LogOut,
  Mail,
  MapPin,
  Moon,
  PackageCheck,
  Phone,
  RotateCcw,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getFirebaseDb } from "@/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageEnter } from "@/components/motion/page-enter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatInr } from "@/lib/format";
import {
  SITE_EMAIL_DISPLAY,
  SITE_PHONE_DISPLAY,
  SITE_WHATSAPP_E164_DIGITS,
} from "@/lib/site-contact";
import { cn } from "@/lib/utils";
import type { OrderLine } from "@/types";

const profileSchema = z.object({
  displayName: z.string().trim().min(2, "Enter at least 2 characters."),
  phone: z
    .string()
    .trim()
    .refine((value) => !value || /^[+\d][\d\s()-]{7,17}$/.test(value), "Enter a valid phone number."),
  address: z.string().trim(),
  city: z.string().trim(),
  state: z.string().trim(),
  pincode: z
    .string()
    .trim()
    .refine((value) => !value || /^\d{6}$/.test(value), "Enter a 6-digit pincode."),
});

type ProfileForm = z.infer<typeof profileSchema>;
type AccountSection = "profile" | "orders" | "settings" | "help";
type AccountOrder = {
  id: string;
  items: OrderLine[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "cancelled";
  createdAt: Date | null;
};

const sectionItems = [
  { id: "profile" as const, label: "Personal details", icon: UserRound },
  { id: "orders" as const, label: "My orders", icon: PackageCheck },
  { id: "settings" as const, label: "Settings", icon: Settings },
  { id: "help" as const, label: "Help center", icon: CircleHelp },
];

const supportQuestions = [
  {
    question: "How can I track an order?",
    answer:
      "Open My orders to see the latest status. Because orders are confirmed personally on WhatsApp, you can also message our concierge for a live delivery update.",
  },
  {
    question: "Can I change my size after ordering?",
    answer:
      "Contact us as soon as possible. If tailoring or dispatch has not started, the team can update your requested size or fitting notes.",
  },
  {
    question: "How do returns and alterations work?",
    answer:
      "Eligibility depends on the garment and whether it was tailored. Read the returns page or contact the concierge with your order details before sending anything back.",
  },
];

function getOrderDate(value: unknown): Date | null {
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (value && typeof value === "object" && "toDate" in value) {
    const toDate = (value as { toDate?: unknown }).toDate;
    if (typeof toDate === "function") return toDate.call(value) as Date;
  }
  return null;
}

function statusClass(status: AccountOrder["status"]): string {
  if (status === "confirmed") return "border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (status === "shipped") return "border-sky-600/25 bg-sky-500/10 text-sky-700 dark:text-sky-300";
  if (status === "cancelled") return "border-red-600/25 bg-red-500/10 text-red-700 dark:text-red-300";
  return "border-amber-600/25 bg-amber-500/10 text-amber-700 dark:text-amber-300";
}

export default function ProfilePage() {
  const { user, profile, loading, firebaseReady, refreshProfile, resetPassword, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const cartCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const wishCount = useWishlistStore((state) => state.ids.length);
  const [activeSection, setActiveSection] = useState<AccountSection>("profile");
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [themeMounted, setThemeMounted] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  useEffect(() => setThemeMounted(true), []);

  useEffect(() => {
    const syncSection = () => {
      const hash = window.location.hash.slice(1);
      if (sectionItems.some((item) => item.id === hash)) setActiveSection(hash as AccountSection);
    };
    syncSection();
    window.addEventListener("hashchange", syncSection);
    return () => window.removeEventListener("hashchange", syncSection);
  }, []);

  useEffect(() => {
    if (!profile) return;
    form.reset({
      displayName: profile.displayName ?? "",
      phone: profile.phone ?? "",
      address: profile.address ?? "",
      city: profile.city ?? "",
      state: profile.state ?? "",
      pincode: profile.pincode ?? "",
    });
  }, [profile, form]);

  useEffect(() => {
    let cancelled = false;
    async function loadOrders() {
      const db = getFirebaseDb();
      if (!user || !db) {
        if (!cancelled) {
          setOrders([]);
          setOrdersLoading(false);
        }
        return;
      }
      setOrdersLoading(true);
      try {
        const snapshot = await getDocs(query(collection(db, "orders"), where("userId", "==", user.uid)));
        const nextOrders = snapshot.docs
          .map((orderDoc): AccountOrder => {
            const data = orderDoc.data();
            const status = ["pending", "confirmed", "shipped", "cancelled"].includes(data.status)
              ? (data.status as AccountOrder["status"])
              : "pending";
            return {
              id: orderDoc.id,
              items: Array.isArray(data.items) ? (data.items as OrderLine[]) : [],
              total: typeof data.total === "number" ? data.total : 0,
              status,
              createdAt: getOrderDate(data.createdAt),
            };
          })
          .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
        if (!cancelled) setOrders(nextOrders);
      } catch {
        if (!cancelled) {
          setOrders([]);
          toast.error("Could not load order history.");
        }
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    }
    void loadOrders();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const profileCompletion = useMemo(() => {
    const values = [
      profile?.displayName,
      user?.email,
      profile?.phone,
      profile?.address,
      profile?.city,
      profile?.state,
      profile?.pincode,
    ];
    return Math.round((values.filter(Boolean).length / values.length) * 100);
  }, [profile, user]);

  function selectSection(section: AccountSection) {
    setActiveSection(section);
    window.history.replaceState(null, "", `${window.location.pathname}#${section}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(data: ProfileForm) {
    const db = getFirebaseDb();
    if (!user || !db) {
      toast.error("Sign in and configure Firebase to save your profile.");
      return;
    }
    try {
      await Promise.all([
        setDoc(
          doc(db, "users", user.uid),
          {
            displayName: data.displayName,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
          },
          { merge: true },
        ),
        updateFirebaseProfile(user, { displayName: data.displayName }),
      ]);
      await refreshProfile();
      toast.success("Profile details saved.");
    } catch {
      toast.error("Could not save your profile. Please try again.");
    }
  }

  async function sendResetLink() {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      toast.success("Password reset link sent to your email.");
    } catch {
      toast.error("Could not send the reset link.");
    }
  }

  if (!firebaseReady) {
    return (
      <PageEnter>
        <div className="mx-auto max-w-lg px-4 py-20 text-center text-muted-foreground">
          Add Firebase environment variables to enable authentication and profile sync.
        </div>
      </PageEnter>
    );
  }

  if (!loading && !user) {
    return (
      <PageEnter>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <p className="font-heading text-2xl">Sign in to view your account</p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/login">Go to login</Link>
          </Button>
        </div>
      </PageEnter>
    );
  }

  return (
    <PageEnter>
      <div className="min-h-screen bg-[#fbf8f2] py-8 dark:bg-[#181613] sm:py-10 lg:py-12">
        <div className="page-container mx-auto min-w-0 max-w-7xl">
          <section className="overflow-hidden rounded-[2rem] border border-border/60 bg-[#eee4d6] p-6 shadow-[0_22px_60px_rgba(53,39,22,0.08)] dark:bg-[#201d19] sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                <Avatar className="size-16 border-2 border-background shadow-sm sm:size-20">
                  <AvatarImage src={user?.photoURL ?? profile?.photoURL ?? undefined} alt="" />
                  <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                    {(profile?.displayName ?? user?.email ?? "?").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Mietaaf account</p>
                  <h1 className="mt-1 truncate font-heading text-3xl sm:text-4xl">
                    {profile?.displayName || user?.displayName || "Welcome back"}
                  </h1>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="w-full rounded-2xl border border-border/50 bg-background/55 p-4 sm:w-64">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Profile complete</span>
                  <span className="text-primary">{profileCompletion}%</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border/60">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${profileCompletion}%` }} />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Complete your details for faster checkout and fittings.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
            <aside className="min-w-0 lg:sticky lg:top-28">
              <Card className="overflow-hidden rounded-[1.5rem] border-border/60 bg-card/90 p-2 shadow-sm">
                <nav aria-label="Account" className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain p-1 pb-2 lg:flex-col lg:overflow-visible lg:pb-1">
                  {sectionItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectSection(item.id)}
                        className={cn(
                          "flex h-11 shrink-0 snap-start items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-colors lg:w-full",
                          activeSection === item.id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                        )}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                        {item.label}
                        {item.id === "orders" && orders.length > 0 ? (
                          <span className="ml-auto rounded-full bg-background/20 px-2 py-0.5 text-[10px]">{orders.length}</span>
                        ) : null}
                      </button>
                    );
                  })}
                  <div className="hidden border-t border-border/60 lg:my-1 lg:block" />
                  <Link
                    href="/wishlist"
                    className="flex h-11 shrink-0 snap-start items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground lg:w-full"
                  >
                    <Heart className="size-4" aria-hidden="true" />
                    Wishlist
                    {wishCount > 0 ? <span className="ml-auto text-xs">{wishCount}</span> : null}
                  </Link>
                  <Link
                    href="/cart"
                    className="flex h-11 shrink-0 snap-start items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground lg:w-full"
                  >
                    <ShoppingBag className="size-4" aria-hidden="true" />
                    Shopping bag
                    {cartCount > 0 ? <span className="ml-auto text-xs">{cartCount}</span> : null}
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      toast.success("You have been signed out.");
                    }}
                    className="flex h-11 shrink-0 snap-start items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground lg:w-full"
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    Sign out
                  </button>
                </nav>
              </Card>
            </aside>

            <main className="min-w-0">
              {activeSection === "profile" ? (
                <div className="space-y-6">
                  <Card className="rounded-[1.5rem] border-border/60 bg-card/90 p-5 shadow-sm sm:p-7 lg:p-8">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Profile</p>
                        <h2 className="mt-1 font-heading text-2xl sm:text-3xl">Personal details</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">Used for orders, delivery and appointments.</p>
                    </div>
                    <form className="mt-7 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="displayName">Full name</Label>
                          <Input id="displayName" autoComplete="name" {...form.register("displayName")} className="h-12 rounded-xl" />
                          {form.formState.errors.displayName ? (
                            <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>
                          ) : null}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email address</Label>
                          <Input id="email" value={user?.email ?? ""} readOnly className="h-12 rounded-xl bg-muted/40" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="phone">Phone number</Label>
                          <Input id="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" {...form.register("phone")} className="h-12 rounded-xl" />
                          {form.formState.errors.phone ? (
                            <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                          ) : null}
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="address">Street address</Label>
                          <Input id="address" autoComplete="street-address" {...form.register("address")} className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" autoComplete="address-level2" {...form.register("city")} className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" autoComplete="address-level1" {...form.register("state")} className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2 sm:max-w-xs">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input id="pincode" inputMode="numeric" autoComplete="postal-code" {...form.register("pincode")} className="h-12 rounded-xl" />
                          {form.formState.errors.pincode ? (
                            <p className="text-xs text-destructive">{form.formState.errors.pincode.message}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center">
                        <Button type="submit" className="h-11 rounded-full px-7" disabled={form.formState.isSubmitting}>
                          {form.formState.isSubmitting ? "Saving…" : "Save changes"}
                        </Button>
                        {form.formState.isDirty ? <p className="text-xs text-muted-foreground">You have unsaved changes.</p> : null}
                      </div>
                    </form>
                  </Card>

                  <Card className="rounded-[1.5rem] border-border/60 bg-[#eee4d6] p-5 dark:bg-[#201d19] sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 size-5 text-primary" aria-hidden="true" />
                        <div>
                          <h3 className="font-medium">Account security</h3>
                          <p className="mt-1 text-sm text-muted-foreground">Send a secure password reset link to {user?.email}.</p>
                        </div>
                      </div>
                      <Button type="button" variant="outline" className="rounded-full" onClick={sendResetLink}>
                        <RotateCcw className="size-4" aria-hidden="true" />
                        Reset password
                      </Button>
                    </div>
                  </Card>
                </div>
              ) : null}

              {activeSection === "orders" ? (
                <Card className="rounded-[1.5rem] border-border/60 bg-card/90 p-5 shadow-sm sm:p-7 lg:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Purchases</p>
                  <h2 className="mt-1 font-heading text-2xl sm:text-3xl">My orders</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Orders placed through checkout and confirmed with our concierge.</p>

                  {ordersLoading ? (
                    <div className="mt-8 space-y-3">
                      {[0, 1].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl bg-muted/60" />)}
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="mt-7 space-y-4">
                      {orders.map((order) => (
                        <article key={order.id} className="rounded-2xl border border-border/60 bg-background/55 p-4 sm:p-5">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                              <p className="mt-1 text-sm font-medium">
                                {order.createdAt
                                  ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(order.createdAt)
                                  : "Recently placed"}
                              </p>
                            </div>
                            <Badge variant="outline" className={cn("w-fit capitalize", statusClass(order.status))}>{order.status}</Badge>
                          </div>
                          <div className="mt-4 border-t border-border/50 pt-4">
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={`${item.name}-${index}`} className="flex items-start justify-between gap-4 text-sm">
                                  <span className="text-muted-foreground">{item.name} · {item.size} · Qty {item.quantity}</span>
                                  <span className="shrink-0 font-medium">{formatInr(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 font-medium">
                              <span>Total</span>
                              <span>{formatInr(order.total)}</span>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/20 px-5 py-12 text-center">
                      <ShoppingBag className="mx-auto size-7 text-primary" aria-hidden="true" />
                      <h3 className="mt-4 font-heading text-xl">No orders yet</h3>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                        When you place an order through checkout, its status and details will appear here.
                      </p>
                      <Button asChild className="mt-5 rounded-full">
                        <Link href="/shop">Explore the collection</Link>
                      </Button>
                    </div>
                  )}
                </Card>
              ) : null}

              {activeSection === "settings" ? (
                <Card className="rounded-[1.5rem] border-border/60 bg-card/90 p-5 shadow-sm sm:p-7 lg:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Settings</p>
                  <h2 className="mt-1 font-heading text-2xl sm:text-3xl">Website appearance</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Choose how Mietaaf looks on this device. Your selection is saved automatically.
                  </p>
                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    {[
                      { value: "light", label: "Light mode", description: "Warm ivory and cream", icon: Sun },
                      { value: "dark", label: "Dark mode", description: "Deep charcoal and bronze", icon: Moon },
                    ].map((option) => {
                      const Icon = option.icon;
                      const selected = themeMounted && resolvedTheme === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setTheme(option.value)}
                          className={cn(
                            "group relative flex min-h-36 flex-col items-start rounded-2xl border p-5 text-left transition-all",
                            selected
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border/70 bg-background/50 hover:border-primary/50 hover:bg-muted/30",
                          )}
                          aria-pressed={selected}
                        >
                          <span className="flex size-10 items-center justify-center rounded-full bg-[#eee4d6] text-primary dark:bg-[#2c2822]">
                            <Icon className="size-5" aria-hidden="true" />
                          </span>
                          <span className="mt-5 font-medium">{option.label}</span>
                          <span className="mt-1 text-sm text-muted-foreground">{option.description}</span>
                          {selected ? (
                            <span className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Check className="size-3.5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#eee4d6] p-4 dark:bg-[#201d19]">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Appearance is now managed here only, keeping the store header cleaner and easier to use.
                    </p>
                  </div>
                </Card>
              ) : null}

              {activeSection === "help" ? (
                <div className="space-y-6">
                  <Card className="rounded-[1.5rem] border-border/60 bg-card/90 p-5 shadow-sm sm:p-7 lg:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Support</p>
                    <h2 className="mt-1 font-heading text-2xl sm:text-3xl">How can we help?</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Choose the quickest way to reach the Mietaaf concierge.</p>
                    <div className="mt-7 grid gap-3 sm:grid-cols-3">
                      <a href={`https://wa.me/${SITE_WHATSAPP_E164_DIGITS}`} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-border/60 bg-background/50 p-4 transition-colors hover:border-primary/50 hover:bg-muted/30">
                        <Phone className="size-5 text-primary" aria-hidden="true" />
                        <p className="mt-4 font-medium">WhatsApp us</p>
                        <p className="mt-1 text-xs text-muted-foreground">Fast order and fitting help</p>
                      </a>
                      <a href={`mailto:${SITE_EMAIL_DISPLAY}`} className="group rounded-2xl border border-border/60 bg-background/50 p-4 transition-colors hover:border-primary/50 hover:bg-muted/30">
                        <Mail className="size-5 text-primary" aria-hidden="true" />
                        <p className="mt-4 font-medium">Email concierge</p>
                        <p className="mt-1 break-all text-xs text-muted-foreground">{SITE_EMAIL_DISPLAY}</p>
                      </a>
                      <a href={`tel:${SITE_PHONE_DISPLAY.replace(/\s/g, "")}`} className="group rounded-2xl border border-border/60 bg-background/50 p-4 transition-colors hover:border-primary/50 hover:bg-muted/30">
                        <Clock3 className="size-5 text-primary" aria-hidden="true" />
                        <p className="mt-4 font-medium">Call the studio</p>
                        <p className="mt-1 text-xs text-muted-foreground">Tue–Sun · 10:00–19:00</p>
                      </a>
                    </div>
                  </Card>

                  <Card className="rounded-[1.5rem] border-border/60 bg-[#eee4d6] p-5 dark:bg-[#201d19] sm:p-7 lg:p-8">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="size-5 text-primary" aria-hidden="true" />
                      <h3 className="font-heading text-xl sm:text-2xl">Common questions</h3>
                    </div>
                    <Accordion className="mt-5 rounded-2xl border border-border/60 bg-background/45 px-4 sm:px-5">
                      {supportQuestions.map((item) => (
                        <AccordionItem key={item.question} value={item.question}>
                          <AccordionTrigger className="py-4 hover:no-underline">{item.question}</AccordionTrigger>
                          <AccordionContent className="pb-4 leading-relaxed text-muted-foreground">{item.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button asChild variant="outline" className="rounded-full">
                        <Link href="/faq">View all FAQs <ArrowRight className="size-4" aria-hidden="true" /></Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-full">
                        <Link href="/returns">Returns policy <ArrowRight className="size-4" aria-hidden="true" /></Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-full">
                        <Link href="/contact"><MapPin className="size-4" aria-hidden="true" /> Visit contact page</Link>
                      </Button>
                    </div>
                  </Card>
                </div>
              ) : null}
            </main>
          </div>
        </div>
      </div>
    </PageEnter>
  );
}
