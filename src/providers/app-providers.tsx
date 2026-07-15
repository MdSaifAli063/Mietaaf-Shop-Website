"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToasterProvider } from "@/providers/toaster-provider";
import { useEffect } from "react";
import { useSettingsStore, type SiteSettings } from "@/store/settings-store";

function GlobalSettingsListener() {
  const setSettings = useSettingsStore((s) => s.setSettings);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function listenForSettings() {
      const [{ FirebaseError }, { doc, onSnapshot }, { getFirebaseDb }] = await Promise.all([
        import("firebase/app"),
        import("firebase/firestore"),
        import("@/firebase/client"),
      ]);

      if (cancelled) return;
      const db = getFirebaseDb();
      if (!db) return;

      unsubscribe = onSnapshot(
        doc(db, "settings", "global"),
        (snap) => {
          if (snap.exists()) {
            setSettings(snap.data() as SiteSettings);
          }
        },
        (error) => {
          if (error instanceof FirebaseError && error.code === "permission-denied") {
            return;
          }
          console.error("Error loading global site settings", error);
        },
      );
    }

    void listenForSettings();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [setSettings]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GlobalSettingsListener />
        <TooltipProvider delay={200}>
          {children}
          <ToasterProvider />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
