"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ChevronRight,
  Search,
  LoaderCircle,
  MailCheck,
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
import { Card } from "@/components/ui/card";
import { AdminEmptyState, AdminPageHeader, AdminPagination } from "@/components/admin/admin-ui";
import { Input } from "@/components/ui/input";
import { formatInr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { sendOrderConfirmationEmail } from "@/services/order-confirmation-email";
import type { Order, OrderLine } from "@/types";

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
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<OrderStatus | "all">("pending");
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db || !user || !isAdmin) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    setOrdersLoading(true);
    setLoadError(false);
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
        setLoadError(true);
        toast.error("Could not load orders. Check the admin claim and rules.");
      },
    );
  }, [isAdmin, user]);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const matchesStatus = filter === "all" || order.status === filter;
    return matchesStatus && `${order.id} ${order.customerName} ${order.customerEmail} ${order.phone}`.toLowerCase().includes(search.trim().toLowerCase());
  }), [filter, orders, search]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filteredOrders.length / 8)));
  const pageOrders = filteredOrders.slice((currentPage - 1) * 8, currentPage * 8);

  const pendingCount = orders.filter(
    (order) => order.status === "pending",
  ).length;
  const confirmedCount = orders.filter(
    (order) => order.status === "confirmed",
  ).length;

  async function confirmOrder(order: AdminOrder) {
    setBusyOrderId(order.id);
    try {
      const result = await sendOrderConfirmationEmail(order.id, "confirm");
      if (result.emailSent) {
        toast.success("Order confirmed and email sent to the customer.");
      } else {
        toast.error("Order confirmed. The email could not be sent; use Resend email to retry.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not confirm this order. Please try again.");
    } finally {
      setBusyOrderId(null);
    }
  }

  async function resendEmail(order: AdminOrder) {
    setBusyOrderId(order.id);
    try {
      const result = await sendOrderConfirmationEmail(order.id, "resend");
      if (result.emailSent) {
        toast.success("Confirmation email sent again.");
      } else {
        toast.error("The email could not be sent. Please try again later.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send the confirmation email.");
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
          <Button asChild className="mt-6 rounded-lg">
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
            className="mt-6 rounded-lg"
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
    <div>
      <AdminPageHeader title="Customer orders" eyebrow="Order management" description="Review WhatsApp checkout orders, confirm details and manage fulfilment." actions={<div className="flex gap-2"><span className="rounded-lg border border-border/70 bg-card px-3 py-2 text-xs"><span className="font-semibold tabular-nums">{pendingCount}</span><span className="ml-2 text-muted-foreground">pending</span></span><span className="rounded-lg border border-border/70 bg-card px-3 py-2 text-xs"><span className="font-semibold tabular-nums">{confirmedCount}</span><span className="ml-2 text-muted-foreground">confirmed</span></span></div>} />

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-3">
            <div className="relative w-full sm:max-w-xs"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input aria-label="Search orders" className="h-10 pl-9 text-sm" placeholder="Search name, order or contact…" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></div>
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-surface-silver/60 p-1" aria-label="Order status">
            {(["pending", "confirmed", "shipped", "cancelled", "all"] as const).map(
              (status) => (
                <Button
                  key={status}
                  size="sm"
                  variant="ghost"
                  aria-pressed={filter === status}
                  className={`h-8 shrink-0 rounded-md text-xs capitalize ${filter === status ? "bg-card shadow-sm" : "text-muted-foreground"}`}
                  onClick={() => { setFilter(status); setPage(1); }}
                >
                  {status}
                </Button>
              ),
            )}
          </div>

            </div>

          {ordersLoading ? (
            <div className="grid gap-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-xl bg-muted/60"
                />
              ))}
            </div>
          ) : loadError ? (
            <AdminEmptyState title="Orders could not be loaded" description="Check your connection and admin access, then refresh the page." />
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-xl border border-border/70 bg-card"><AdminEmptyState title={search ? "No matching orders" : filter === "all" ? "No orders yet" : `No ${filter} orders`} description="New WhatsApp checkout orders appear automatically. Try another search or status." action={search ? <Button size="sm" variant="outline" onClick={() => { setSearch(""); setPage(1); }}>Clear search</Button> : undefined} /></div>
          ) : (
            <div className="grid gap-3">
              {pageOrders.map((order) => {
                const busy = busyOrderId === order.id;
                return (
                  <details key={order.id} className="group overflow-hidden rounded-xl border border-border/70 bg-card">
                    <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ring sm:grid-cols-[minmax(0,1fr)_120px_110px_20px] [&::-webkit-details-marker]:hidden">
                      <div className="min-w-0"><p className="text-[13px] font-semibold">{order.customerName}</p><p className="mt-1 truncate text-[10px] text-muted-foreground">#{order.id.toUpperCase()} · {order.items.length} {order.items.length === 1 ? "item" : "items"}</p></div>
                      <span className={cn("w-fit rounded-md border px-2 py-1 text-[10px] font-medium capitalize", statusClass(order.status))}>{order.status}</span>
                      <span className="text-xs font-semibold tabular-nums sm:text-right">{formatInr(order.total)}</span>
                      <ChevronRight className="size-4 justify-self-end text-muted-foreground transition-transform group-open:rotate-90" aria-hidden="true" />
                    </summary>
                    <div className="grid gap-5 border-t border-border/60 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_220px]">
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">{order.createdAt ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(order.createdAt) : "Recently placed"}{order.confirmationEmailStatus ? ` · Email ${order.confirmationEmailStatus}` : ""}</p>
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

                      <div className="flex flex-col justify-center gap-3 border-t border-border/50 pt-5 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
                        {order.status === "pending" ? (
                          <Button
                            className="w-full rounded-lg"
                            disabled={busy}
                            onClick={() => void confirmOrder(order)}
                          >
                            {busy ? (
                              <LoaderCircle className="size-4 animate-spin" />
                            ) : (
                              <MailCheck className="size-4" />
                            )}
                            Confirm order
                          </Button>
                        ) : null}

                        {order.status === "confirmed" ? (
                          <>
                            <Button
                              className="w-full rounded-lg"
                              disabled={busy}
                              onClick={() => void changeStatus(order, "shipped")}
                            >
                              <Truck className="size-4" />
                              Mark as shipped
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full rounded-lg"
                              disabled={busy}
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
                            className="w-full rounded-lg text-destructive hover:text-destructive"
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
                            className="w-full rounded-lg text-destructive hover:text-destructive"
                            disabled={busy}
                            onClick={() => void removeOrder(order)}
                          >
                            <Trash2 className="size-4" />
                            Delete order record
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          )}
      {filteredOrders.length > 0 ? <div className="mt-4 overflow-hidden rounded-xl border border-border/70 bg-card"><AdminPagination page={currentPage} pageSize={8} total={filteredOrders.length} onPageChange={setPage} /></div> : null}
    </div>
  );
}
