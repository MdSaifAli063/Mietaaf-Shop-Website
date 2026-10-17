import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  deleteField,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { getFirebaseDb, getFirebaseStorage } from "@/firebase/client";
import { uploadStorageImage } from "@/services/storage-image-upload";
import type { Product } from "@/types";

const COLLECTION_NAME = "products";

export async function getProducts(): Promise<Product[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = getFirebaseDb();
  if (!db) return null;
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Product;
}

export async function createProduct(productData: Omit<Product, "id">): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase DB not initialized");
  // Use slug as the document ID if available, otherwise let Firestore generate it.
  // Using custom ID makes routing and URLs much cleaner.
  const docRef = productData.slug ? doc(db, COLLECTION_NAME, productData.slug) : doc(collection(db, COLLECTION_NAME));
  await setDoc(docRef, {
    ...Object.fromEntries(Object.entries(productData).filter(([, value]) => value !== undefined)),
    id: docRef.id,
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = doc(db, COLLECTION_NAME, id);
  // Optional pricing fields can be empty in the editor. Firestore rejects
  // undefined values; use explicit field deletion when clearing an old price.
  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(productData)) {
    if (value !== undefined) fields[key] = value;
    else if (key === "compareAtPrice" || key === "discountPercent") fields[key] = deleteField();
  }
  await setDoc(docRef, {
    ...fields,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function deleteProduct(id: string, imageUrls?: string[]): Promise<void> {
  const db = getFirebaseDb();
  const storage = getFirebaseStorage();
  if (!db) throw new Error("Firebase DB not initialized");

  if (storage && imageUrls && imageUrls.length > 0) {
    for (const url of imageUrls) {
      try {
        const imageRef = ref(storage, url);
        await deleteObject(imageRef);
      } catch (err) {
        console.warn("Failed to delete image", url, err);
      }
    }
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

export async function uploadProductImage(
  file: File,
  onProgress?: (percentage: number) => void,
): Promise<string> {
  return uploadStorageImage({
    file,
    folder: "products",
    maxBytes: 5 * 1024 * 1024,
    onProgress,
  });
}
