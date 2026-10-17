import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase/client";
import { lookbookSettingsSchema, type LookbookSettings } from "@/lib/lookbook";

export async function saveLookbookSettings(settings: LookbookSettings): Promise<void> {
  const value = lookbookSettingsSchema.parse(settings);
  const db = getFirebaseDb();
  if (!db) throw new Error("The lookbook could not be saved. Please try again.");
  // The existing settings rules allow public reads and admin-claim writes only.
  await setDoc(doc(db, "settings", "lookbook"), { ...value, updatedAt: serverTimestamp() }, { merge: true });
}
