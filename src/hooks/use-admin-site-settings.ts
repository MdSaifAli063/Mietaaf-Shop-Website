"use client";

import { useSyncExternalStore } from "react";
import { doc, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase/client";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import type { SiteSettings } from "@/types";

type SettingsSnapshot = { settings: SiteSettings; loading: boolean; error: boolean };

const defaultSnapshot: SettingsSnapshot = {
  settings: DEFAULT_SITE_SETTINGS,
  loading: true,
  error: false,
};
let currentSnapshot = defaultSnapshot;
let unsubscribe: Unsubscribe | null = null;
let connectionTimeout: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function startSync() {
  if (unsubscribe) return;
  currentSnapshot = { ...currentSnapshot, loading: true, error: false };
  const db = getFirebaseDb();
  if (!db) { currentSnapshot = { ...currentSnapshot, loading: false, error: true }; return; }
  connectionTimeout = setTimeout(() => { currentSnapshot = { ...currentSnapshot, loading: false, error: true }; listeners.forEach(listener => listener()); }, 10000);
  unsubscribe = onSnapshot(
    doc(db, "settings", "site"),
    { includeMetadataChanges: true },
    (snapshot) => {
      if (snapshot.metadata?.fromCache) return;
      clearTimeout(connectionTimeout);
      currentSnapshot = {
        settings: {
          ...DEFAULT_SITE_SETTINGS,
          ...(snapshot.exists() ? (snapshot.data() as Partial<SiteSettings>) : {}),
        },
        loading: false,
        error: false,
      };
      listeners.forEach((listener) => listener());
    },
    () => { clearTimeout(connectionTimeout); currentSnapshot = { ...currentSnapshot, loading: false, error: true }; listeners.forEach(listener => listener()); },
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  startSync();
  return () => { listeners.delete(listener); if (!listeners.size && unsubscribe) { unsubscribe(); clearTimeout(connectionTimeout); unsubscribe = null; } };
}

export function useAdminSiteSettings(): SettingsSnapshot {
  return useSyncExternalStore(
    subscribe,
    () => currentSnapshot,
    () => defaultSnapshot,
  );
}
