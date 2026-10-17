"use client";

import { useSyncExternalStore } from "react";
import { doc, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase/client";
import { lookbookSettingsSchema, type LookbookSettings } from "@/lib/lookbook";

type LookbookSnapshot = { settings: LookbookSettings | null; ready: boolean; error: boolean };
const initialSnapshot: LookbookSnapshot = { settings: null, ready: false, error: false };
let snapshot = initialSnapshot;
let unsubscribe: Unsubscribe | null = null;
const listeners = new Set<() => void>();

function publish(value: LookbookSnapshot) {
  snapshot = value;
  listeners.forEach((listener) => listener());
}

function startSync() {
  if (unsubscribe) return;
  const db = getFirebaseDb();
  if (!db) {
    if (!snapshot.ready) publish({ settings: null, ready: true, error: false });
    return;
  }
  if (snapshot.ready) publish({ ...snapshot, ready: false });
  unsubscribe = onSnapshot(doc(db, "settings", "lookbook"), (document) => {
    if (!document.exists()) {
      publish({ settings: null, ready: true, error: false });
      return;
    }
    const parsed = lookbookSettingsSchema.safeParse(document.data());
    publish(parsed.success ? { settings: parsed.data, ready: true, error: false } : { settings: snapshot.settings, ready: true, error: true });
  }, () => publish({ settings: snapshot.settings, ready: true, error: true }));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  startSync();
  return () => {
    listeners.delete(listener);
    if (!listeners.size && unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };
}

export function useLookbookSettings(): LookbookSnapshot {
  return useSyncExternalStore(subscribe, () => snapshot, () => initialSnapshot);
}
