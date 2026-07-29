"use client";

import { useSyncExternalStore } from "react";
import { doc, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase/client";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import type { SiteSettings } from "@/types";

type SettingsSnapshot = { settings: SiteSettings; loading: boolean };

const defaultSnapshot: SettingsSnapshot = {
  settings: DEFAULT_SITE_SETTINGS,
  loading: false,
};
let currentSnapshot = defaultSnapshot;
let unsubscribe: Unsubscribe | null = null;
const listeners = new Set<() => void>();

function startSync() {
  if (unsubscribe) return;
  const db = getFirebaseDb();
  if (!db) return;
  unsubscribe = onSnapshot(
    doc(db, "settings", "site"),
    (snapshot) => {
      currentSnapshot = {
        settings: {
          ...DEFAULT_SITE_SETTINGS,
          ...(snapshot.exists() ? (snapshot.data() as Partial<SiteSettings>) : {}),
        },
        loading: false,
      };
      listeners.forEach((listener) => listener());
    },
    () => undefined,
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  startSync();
  return () => listeners.delete(listener);
}

export function useSiteSettings(): SettingsSnapshot {
  return useSyncExternalStore(
    subscribe,
    () => currentSnapshot,
    () => defaultSnapshot,
  );
}
