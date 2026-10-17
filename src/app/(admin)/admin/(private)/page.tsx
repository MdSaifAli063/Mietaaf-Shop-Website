"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { ArrowRight, ArrowUpRight, Boxes, GalleryHorizontal, LayoutGrid, PackageCheck, Settings } from "lucide-react";
import { getFirebaseDb } from "@/firebase/client";
import { useShopData } from "@/hooks/use-shop-data";
import { AdminEmptyState, AdminPageHeader, AdminPanel, AdminStatus } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/format";

type RecentOrder = { id: string; name: string; total: number; status: string };

export default function AdminOverviewPage() {
  const { products, categories, banners } = useShopData();
  const [pendingOrders, setPendingOrders] = useState<number | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[] | null>(null);
  const [ordersUnavailable, setOrdersUnavailable] = useState(false);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db) { setOrdersUnavailable(true); return; }
    const pending = onSnapshot(query(collection(db, "orders"), where("status", "==", "pending")), (snapshot) => setPendingOrders(snapshot.size), () => setPendingOrders(null));
    const recent = onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5)), (snapshot) => {
      setRecentOrders(snapshot.docs.map((entry) => { const data = entry.data(); return { id: entry.id, name: typeof data.customerName === "string" ? data.customerName : "Customer", total: typeof data.total === "number" ? data.total : 0, status: ["pending", "confirmed", "shipped", "cancelled"].includes(String(data.status)) ? String(data.status) : "pending" }; }));
      setOrdersUnavailable(false);
    }, () => { setRecentOrders(null); setOrdersUnavailable(true); });
    return () => { pending(); recent(); };
  }, []);

  const cards = [
    { href: "/admin/orders", label: "Pending orders", value: pendingOrders ?? "—", icon: PackageCheck, description: "Awaiting confirmation" },
    { href: "/admin/products", label: "Visible products", value: products.length, icon: Boxes, description: "Available on your storefront" },
    { href: "/admin/categories", label: "Collections", value: categories.length, icon: LayoutGrid, description: "Live catalogue categories" },
    { href: "/admin/banners", label: "Homepage banners", value: banners.length, icon: GalleryHorizontal, description: "Active storefront slides" },
  ];
  const lowStock = products.filter((product) => product.stock <= 5).sort((a, b) => a.stock - b.stock);

  return (
    <div>
      <AdminPageHeader title="Store overview" eyebrow="Your workspace" description="A clear view of your catalogue, customer orders and storefront content." actions={<Button asChild variant="outline" className="h-10 rounded-lg text-xs"><Link href="/admin/products">Manage catalogue<ArrowRight className="size-3.5" /></Link></Button>} />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
        {cards.map(({ href, label, value, icon: Icon, description }) => <Link key={href} href={href} className="group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"><AdminPanel className="h-full p-4 transition-colors group-hover:border-primary/40 sm:p-5"><div className="flex items-center justify-between gap-2"><span className="flex size-9 items-center justify-center rounded-lg bg-surface-silver text-primary"><Icon className="size-4" strokeWidth={1.7} aria-hidden="true" /></span><ArrowUpRight className="size-3.5 text-muted-foreground" aria-hidden="true" /></div><p className="mt-4 text-[1.75rem] font-semibold leading-none tracking-tight tabular-nums">{value}</p><p className="mt-2 text-xs font-medium">{label}</p><p className="mt-1 hidden text-[10px] text-muted-foreground sm:block">{description}</p></AdminPanel></Link>)}
      </div>
      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
        <AdminPanel className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4"><div><h2 className="text-sm font-semibold">Recent orders</h2><p className="mt-1 text-[11px] text-muted-foreground">The latest orders from your storefront.</p></div><Link href="/admin/orders" className="inline-flex min-h-9 items-center gap-1.5 text-xs font-medium text-primary hover:underline">View all<ArrowRight className="size-3.5" /></Link></div>
          {ordersUnavailable ? <AdminEmptyState title="Orders are unavailable" description="Open Orders to check access or try again when the connection is restored." /> : recentOrders === null ? <div role="status" className="px-5 py-12 text-center text-xs text-muted-foreground">Loading recent orders…</div> : recentOrders.length === 0 ? <AdminEmptyState title="No orders yet" description="New WhatsApp checkout orders will appear here." /> : <ul className="divide-y divide-border/60">{recentOrders.map((order) => <li key={order.id}><Link href="/admin/orders" className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-silver/30"><div className="min-w-0"><p className="text-xs font-medium">{order.name}</p><p className="mt-1 max-w-48 truncate text-[10px] text-muted-foreground">#{order.id.toUpperCase()}</p></div><div className="flex items-center gap-4"><p className="text-xs font-semibold tabular-nums">{formatInr(order.total)}</p><AdminStatus status={order.status} /></div></Link></li>)}</ul>}
        </AdminPanel>
        <div className="grid gap-5">
          <AdminPanel className="p-5"><h2 className="text-sm font-semibold">Stock attention</h2><p className="mt-1 text-[11px] leading-5 text-muted-foreground">{lowStock.length ? `${lowStock.length} visible products have 5 or fewer items.` : "No visible products have low stock."}</p>{lowStock.length ? <ul className="mt-4 space-y-3">{lowStock.slice(0, 3).map((product) => <li key={product.slug} className="flex items-center justify-between gap-3 text-xs"><span className="truncate text-muted-foreground">{product.name}</span><span className="shrink-0 font-medium tabular-nums text-amber-700 dark:text-amber-300">{product.stock} left</span></li>)}</ul> : null}<Link href="/admin/products" className="mt-4 inline-flex min-h-8 items-center gap-2 text-xs font-medium text-primary hover:underline">Review products<ArrowRight className="size-3.5" /></Link></AdminPanel>
          <AdminPanel className="p-5"><div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-silver text-primary"><Settings className="size-4" aria-hidden="true" /></span><div><h2 className="text-sm font-semibold">Make it yours</h2><p className="mt-1 text-[11px] leading-5 text-muted-foreground">Keep your announcement, social profiles and studio details up to date.</p><Link href="/admin/settings" className="mt-3 inline-flex min-h-8 items-center gap-2 text-xs font-medium text-primary hover:underline">Website settings<ArrowRight className="size-3.5" /></Link></div></div></AdminPanel>
        </div>
      </div>
    </div>
  );
}
