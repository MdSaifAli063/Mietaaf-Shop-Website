"use client";

import { useEffect, useState } from "react";

/**
 * Brief brand splash — kept short so first paint and interaction stay fast.
 * Pure CSS (no Framer) to avoid pulling motion into the layout chunk.
 */
export function LuxuryLoader() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const hide = window.setTimeout(() => setPhase("out"), 320);
    const remove = window.setTimeout(() => setPhase("done"), 520);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(remove);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-200 ease-out ${
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
