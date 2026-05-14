"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ImageIcon,
  Users,
  ShoppingCart,
  FolderTree,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user || !isAdmin) router.replace("/login");
  }, [loading, user, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-muted-foreground">
        Verifying admin access…
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="hidden w-56 shrink-0 border-r border-border/60 bg-card/40 p-4 md:block">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Mietaaf
        </p>
        <p className="px-2 pb-4 text-sm font-heading text-lg">Admin</p>
        <nav className="space-y-1">
          {links.map((l) => {
            const active = pathname === l.href;
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-primary/15 text-primary" : "hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/" className="mt-8 block px-3 text-xs text-muted-foreground hover:text-foreground">
          ← Back to site
        </Link>
      </aside>
      <div className="flex-1 overflow-x-hidden">
        <div className="flex gap-2 overflow-x-auto border-b border-border/60 bg-card/30 p-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "shrink-0 rounded-full border border-border/60 px-3 py-1 text-xs",
                pathname === l.href && "border-primary bg-primary/10",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
