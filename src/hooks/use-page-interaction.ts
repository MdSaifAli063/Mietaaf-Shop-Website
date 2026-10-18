"use client";

import { useEffect, useState } from "react";

/** Keep automatic content changes out of the initial reading/loading experience. */
export function usePageInteraction(): boolean {
  const [interacted, setInteracted] = useState(false);
  useEffect(() => {
    const mark = () => setInteracted(true);
    const events = ["pointerdown", "keydown", "scroll"] as const;
    events.forEach(event => window.addEventListener(event, mark, { once: true, passive: true }));
    return () => events.forEach(event => window.removeEventListener(event, mark));
  }, []);
  return interacted;
}
