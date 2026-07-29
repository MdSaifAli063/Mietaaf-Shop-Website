import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase/client";
import type { SiteSettings } from "@/types";

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase DB not initialized");
  await setDoc(
    doc(db, "settings", "site"),
    { ...settings, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
