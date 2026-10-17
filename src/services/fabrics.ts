import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase/client";
import { fabricSettingsSchema, type FabricSettings } from "@/lib/fabric-settings";
import { uploadStorageImage } from "@/services/storage-image-upload";

export async function saveFabricSettings(settings: FabricSettings): Promise<void> {
  const value = fabricSettingsSchema.parse(settings);
  const db = getFirebaseDb();
  if (!db) throw new Error("The fabric library could not be saved. Please try again.");
  // Existing settings rules permit writes only with a secure admin claim.
  await setDoc(doc(db, "settings", "fabrics"), { ...JSON.parse(JSON.stringify(value)), updatedAt: serverTimestamp() }, { merge: true });
}
export async function uploadFabricImage(file: File, onProgress?: (percentage: number) => void): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp", "image/avif"].includes(file.type)) throw new Error("Choose a PNG, JPG, WebP or AVIF image.");
  // This subfolder is covered by the existing products/{allPaths=**} admin rules.
  return uploadStorageImage({ file, folder: "products/fabrics", maxBytes: 5 * 1024 * 1024, onProgress });
}
