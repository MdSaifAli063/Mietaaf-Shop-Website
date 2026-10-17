"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BookImage, Boxes, ChevronRight, CircleGauge, Crown, GalleryHorizontal, Gem, Layers3, LayoutGrid, LoaderCircle, LogOut, Menu, PackageCheck, RefreshCcw, Settings, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SITE_MONOGRAM_URL } from "@/lib/site-logo";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: CircleGauge },
  { href: "/admin/orders", label: "Orders", icon: PackageCheck },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
  { href: "/admin/wedding", label: "Wedding", icon: Gem },
  { href: "/admin/premium", label: "Premium", icon: Crown },
  { href: "/admin/lookbook", label: "Lookbook", icon: BookImage },
  { href: "/admin/fabrics", label: "Fabrics", icon: Layers3 },
  { href: "/admin/banners", label: "Banners", icon: GalleryHorizontal },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminNavigation({ pathname, email, signOut, onNavigate }: { pathname: string; email: string | null; signOut: () => void; onNavigate?: () => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-card">
      <Link href="/admin" onClick={onNavigate} className="flex h-20 shrink-0 items-center gap-3 border-b border-border/60 px-5 focus-visible:outline-2 focus-visible:outline-ring">
        <Image src={SITE_MONOGRAM_URL} alt="" width={34} height={34} className="rounded-lg" />
        <span className="min-w-0"><span className="block truncate font-heading text-xl leading-none">Mietaaf Couture</span><span className="mt-1.5 block text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Administration</span></span>
      </Link>
      <nav aria-label="Admin sections" className="min-h-0 flex-1 overflow-y-auto px-3 py-6">
        <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
        <div className="space-y-1">
          {adminLinks.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={cn("flex min-h-11 items-center gap-3 rounded-lg border px-3 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring", active ? "border-primary/15 bg-primary/10 text-primary" : "border-transparent text-muted-foreground hover:bg-surface-silver hover:text-foreground")}><Icon className="size-4" strokeWidth={1.7} aria-hidden="true" /><span>{label}</span>{active ? <ChevronRight className="ml-auto size-3.5" aria-hidden="true" /> : null}</Link>;
          })}
        </div>
      </nav>
      <div className="shrink-0 border-t border-border/60 p-3">
        <Button asChild variant="ghost" className="mb-3 h-10 w-full justify-start gap-3 rounded-lg px-3 text-xs"><Link href="/" target="_blank" rel="noopener noreferrer"><ArrowUpRight className="size-4" aria-hidden="true" /> View storefront</Link></Button>
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-surface-silver/50 p-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold text-primary" aria-hidden="true">{email?.[0]?.toUpperCase() || "M"}</span>
          <div className="min-w-0 flex-1"><p className="text-xs font-medium">Administrator</p><p className="mt-1 truncate text-[10px] text-muted-foreground" title={email ?? undefined}>{email}</p></div>
          <Button variant="ghost" size="icon" className="size-8 rounded-md text-muted-foreground" aria-label="Sign out admin" onClick={signOut}><LogOut className="size-4" /></Button>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, loading, firebaseReady, refreshProfile, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (loading || !firebaseReady || user) return;
    const returnUrl = pathname || "/admin";
    router.replace(`/admin/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  }, [firebaseReady, loading, pathname, router, user]);

  if (loading || (firebaseReady && !user)) {
    return <div role="status" className="flex min-h-dvh items-center justify-center"><LoaderCircle className="size-6 animate-spin text-primary" aria-hidden="true" /><span className="sr-only">Loading workspace…</span></div>;
  }
  if (!firebaseReady) return <AccessCard title="Firebase is required" body="Configure Firebase before opening the administration workspace." />;
  if (!user) return null;
  if (!isAdmin) {
    return <AccessCard title="Admin access required" body="This account does not have the secure Firebase admin claim. Grant it from your trusted local setup, sign out, and sign in again."><div className="mt-6 flex flex-wrap justify-center gap-2"><Button variant="outline" onClick={() => void refreshProfile()}><RefreshCcw className="size-4" />Refresh access</Button><Button onClick={async () => { await logout(); router.replace("/admin/login"); }}><LogOut className="size-4" />Use admin account</Button></div></AccessCard>;
  }

  const signOut = async () => { await logout(); router.replace("/admin/login"); };
  const section = adminLinks.find((item) => item.href !== "/admin" && pathname.startsWith(item.href))?.label ?? "Overview";

  return (
    <div className="admin-workspace min-h-dvh bg-background lg:grid lg:h-dvh lg:grid-cols-[224px_minmax(0,1fr)] lg:overflow-hidden">
      <a href="#admin-main" className="sr-only z-50 rounded-md bg-card p-3 text-sm focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to workspace</a>
      <aside className="hidden min-h-0 border-r border-border/70 lg:block"><AdminNavigation pathname={pathname} email={user.email} signOut={() => void signOut()} /></aside>
      <div className="flex min-h-0 min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/70 bg-card/95 px-4 backdrop-blur sm:px-6 lg:static lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button ref={menuButtonRef} variant="ghost" size="icon" className="size-10 rounded-lg lg:hidden" aria-label="Open admin navigation" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu className="size-5" /></Button>
            <div className="flex min-w-0 items-center gap-2 text-xs"><Link href="/admin" className="hidden text-muted-foreground hover:text-foreground sm:inline">Workspace</Link><ChevronRight className="hidden size-3.5 text-muted-foreground sm:block" aria-hidden="true" /><span className="truncate font-medium">{section}</span></div>
          </div>
          <div className="flex shrink-0 items-center gap-3"><span className="hidden items-center gap-1.5 text-[10px] text-muted-foreground md:inline-flex"><ShieldCheck className="size-3.5" aria-hidden="true" />Admin access</span><Button asChild variant="outline" size="sm" className="h-9 gap-2 rounded-lg text-xs"><Link href="/" target="_blank" rel="noopener noreferrer">View store<ArrowUpRight className="size-3.5" aria-hidden="true" /></Link></Button></div>
        </header>
        <main id="admin-main" tabIndex={-1} className="min-h-0 min-w-0 flex-1 p-4 outline-none sm:p-6 lg:overflow-y-auto lg:overscroll-contain lg:p-8"><div className="mx-auto w-full min-w-0 max-w-[1600px]">{children}</div></main>
      </div>
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent finalFocus={menuButtonRef} className="admin-navigation-drawer inset-y-0 left-0 top-0 h-dvh max-h-dvh w-[min(85vw,280px)] max-w-none translate-x-0 translate-y-0 overflow-hidden rounded-none p-0">
          <DialogTitle className="sr-only">Admin navigation</DialogTitle><DialogDescription className="sr-only">Choose a workspace section or manage your administrator session.</DialogDescription>
          <AdminNavigation pathname={pathname} email={user.email} signOut={() => void signOut()} onNavigate={() => setMenuOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AccessCard({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return <div className="page-container py-16"><Card className="mx-auto max-w-xl rounded-xl p-7 text-center"><ShieldCheck className="mx-auto size-9 text-primary" /><h1 className="mt-4 font-heading text-2xl">{title}</h1><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>{children}</Card></div>;
}
