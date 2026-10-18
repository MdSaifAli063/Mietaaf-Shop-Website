"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToasterProvider } from "@/providers/toaster-provider";
import { useEffect } from "react";
import { useSettingsStore } from "@/store/settings-store";
import { useCartStore } from "@/store/cart-store";
import { useCompareStore } from "@/store/compare-store";
import { useRecentStore } from "@/store/recent-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { usePublicStorefront } from "@/hooks/use-public-storefront";

function PersistedShoppingHydrator() {
  useEffect(() => {
    void Promise.all([
      useCartStore.persist.rehydrate(),
      useWishlistStore.persist.rehydrate(),
      useCompareStore.persist.rehydrate(),
      useRecentStore.persist.rehydrate(),
    ]);
  }, []);

  return null;
}

function GlobalSettingsListener() {
  const setSettings = useSettingsStore((s) => s.setSettings);

  const { logoUrl } = usePublicStorefront();
  useEffect(() => { setSettings(logoUrl ? { logoUrl } : {}); }, [logoUrl, setSettings]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PersistedShoppingHydrator />
        <GlobalSettingsListener />
        <TooltipProvider delay={200}>
          {children}
          <ToasterProvider />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
