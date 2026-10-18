"use client";

import { useSyncExternalStore } from "react";
import type { FabricSettings } from "@/lib/fabric-settings";
import type { LookbookSettings } from "@/lib/lookbook";

type Settings = { fabrics: FabricSettings; lookbook: LookbookSettings };
type Snapshot<T> = { settings: T | null; ready: boolean; error: boolean };
function createStore<K extends keyof Settings>(name: K) {
  const initial: Snapshot<Settings[K]> = { settings: null, ready: false, error: false };
  let snapshot = initial;
  const listeners = new Set<() => void>();
  let controller: AbortController | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let running = false;
  async function refresh() {
    if (running || document.visibilityState === "hidden" || !navigator.onLine) return;
    running = true; controller = new AbortController();
    const request = controller;
    const timeout = setTimeout(() => request.abort(), 12000);
    try {
      const response = await fetch(`/api/public-settings/${name}`, { signal: request.signal });
      if (!response.ok) throw new Error("Settings unavailable");
      const result = await response.json() as { data: Settings[K] | null };
      if (!("data" in result)) throw new Error("Invalid settings");
      if (listeners.size) snapshot = { settings: result.data, ready: true, error: false };
    } catch { if (listeners.size) snapshot = { ...snapshot, ready: true, error: true }; }
    finally {
      clearTimeout(timeout); controller = null; running = false;
      if (listeners.size) { listeners.forEach(listener => listener()); clearTimeout(timer); timer = setTimeout(() => void refresh(), 60000); }
    }
  }
  const wake = () => { void refresh(); };
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) { void refresh(); window.addEventListener("online", wake); window.addEventListener("focus", wake); document.addEventListener("visibilitychange", wake); }
      return () => { listeners.delete(listener); if (!listeners.size) { clearTimeout(timer); controller?.abort(); window.removeEventListener("online", wake); window.removeEventListener("focus", wake); document.removeEventListener("visibilitychange", wake); } };
    },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => initial,
  };
}
const fabrics = createStore("fabrics"), lookbook = createStore("lookbook");
export function usePublicFabricSettings() { return useSyncExternalStore(fabrics.subscribe, fabrics.getSnapshot, fabrics.getServerSnapshot); }
export function usePublicLookbookSettings() { return useSyncExternalStore(lookbook.subscribe, lookbook.getSnapshot, lookbook.getServerSnapshot); }
