"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { isAuthOnlyPath, isGuestHomePath } from "@/lib/auth-public-paths";

function SessionSkeleton() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">Checking your session…</p>
    </div>
  );
}

function RedirectingToLogin() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 px-4">
      <p className="text-sm text-muted-foreground">Taking you to sign in…</p>
    </div>
  );
}

/**
 * - `/login`, `/signup`, `/forgot-password`: always open.
 * - `/` (home): guests may open it; other routes need sign-in (redirect to `/login`).
 * - Protected routes without Firebase env or without a user: redirect to `/login` (no intermediate setup screen).
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { user, loading, firebaseReady } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const authPage = isAuthOnlyPath(pathname);
  const guestHome = isGuestHomePath(pathname);
  const openWithoutLogin = authPage || guestHome;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (openWithoutLogin) return;
    const returnUrl = `${pathname}${typeof window !== "undefined" ? window.location.search : ""}`;
    const login = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
    if (!firebaseReady) {
      router.replace(login);
      return;
    }
    if (loading) return;
    if (user) return;
    router.replace(login);
  }, [mounted, firebaseReady, loading, user, openWithoutLogin, pathname, router]);

  if (!mounted) {
    if (openWithoutLogin) return <>{children}</>;
    return <SessionSkeleton />;
  }

  if (authPage) {
    return <>{children}</>;
  }

  if (guestHome) {
    return <>{children}</>;
  }

  if (!firebaseReady) {
    return <RedirectingToLogin />;
  }

  if (loading) {
    return <SessionSkeleton />;
  }

  if (!user) {
    return <RedirectingToLogin />;
  }

  return <>{children}</>;
}
