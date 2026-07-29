"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Boxes, GalleryHorizontal, LayoutGrid, PackageCheck, Settings } from "lucide-react";
import { getFirebaseDb } from "@/firebase/client";
import { useShopData } from "@/hooks/use-shop-data";
import { Card } from "@/components/ui/card";

export default function AdminOverviewPage() {
  const { products, categories, banners } = useShopData();
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db) return;
    return onSnapshot(
      query(collection(db, "orders"), where("status", "==", "pending")),
      (snapshot) => setPendingOrders(snapshot.size),
      () => setPendingOrders(0),
    );
  }, []);

  const cards = [
    { href: "/admin/orders", label: "Pending orders", value: pendingOrders, icon: PackageCheck },
    { href: "/admin/products", label: "Visible products", value: products.length, icon: Boxes },
    { href: "/admin/categories", label: "Collections", value: categories.length, icon: LayoutGrid },
    { href: "/admin/banners", label: "Homepage banners", value: banners.length, icon: GalleryHorizontal },
  ];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.34em] text-primary">Private workspace</p>
      <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Website overview</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Manage the catalogue, homepage, customer orders, and public contact information from one secure place.
      </p>
      <div className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map(({ href, label, value, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="h-full rounded-[1.35rem] p-4 transition-transform hover:-translate-y-0.5 sm:p-5">
              <Icon className="size-5 text-primary" />
              <p className="mt-5 text-2xl font-semibold">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
            </Card>
          </Link>
        ))}
      </div>
      <Card className="mt-5 rounded-[1.5rem] bg-[#292621] p-6 text-[#fffaf1] sm:p-8">
        <Settings className="size-6 text-[#d7aa76]" />
        <h2 className="mt-5 font-heading text-2xl">Changes publish live</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#fffaf1]/70">
          Saved Firestore content updates open storefronts in real time. Local catalogue data remains available as a fallback, and any local item can be hidden from this panel.
        </p>
        <Link href="/admin/settings" className="mt-6 inline-flex text-sm font-semibold underline underline-offset-4">
          Open website settings
        </Link>
      </Card>
    </div>
  );
}
