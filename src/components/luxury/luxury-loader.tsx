"use client";

import { useLayoutEffect, useState } from "react";

const STORAGE_KEY = "mietaaf_splash_seen";

/**
 * Lightweight first-visit splash. Skipped for the rest of the tab session via sessionStorage.
 * Short fade only — avoids blocking navigations after the initial load.
 */
export function LuxuryLoader() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setPhase("done");
      return;
    }
    const hide = window.setTimeout(() => setPhase("out"), 160);
    const remove = window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* private mode etc. */
      }
      setPhase("done");
    }, 260);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(remove);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-150 ease-out ${
        phase === "out" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden
    >
      <div className="text-center">
        <p className="font-heading text-4xl tracking-[0.35em] text-foreground md:text-5xl">
          MIETAAF
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">Atelier</p>
      </div>
    </div>
  );
}
