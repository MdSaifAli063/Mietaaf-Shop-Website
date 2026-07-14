"use client";

import Image from "next/image";
import { useLayoutEffect, useState } from "react";
import { SITE_LOGO_URL } from "@/lib/site-logo";

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
      <div className="relative h-[6.5rem] w-[min(86vw,520px)] sm:h-[7.5rem] sm:w-[min(76vw,600px)] lg:h-[8.5rem] lg:w-[min(64vw,680px)]">
        <Image
          src={SITE_LOGO_URL}
          alt="Mietaaf"
          fill
          priority
          unoptimized
          sizes="(max-width: 640px) 420px, 680px"
          className="animate-[logo-pop_750ms_cubic-bezier(0.16,1,0.3,1)] object-contain drop-shadow-[0_6px_24px_rgba(15,23,42,0.22)]"
        />
      </div>
    </div>
  );
}
