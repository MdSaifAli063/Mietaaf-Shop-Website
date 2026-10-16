"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  GitCompareArrows,
  LogOut,
  Menu,
  PackageCheck,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  User2,
  Heart,
} from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_CATEGORIES } from "@/lib/constants";
import { useCartStore } from "@/store/cart-store";
import { useCompareStore } from "@/store/compare-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useUiStore } from "@/store/ui-store";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { isAuthOnlyPath } from "@/lib/auth-public-paths";
import { SITE_PHONE_E164_PLUS, SITE_WHATSAPP_E164_DIGITS } from "@/lib/site-contact";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useShopData } from "@/hooks/use-shop-data";

export function SiteHeader() {
  const storedCartCount = useCartStore((s) =>
    s.items.reduce((n, i) => n + i.quantity, 0),
  );
  const storedWishCount = useWishlistStore((s) => s.ids.length);
  const storedCompareCount = useCompareStore((s) => s.slugs.length);
  const setSearch = useUiStore((s) => s.setSearchOpen);
  const { user, logout, loading, isAdmin } = useAuth();
  const mounted = useHasMounted();
  const cartCount = mounted ? storedCartCount : 0;
  const wishCount = mounted ? storedWishCount : 0;
  const compareCount = mounted ? storedCompareCount : 0;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const { settings } = useSiteSettings();
  const { categories } = useShopData();
  const navCategories = categories.length
    ? categories.map((category) => ({ slug: category.slug, label: category.name }))
    : NAV_CATEGORIES;

  const links = useMemo(
    () => [
      { href: "/shop", label: "Shop" },
      { href: "/category/wedding-collection", label: "Wedding" },
      { href: "/category/premium-collection", label: "Premium" },
      { href: "/lookbook", label: "Lookbook" },
      { href: "/fabrics", label: "Fabrics" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
    [],
  );

  const isAuthPage = Boolean(pathname && isAuthOnlyPath(pathname));
  const logoHref = isAuthPage ? "/login" : "/";
  const announcements = [
    ...(settings.announcementEnabled
      ? [{
          text: settings.announcementText,
          mobileText: settings.announcementMobileText,
          cta: settings.announcementCta,
          href: settings.announcementHref,
        }]
      : []),
    {
      text: "For personalised assistance, reach us on WhatsApp at",
      mobileText: "Personal styling on WhatsApp",
      cta: settings.phoneDisplay || SITE_PHONE_E164_PLUS,
      href: `https://wa.me/${settings.whatsappNumber || SITE_WHATSAPP_E164_DIGITS}`,
      external: true,
    },
  ];
  const announcement = announcements[announcementIndex] ?? announcements[0]!;
  const showPreviousAnnouncement = () =>
    setAnnouncementIndex((current) => (current === 0 ? announcements.length - 1 : current - 1));
  const showNextAnnouncement = () =>
    setAnnouncementIndex((current) => (current + 1) % announcements.length);

  useEffect(() => {
    if (isAuthPage || announcements.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setAnnouncementIndex((current) => (current + 1) % announcements.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [announcements.length, isAuthPage]);

  return (
    <header className="sticky top-0 z-40 w-full min-w-0 overflow-x-clip border-b border-border/70 bg-card/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
      {!isAuthPage ? (
        <div className="bg-mietaaf-charcoal text-mietaaf-cream">
          <div className="mx-auto flex min-h-11 w-full max-w-7xl items-center justify-center gap-1 px-1 py-1 sm:min-h-12 sm:gap-5 sm:px-6">
            <button
              type="button"
              onClick={showPreviousAnnouncement}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:size-10"
              aria-label="Previous announcement"
            >
              <ChevronLeft className="size-3.5 sm:size-4" aria-hidden="true" />
            </button>
            <p className="min-w-0 flex-1 text-center text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-white sm:text-xs sm:leading-5 sm:tracking-[0.2em]">
              <span className="sm:hidden">{announcement.mobileText}</span>
              <span className="hidden sm:inline">{announcement.text}</span>{" "}
              <Link
                href={announcement.href}
                target={announcement.external ? "_blank" : undefined}
                rel={announcement.external ? "noopener noreferrer" : undefined}
                className="inline-block max-w-full align-bottom underline underline-offset-2 transition-colors hover:text-mietaaf-cream sm:underline-offset-4"
              >
                {announcement.cta} {announcement.external ? null : "→"}
              </Link>
            </p>
            <button
              type="button"
              onClick={showNextAnnouncement}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:size-10"
              aria-label="Next announcement"
            >
              <ChevronRight className="size-3.5 sm:size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
      <div className="relative mx-auto grid h-16 w-full min-w-0 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-1 px-2 sm:h-18 sm:gap-2 sm:px-6 lg:h-20 lg:px-8 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:gap-4">
        {/* Left: menu + logo (flush left) */}
        <div className="relative z-20 flex min-w-0 items-center gap-0.5 sm:gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-11 shrink-0 xl:hidden",
              )}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex h-dvh max-h-dvh w-[min(100dvw,420px)] max-w-[min(85vw,420px)] flex-col gap-0 overflow-hidden p-0"
            >
              <SheetTitle className="sr-only">Mietaaf navigation</SheetTitle>
              <div className="shrink-0 border-b border-border/70 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] pr-12">
                <Logo
                  href={logoHref}
                  variant="drawer"
                  priority
                  onClick={() => setOpen(false)}
                />
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Luxury men’s ethnic & formal — curated in India.
                </p>
              </div>
              <nav className="flex min-h-0 flex-1 touch-manipulation flex-col gap-0.5 overflow-y-auto overscroll-contain px-3 py-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-4">
                {isAuthPage ? (
                  <>
                    <Link
                      href="/login"
                      className="rounded-full px-3 py-3 text-[0.78rem] font-medium uppercase tracking-[0.24em] hover:bg-muted/70 sm:py-2 sm:text-[0.72rem]"
                      onClick={() => setOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded-full px-3 py-3 text-[0.78rem] font-medium uppercase tracking-[0.24em] hover:bg-muted/70 sm:py-2 sm:text-[0.72rem]"
                      onClick={() => setOpen(false)}
                    >
                      Create account
                    </Link>
                    <Link
                      href="/forgot-password"
                      className="rounded-full px-3 py-3 text-[0.78rem] uppercase tracking-[0.22em] hover:bg-muted/70 sm:py-2 sm:text-[0.72rem]"
                      onClick={() => setOpen(false)}
                    >
                      Forgot password
                    </Link>
                  </>
                ) : (
                  <>
                    {links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="rounded-full px-3 py-3 text-[0.78rem] font-medium uppercase tracking-[0.22em] hover:bg-muted/70 sm:py-2 sm:text-[0.72rem]"
                        onClick={() => setOpen(false)}
                      >
                        {l.label}
                      </Link>
                    ))}
                    <div className="my-2 border-t border-border/70" />
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-muted-foreground">
                      Quick access
                    </p>
                    <button
                      type="button"
                      className="flex min-h-11 items-center gap-3 rounded-full px-3 py-2 text-left text-[0.78rem] uppercase tracking-[0.2em] hover:bg-muted/70 sm:text-[0.72rem]"
                      onClick={() => {
                        setOpen(false);
                        setSearch(true);
                      }}
                    >
                      <Search className="size-4 shrink-0" aria-hidden="true" />
                      Search
                    </button>
                    <Link
                      href="/wishlist"
                      className="flex min-h-11 items-center gap-3 rounded-full px-3 py-2 text-[0.78rem] uppercase tracking-[0.2em] hover:bg-muted/70 sm:text-[0.72rem]"
                      onClick={() => setOpen(false)}
                    >
                      <Heart className="size-4 shrink-0" aria-hidden="true" />
                      Wishlist
                      {wishCount > 0 ? <span className="ml-auto text-xs">{wishCount}</span> : null}
                    </Link>
                    <Link
                      href="/compare"
                      className="flex min-h-11 items-center gap-3 rounded-full px-3 py-2 text-[0.78rem] uppercase tracking-[0.2em] hover:bg-muted/70 sm:text-[0.72rem]"
                      onClick={() => setOpen(false)}
                    >
                      <GitCompareArrows className="size-4 shrink-0" aria-hidden="true" />
                      Compare
                      {compareCount > 0 ? <span className="ml-auto text-xs">{compareCount}</span> : null}
                    </Link>
                    <Link
                      href="/cart"
                      className="flex min-h-11 items-center gap-3 rounded-full px-3 py-2 text-[0.78rem] uppercase tracking-[0.2em] hover:bg-muted/70 sm:text-[0.72rem]"
                      onClick={() => setOpen(false)}
                    >
                      <ShoppingBag className="size-4 shrink-0" aria-hidden="true" />
                      Shopping bag
                      {cartCount > 0 ? <span className="ml-auto text-xs">{cartCount}</span> : null}
                    </Link>
                    <Link
                      href={user ? "/profile" : "/login"}
                      className="flex min-h-11 items-center gap-3 rounded-full px-3 py-2 text-[0.78rem] uppercase tracking-[0.2em] hover:bg-muted/70 sm:text-[0.72rem]"
                      onClick={() => setOpen(false)}
                    >
                      <User2 className="size-4 shrink-0" aria-hidden="true" />
                      {user ? "My account" : "Sign in"}
                    </Link>
                    <div className="my-2 border-t border-border/70" />
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-muted-foreground">
                      Categories
                    </p>
                    {navCategories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/category/${c.slug}`}
                        className="rounded-full px-3 py-3 text-[0.78rem] uppercase tracking-[0.22em] hover:bg-muted/70 sm:py-2 sm:text-[0.72rem]"
                        onClick={() => setOpen(false)}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Logo href={logoHref} className="min-w-0" priority />
        </div>

        {/* Each desktop region has its own column so navigation cannot cover the logo or utilities. */}
        {!isAuthPage ? (
          <nav
            className={cn(
              "relative z-30 hidden min-w-0 xl:flex",
              "items-center justify-center",
            )}
            aria-label="Primary"
          >
            <div className="flex min-w-0 items-center justify-center gap-4 2xl:gap-5">
              <Link
                href={links[0]!.href}
                aria-current={pathname === links[0]!.href ? "page" : undefined}
                className={cn(
                  "relative shrink-0 py-3 text-[13px] font-medium tracking-[0.025em] text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground",
                  "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full",
                )}
              >
                {links[0]!.label}
              </Link>
              <DropdownMenu open={categoriesOpen} onOpenChange={setCategoriesOpen}>
                <DropdownMenuTrigger
                  className={cn(
                    "relative inline-flex h-11 shrink-0 items-center gap-1.5 px-1 text-[13px] font-medium tracking-[0.025em] text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-popup-open:text-foreground",
                    "after:absolute after:bottom-1 after:left-1 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-[calc(100%-0.5rem)] data-popup-open:after:w-[calc(100%-0.5rem)]",
                  )}
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      categoriesOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[min(90vw,720px)] p-4"
                  align="center"
                  sideOffset={10}
                >
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {navCategories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/category/${c.slug}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="rounded-2xl border border-border/70 bg-card/80 p-3 text-sm transition-colors hover:border-primary/50 hover:bg-accent/35"
                      >
                        <div className="font-heading text-base tracking-[0.04em]">{c.label}</div>
                        <p className="mt-1 text-xs text-muted-foreground">Explore collection</p>
                      </Link>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              {links.slice(1).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className={cn(
                    "relative shrink-0 py-3 text-[13px] font-medium tracking-[0.025em] text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground",
                    "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full",
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        ) : null}

        {/* Right: utilities */}
        <div className="relative z-20 flex shrink-0 touch-manipulation items-center justify-end gap-0 sm:gap-1.5">
          {!isAuthPage ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex size-11 shrink-0"
                onClick={() => setSearch(true)}
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
              </Button>

              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "relative hidden size-11 shrink-0 sm:inline-flex",
                )}
              >
                <Heart className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                {wishCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {wishCount > 9 ? "9+" : wishCount}
                  </span>
                ) : null}
              </Link>

              <Link
                href="/compare"
                aria-label="Compare"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "relative hidden size-11 shrink-0 sm:inline-flex",
                )}
              >
                <GitCompareArrows className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                {compareCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {compareCount > 9 ? "9+" : compareCount}
                  </span>
                ) : null}
              </Link>

              <Link
                href="/cart"
                aria-label="Cart"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "relative size-11 shrink-0",
                )}
              >
                <ShoppingBag className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                {cartCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                ) : null}
              </Link>
            </>
          ) : null}

          {!isAuthPage ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "size-11 shrink-0",
                )}
                aria-label="Account"
              >
                <User2 className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  {user ? user.email : loading ? "Loading…" : "Guest"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User2 className="size-4" aria-hidden="true" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/profile#orders")}>
                      <PackageCheck className="size-4" aria-hidden="true" />
                      My orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                      <Heart className="size-4" aria-hidden="true" />
                      Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/cart")}>
                      <ShoppingBag className="size-4" aria-hidden="true" />
                      Cart
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/profile#settings")}>
                      <Settings className="size-4" aria-hidden="true" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/profile#help")}>
                      <CircleHelp className="size-4" aria-hidden="true" />
                      Help center
                    </DropdownMenuItem>
                    {isAdmin ? (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => router.push("/admin")}
                        >
                          <ShieldCheck className="size-4" aria-hidden="true" />
                          Admin panel
                        </DropdownMenuItem>
                      </>
                    ) : null}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        await logout();
                      }}
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      Log out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => router.push("/login")}>Login</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/signup")}>
                      Create account
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
}
