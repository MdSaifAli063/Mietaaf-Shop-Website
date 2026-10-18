"use client";

import { useMemo } from "react";
import { usePublicStorefront } from "@/hooks/use-public-storefront";

export function useSiteSettings() {
  const { settings, ready } = usePublicStorefront();
  return useMemo(() => ({ settings, loading: !ready }), [settings, ready]);
}
