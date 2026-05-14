"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_CATEGORIES } from "@/lib/constants";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useUiStore } from "@/store/ui-store";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { isAuthOnlyPath } from "@/lib/auth-public-paths";

export function SiteHeader() {
  const cartCount = useCartStore((s) =>
    s.items.reduce((n, i) => n + i.quantity, 0),
  );
  const wishCount = useWishlistStore((s) => s.ids.length);
  const setSearch = useUiStore((s) => s.setSearchOpen);
  const { theme, setTheme } = useTheme();
  const { user, logout, loading, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isAdminRoute = pathname?.startsWith("/admin");

  const links = useMemo(
    () => [
      { href: "/shop", label: "Shop" },
      { href: "/category/wedding-collection", label: "Wedding" },
      { href: "/category/premium-collection", label: "Premium" },
      { href: "/lookbook", label: "Lookbook" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
    [],
  );

  const isAuthPage = Boolean(pathname && isAuthOnlyPath(pathname));
  const logoHref = isAuthPage ? "/login" : "/";

  if (isAdminRoute) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="relative mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-2 px-2 sm:h-[5.5rem] sm:gap-3 sm:px-4 lg:h-24 lg:px-8">
        {/* Left: menu + logo (flush left) */}
        <div className="relative z-20 flex min-w-0 items-center gap-1.5 sm:gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "shrink-0 lg:hidden",
              )}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(100vw-2rem,420px)] gap-0 p-0">
              <div className="border-b border-border/60 p-6">
                <Logo
                  href={logoHref}
                  variant="drawer"
                  onClick={() => setOpen(false)}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Luxury men’s ethnic & formal — curated in India.
                </p>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {isAuthPage ? (
                  <>
                    <Link
                      href="/login"
                      className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      Create account
                    </Link>
                    <Link
                      href="/forgot-password"
                      className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
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
                        className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                        onClick={() => setOpen(false)}
                      >
                        {l.label}
                      </Link>
                    ))}
                    <div className="my-2 border-t border-border/60" />
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Categories
                    </p>
                    {NAV_CATEGORIES.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/category/${c.slug}`}
                        className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
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
          <Logo href={logoHref} className="hidden min-w-0 sm:flex" priority />
          <Logo href={logoHref} className="min-w-0 sm:hidden" />
        </div>

        {/* Desktop: dead-center in the bar (not “center of space between logo and icons”) */}
        {!isAuthPage ? (
          <nav
            className={cn(
              "pointer-events-none absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 lg:flex",
              "items-center justify-center",
            )}
            aria-label="Primary"
          >
            <div className="pointer-events-auto flex items-center justify-center gap-5 xl:gap-7">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative shrink-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                    "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full",
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "shrink-0 text-sm font-medium text-muted-foreground",
                  )}
                >
                  Categories
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[min(90vw,720px)] p-4" align="center">
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {NAV_CATEGORIES.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/category/${c.slug}`}
                        className="rounded-xl border border-border/60 bg-card/60 p-3 text-sm transition-colors hover:border-primary/50 hover:bg-accent/40"
                      >
                        <div className="font-heading text-base">{c.label}</div>
                        <p className="mt-1 text-xs text-muted-foreground">Explore collection</p>
                      </Link>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        ) : null}

        {/* Right: utilities */}
        <div className="relative z-20 flex shrink-0 items-center justify-end gap-0.5 sm:gap-1.5">
          {!isAuthPage ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex"
                onClick={() => setSearch(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Link
                href="/search"
                aria-label="Search"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "md:hidden",
                )}
              >
                <Search className="h-5 w-5" />
              </Link>

              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
              >
                <Heart className="h-5 w-5" />
                {wishCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {wishCount > 9 ? "9+" : wishCount}
                  </span>
                ) : null}
              </Link>

              <Link
                href="/cart"
                aria-label="Cart"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                ) : null}
              </Link>
            </>
          ) : null}

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {!isAuthPage ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                aria-label="Account"
              >
                <User2 className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  {user ? user.email : loading ? "Loading…" : "Guest"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                      Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/cart")}>Cart</DropdownMenuItem>
                    {isAdmin ? (
                      <DropdownMenuItem onClick={() => router.push("/admin")}>Admin</DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        await logout();
                      }}
                    >
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
