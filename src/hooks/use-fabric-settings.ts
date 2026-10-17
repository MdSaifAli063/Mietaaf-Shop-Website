"use client";

import { useSyncExternalStore } from "react";
import { doc, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase/client";
import { fabricSettingsSchema, type FabricSettings } from "@/lib/fabric-settings";

type FabricSnapshot = { settings: FabricSettings | null; ready: boolean; error: boolean };
const initialSnapshot: FabricSnapshot = { settings: null, ready: false, error: false };
let snapshot = initialSnapshot;
let unsubscribe: Unsubscribe | null = null;
const listeners = new Set<() => void>();
function publish(value: FabricSnapshot) { snapshot = value; listeners.forEach(listener => listener()); }
function startSync() {
  if (unsubscribe) return;
  const db = getFirebaseDb();
  if (!db) { if (!snapshot.ready) publish({ settings: null, ready: true, error: false }); return; }
  if (snapshot.ready) publish({ ...snapshot, ready: false });
  unsubscribe = onSnapshot(doc(db, "settings", "fabrics"), document => {
    if (!document.exists()) { publish({ settings: null, ready: true, error: false }); return; }
    const parsed = fabricSettingsSchema.safeParse(document.data());
    publish(parsed.success ? { settings: parsed.data, ready: true, error: false } : { settings: snapshot.settings, ready: true, error: true });
  }, () => publish({ settings: snapshot.settings, ready: true, error: true }));
}
function subscribe(listener: () => void) {
  listeners.add(listener); startSync();
  return () => { listeners.delete(listener); if (!listeners.size && unsubscribe) { unsubscribe(); unsubscribe = null; } };
}
export function useFabricSettings(): FabricSnapshot {
  return useSyncExternalStore(subscribe, () => snapshot, () => initialSnapshot);
}
