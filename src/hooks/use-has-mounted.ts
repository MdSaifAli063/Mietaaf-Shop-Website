"use client";

import { useEffect, useState } from "react";

/**
 * Keeps the server render and the browser's first render identical.
 * Useful for UI derived from localStorage-backed Zustand stores.
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
