import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseStorage } from "@/firebase/client";

/** Upload a file to Firebase Storage under `products/{path}`. Returns public URL or null. */
export async function uploadProductImage(file: File, path: string): Promise<string | null> {
  const storage = getFirebaseStorage();
  if (!storage) return null;
  const storageRef = ref(storage, `products/${path}`);
  await uploadBytes(storageRef, file, { contentType: file.type || "image/jpeg" });
  return getDownloadURL(storageRef);
}
