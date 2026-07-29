"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Boxes,
  ChevronRight,
  CircleGauge,
  GalleryHorizontal,
  LayoutGrid,
  LoaderCircle,
  PackageCheck,
  RefreshCcw,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: CircleGauge },
  { href: "/admin/orders", label: "Orders", icon: PackageCheck },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
  { href: "/admin/banners", label: "Homepage banners", icon: GalleryHorizontal },
  { href: "/admin/settings", label: "Website settings", icon: Settings },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, loading, firebaseReady, refreshProfile, logout } = useAuth();

  useEffect(() => {
    if (loading || !firebaseReady || user) return;
    const returnUrl = pathname || "/admin";
    router.replace(`/admin/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  }, [firebaseReady, loading, pathname, router, user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="size-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!firebaseReady) {
    return <AccessCard title="Firebase is required" body="Configure Firebase before opening the administration workspace." />;
  }

  if (!user) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <LoaderCircle className="size-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <AccessCard
        title="Admin access required"
        body="This account does not have the secure Firebase admin claim. Grant it from your trusted local setup, sign out, and sign in again."
      >
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => void refreshProfile()}
          >
            <RefreshCcw className="size-4" />
            Refresh access
          </Button>
          <Button
            className="rounded-full"
            onClick={async () => {
              await logout();
              router.replace("/admin/login");
            }}
          >
            <LogOut className="size-4" />
            Use admin account
          </Button>
        </div>
      </AccessCard>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5eee4] py-5 dark:bg-[#171512] sm:py-8">
      <div className="page-container grid min-w-0 gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="h-fit overflow-hidden rounded-[1.5rem] border border-border/60 bg-card/90 shadow-[0_18px_45px_rgba(55,43,31,0.08)] lg:sticky lg:top-8">
          <div className="border-b border-border/60 p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/12 text-primary">
                <ShieldCheck className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-heading text-lg">Mietaaf Admin</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto p-3 lg:flex-col" aria-label="Admin sections">
            {adminLinks.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === href : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                  <ChevronRight className="ml-auto hidden size-3.5 lg:block" />
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border/60 p-3">
            <div className="grid gap-1">
              <Button asChild variant="ghost" className="w-full justify-start rounded-xl">
                <Link href="/">View storefront</Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-xl text-muted-foreground"
                onClick={async () => {
                  await logout();
                  router.replace("/admin/login");
                }}
              >
                <LogOut className="size-4" />
                Sign out admin
              </Button>
            </div>
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

function AccessCard({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-container py-16">
      <Card className="mx-auto max-w-xl rounded-[1.5rem] p-7 text-center">
        <ShieldCheck className="mx-auto size-9 text-primary" />
        <h1 className="mt-4 font-heading text-2xl">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
        {children}
      </Card>
    </div>
  );
}
