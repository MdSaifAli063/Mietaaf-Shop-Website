"use client";

import { useSyncExternalStore } from "react";
import { SHOP_PRODUCTS } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";
import { BANNERS } from "@/lib/data/banners";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import type { PublicStorefront } from "@/lib/public-storefront";

type Snapshot = PublicStorefront & { ready: boolean; error: boolean };
const initial: Snapshot = { allProducts: SHOP_PRODUCTS, allCategories: CATEGORIES, allBanners: BANNERS, settings: DEFAULT_SITE_SETTINGS, logoUrl: null, ready: false, error: false };
let snapshot = initial;
const listeners = new Set<() => void>();
let controller: AbortController | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
let running = false;
function publish(value: Snapshot) { snapshot = value; listeners.forEach(listener => listener()); }
async function refresh() {
  if (running || document.visibilityState === "hidden" || !navigator.onLine) return;
  running = true;
  controller = new AbortController();
  const request = controller;
  const timeout = setTimeout(() => request.abort(), 12000);
  try {
    const response = await fetch("/api/storefront", { signal: request.signal });
    if (!response.ok) throw new Error("Catalogue unavailable");
    const data = await response.json() as PublicStorefront;
    if (!Array.isArray(data.allProducts) || !Array.isArray(data.allCategories) || !Array.isArray(data.allBanners) || !data.settings) throw new Error("Invalid catalogue");
    if (listeners.size) publish({ ...data, ready: true, error: false });
  } catch { if (listeners.size && !request.signal.aborted) publish({ ...snapshot, error: true }); }
  finally {
    clearTimeout(timeout); controller = null; running = false;
    if (listeners.size) { clearTimeout(timer); timer = setTimeout(() => void refresh(), 60000); }
  }
}
function wake() { if (document.visibilityState !== "hidden") void refresh(); }
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    // A small JSON request replaces several WebChannel connections on public pages.
    void refresh(); window.addEventListener("online", wake); window.addEventListener("focus", wake); document.addEventListener("visibilitychange", wake);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) { clearTimeout(timer); controller?.abort(); window.removeEventListener("online", wake); window.removeEventListener("focus", wake); document.removeEventListener("visibilitychange", wake); }
  };
}
export function usePublicStorefront() { return useSyncExternalStore(subscribe, () => snapshot, () => initial); }
