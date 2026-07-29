"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MailCheck,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  Truck,
  Trash2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth-context";
import { getFirebaseDb } from "@/firebase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageEnter } from "@/components/motion/page-enter";
import { formatInr } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  isOrderConfirmationEmailConfigured,
  sendOrderConfirmationEmail,
} from "@/services/order-confirmation-email";
import type { Order, OrderLine } from "@/types";
import { useSiteSettings } from "@/hooks/use-site-settings";

type OrderStatus = Order["status"];
type ConfirmationEmailStatus = "sending" | "sent" | "failed" | null;

type AdminOrder = {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
  items: OrderLine[];
  total: number;
  status: OrderStatus;
  confirmationEmailStatus: ConfirmationEmailStatus;
  createdAt: Date | null;
};

const VALID_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "cancelled",
];

function readDate(value: unknown): Date | null {
  if (value && typeof value === "object" && "toDate" in value) {
    const toDate = (value as { toDate?: unknown }).toDate;
    if (typeof toDate === "function") return toDate.call(value) as Date;
  }
  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function orderFromSnapshot(
  id: string,
  data: Record<string, unknown>,
): AdminOrder {
  const status = VALID_STATUSES.includes(data.status as OrderStatus)
    ? (data.status as OrderStatus)
    : "pending";
  const emailStatus = ["sending", "sent", "failed"].includes(
    String(data.confirmationEmailStatus),
  )
    ? (data.confirmationEmailStatus as Exclude<
        ConfirmationEmailStatus,
        null
      >)
    : null;

  return {
    id,
    userId: typeof data.userId === "string" ? data.userId : "",
    customerName:
      typeof data.customerName === "string" ? data.customerName : "Customer",
    customerEmail:
      typeof data.customerEmail === "string" ? data.customerEmail : "",
    phone: typeof data.phone === "string" ? data.phone : "",
    address: typeof data.address === "string" ? data.address : "",
    city: typeof data.city === "string" ? data.city : "",
    state: typeof data.state === "string" ? data.state : "",
    pincode: typeof data.pincode === "string" ? data.pincode : "",
    notes: typeof data.notes === "string" ? data.notes : "",
    items: Array.isArray(data.items) ? (data.items as OrderLine[]) : [],
    total: typeof data.total === "number" ? data.total : 0,
    status,
    confirmationEmailStatus: emailStatus,
    createdAt: readDate(data.createdAt),
  };
}

function statusClass(status: OrderStatus): string {
  if (status === "confirmed") {
    return "border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }
  if (status === "shipped") {
    return "border-sky-600/25 bg-sky-500/10 text-sky-700 dark:text-sky-300";
  }
  if (status === "cancelled") {
    return "border-red-600/25 bg-red-500/10 text-red-700 dark:text-red-300";
  }
  return "border-amber-600/25 bg-amber-500/10 text-amber-700 dark:text-amber-300";
}

export default function AdminOrdersPage() {
  const {
    user,
    isAdmin,
    loading,
    firebaseReady,
    refreshProfile,
  } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("pending");
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const emailConfigured = isOrderConfirmationEmailConfigured();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db || !user || !isAdmin) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    setOrdersLoading(true);
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(
      ordersQuery,
      (snapshot) => {
        setOrders(
          snapshot.docs.map((orderDoc) =>
            orderFromSnapshot(orderDoc.id, orderDoc.data()),
          ),
        );
        setOrdersLoading(false);
      },
      () => {
        setOrders([]);
        setOrdersLoading(false);
        toast.error("Could not load orders. Check the admin claim and rules.");
      },
    );
  }, [isAdmin, user]);

  const filteredOrders = useMemo(
    () =>
      filter === "all"
        ? orders
        : orders.filter((order) => order.status === filter),
    [filter, orders],
  );

  const pendingCount = orders.filter(
    (order) => order.status === "pending",
  ).length;
  const confirmedCount = orders.filter(
    (order) => order.status === "confirmed",
  ).length;

  async function resolveCustomerEmail(order: AdminOrder): Promise<string> {
    if (order.customerEmail) return order.customerEmail;
    const db = getFirebaseDb();
    if (!db || !order.userId) return "";
    const profileSnapshot = await getDoc(doc(db, "users", order.userId));
    const profileEmail = profileSnapshot.data()?.email;
    return typeof profileEmail === "string" ? profileEmail : "";
  }

  async function emailCustomer(
    order: AdminOrder,
    customerEmail: string,
  ): Promise<void> {
    const db = getFirebaseDb();
    if (!db) throw new Error("Firebase is not configured.");
    const orderRef = doc(db, "orders", order.id);

    await updateDoc(orderRef, {
      confirmationEmailStatus: "sending",
      updatedAt: serverTimestamp(),
    });

    try {
      await sendOrderConfirmationEmail({
        id: order.id,
        customerName: order.customerName,
        customerEmail,
        createdAt: order.createdAt,
        items: order.items,
        total: order.total,
        supportEmail: settings.supportEmail,
        supportPhone: settings.phoneDisplay,
        whatsappNumber: settings.whatsappNumber,
      });
      await updateDoc(orderRef, {
        confirmationEmailStatus: "sent",
        confirmationEmailSentAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      await updateDoc(orderRef, {
        confirmationEmailStatus: "failed",
        updatedAt: serverTimestamp(),
      }).catch(() => undefined);
      throw error;
    }
  }

  async function confirmOrder(order: AdminOrder) {
    if (!emailConfigured) {
      toast.error(
        "Add the EmailJS order-confirmation template ID before confirming.",
      );
      return;
    }
    const db = getFirebaseDb();
    if (!db || !user) return;

    setBusyOrderId(order.id);
    try {
      const customerEmail = await resolveCustomerEmail(order);
      if (!customerEmail) {
        toast.error("This order has no customer email. Add one before confirming.");
        return;
      }

      await updateDoc(doc(db, "orders", order.id), {
        customerEmail,
        status: "confirmed",
        confirmedAt: serverTimestamp(),
        confirmedBy: user.uid,
        confirmationEmailStatus: "sending",
        updatedAt: serverTimestamp(),
      });

      try {
        await emailCustomer(order, customerEmail);
        toast.success("Order confirmed and email sent to the customer.");
      } catch {
        toast.error(
          "Order is confirmed, but the email failed. Use Resend email.",
        );
      }
    } catch {
      toast.error("Could not confirm this order. Please try again.");
    } finally {
      setBusyOrderId(null);
    }
  }

  async function resendEmail(order: AdminOrder) {
    if (!emailConfigured) {
      toast.error("Order confirmation email is not configured.");
      return;
    }
    setBusyOrderId(order.id);
    try {
      const customerEmail = await resolveCustomerEmail(order);
      if (!customerEmail) {
        toast.error("No customer email is available for this order.");
        return;
      }
      await emailCustomer(order, customerEmail);
      toast.success("Confirmation email sent again.");
    } catch {
      toast.error("Could not send the confirmation email.");
    } finally {
      setBusyOrderId(null);
    }
  }

  async function changeStatus(order: AdminOrder, status: OrderStatus) {
    const db = getFirebaseDb();
    if (!db || !user) return;
    setBusyOrderId(order.id);
    try {
      await updateDoc(doc(db, "orders", order.id), {
        status,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
        ...(status === "shipped" ? { shippedAt: serverTimestamp() } : {}),
        ...(status === "cancelled" ? { cancelledAt: serverTimestamp() } : {}),
      });
      toast.success(`Order marked ${status}.`);
    } catch {
      toast.error("Could not update the order status.");
    } finally {
      setBusyOrderId(null);
    }
  }

  async function removeOrder(order: AdminOrder) {
    if (!window.confirm(`Permanently delete order #${order.id.toUpperCase()}? This cannot be undone.`)) return;
    const db = getFirebaseDb();
    if (!db) return;
    setBusyOrderId(order.id);
    try {
      await deleteDoc(doc(db, "orders", order.id));
      toast.success("Order record deleted.");
    } catch {
      toast.error("Could not delete the order.");
    } finally {
      setBusyOrderId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <LoaderCircle className="size-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!firebaseReady) {
    return (
      <div className="page-container py-16">
        <Card className="mx-auto max-w-xl p-7 text-center">
          <ShieldCheck className="mx-auto size-8 text-primary" />
          <h1 className="mt-4 font-heading text-2xl">Firebase is required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure Firebase before managing customer orders.
          </p>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container py-16">
        <Card className="mx-auto max-w-xl p-7 text-center">
          <ShieldCheck className="mx-auto size-8 text-primary" />
          <h1 className="mt-4 font-heading text-2xl">Admin sign-in required</h1>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/login?returnUrl=%2Fadmin%2Forders">Sign in</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="page-container py-16">
        <Card className="mx-auto max-w-xl p-7 text-center">
          <ShieldCheck className="mx-auto size-8 text-primary" />
          <h1 className="mt-4 font-heading text-2xl">Admin access required</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This account does not have the secure Firebase admin claim.
          </p>
          <Button
            className="mt-6 rounded-full"
            variant="outline"
            onClick={() => void refreshProfile()}
          >
            <RefreshCcw className="size-4" />
            Refresh access
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <PageEnter>
      <div className="min-h-screen bg-[#fbf8f2] dark:bg-[#181613]">
        <div className="page-container py-8 sm:py-12">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                Administration
              </p>
              <h1 className="mt-2 font-heading text-3xl sm:text-4xl">
                Customer orders
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Confirm WhatsApp orders, notify customers by email, and keep
                account status synchronized.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="min-w-28 px-4 py-3">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="mt-1 text-xl font-semibold">{pendingCount}</p>
              </Card>
              <Card className="min-w-28 px-4 py-3">
                <p className="text-xs text-muted-foreground">Confirmed</p>
                <p className="mt-1 text-xl font-semibold">{confirmedCount}</p>
              </Card>
            </div>
          </header>

          {!emailConfigured ? (
            <div className="mt-7 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
              Add{" "}
              <code>NEXT_PUBLIC_EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID</code>{" "}
              before using Confirm &amp; email.
            </div>
          ) : null}

          <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
            {(["pending", "confirmed", "shipped", "cancelled", "all"] as const).map(
              (status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={filter === status ? "default" : "outline"}
                  className="shrink-0 rounded-full capitalize"
                  onClick={() => setFilter(status)}
                >
                  {status}
                </Button>
              ),
            )}
          </div>

          {ordersLoading ? (
            <div className="mt-7 grid gap-4">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-52 animate-pulse rounded-[1.5rem] bg-muted/60"
                />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <Card className="mt-7 rounded-[1.5rem] p-10 text-center">
              <PackageCheck className="mx-auto size-8 text-primary" />
              <h2 className="mt-4 font-heading text-xl">No {filter} orders</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                New WhatsApp checkout orders will appear here automatically.
              </p>
            </Card>
          ) : (
            <div className="mt-7 grid gap-5">
              {filteredOrders.map((order) => {
                const busy = busyOrderId === order.id;
                return (
                  <Card
                    key={order.id}
                    className="overflow-hidden rounded-[1.5rem] border-border/60 bg-card/90 p-0"
                  >
                    <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              Order #{order.id.toUpperCase()}
                            </p>
                            <h2 className="mt-2 font-heading text-xl">
                              {order.customerName}
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {order.createdAt
                                ? new Intl.DateTimeFormat("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  }).format(order.createdAt)
                                : "Recently placed"}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "capitalize",
                                statusClass(order.status),
                              )}
                            >
                              {order.status === "pending" ? (
                                <Clock3 className="size-3" />
                              ) : order.status === "confirmed" ? (
                                <CheckCircle2 className="size-3" />
                              ) : order.status === "shipped" ? (
                                <Truck className="size-3" />
                              ) : (
                                <XCircle className="size-3" />
                              )}
                              {order.status}
                            </Badge>
                            {order.confirmationEmailStatus ? (
                              <Badge variant="outline" className="capitalize">
                                <MailCheck className="size-3" />
                                Email {order.confirmationEmailStatus}
                              </Badge>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-5 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                          <p>{order.customerEmail || "Email linked to account"}</p>
                          <p>{order.phone}</p>
                          <p className="sm:col-span-2">
                            {[order.address, order.city, order.state, order.pincode]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>

                        <div className="mt-5 space-y-2 border-t border-border/50 pt-4">
                          {order.items.map((item, index) => (
                            <div
                              key={`${item.name}-${index}`}
                              className="flex items-start justify-between gap-4 text-sm"
                            >
                              <span className="text-muted-foreground">
                                {item.name} · {item.size} · {item.color} · Qty{" "}
                                {item.quantity}
                              </span>
                              <span className="shrink-0 font-medium">
                                {formatInr(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                          <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3 font-semibold">
                            <span>Total</span>
                            <span>{formatInr(order.total)}</span>
                          </div>
                        </div>
                        {order.notes ? (
                          <p className="mt-4 rounded-xl bg-muted/45 px-3 py-2 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                              Note:
                            </span>{" "}
                            {order.notes}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-col justify-center gap-3 border-t border-border/50 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                        {order.status === "pending" ? (
                          <Button
                            className="w-full rounded-full"
                            disabled={busy || !emailConfigured}
                            onClick={() => void confirmOrder(order)}
                          >
                            {busy ? (
                              <LoaderCircle className="size-4 animate-spin" />
                            ) : (
                              <MailCheck className="size-4" />
                            )}
                            Confirm &amp; email
                          </Button>
                        ) : null}

                        {order.status === "confirmed" ? (
                          <>
                            <Button
                              className="w-full rounded-full"
                              disabled={busy}
                              onClick={() => void changeStatus(order, "shipped")}
                            >
                              <Truck className="size-4" />
                              Mark as shipped
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full rounded-full"
                              disabled={busy || !emailConfigured}
                              onClick={() => void resendEmail(order)}
                            >
                              <RefreshCcw
                                className={cn("size-4", busy && "animate-spin")}
                              />
                              Resend email
                            </Button>
                          </>
                        ) : null}

                        {order.status !== "cancelled" &&
                        order.status !== "shipped" ? (
                          <Button
                            variant="outline"
                            className="w-full rounded-full text-destructive hover:text-destructive"
                            disabled={busy}
                            onClick={() => void changeStatus(order, "cancelled")}
                          >
                            <XCircle className="size-4" />
                            Cancel order
                          </Button>
                        ) : null}
                        {order.status === "cancelled" ? (
                          <Button
                            variant="outline"
                            className="w-full rounded-full text-destructive hover:text-destructive"
                            disabled={busy}
                            onClick={() => void removeOrder(order)}
                          >
                            <Trash2 className="size-4" />
                            Delete order record
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageEnter>
  );
}
