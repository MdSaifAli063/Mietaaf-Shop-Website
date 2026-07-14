import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirebaseDb, getFirebaseStorage } from "@/firebase/client";
import type { Category } from "@/types";

const COLLECTION_NAME = "categories";

export async function getCategories(): Promise<Category[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data()) as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = getFirebaseDb();
  if (!db) return null;
  const docRef = doc(db, COLLECTION_NAME, slug);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return snapshot.data() as Category;
}

export async function createCategory(categoryData: Category): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase DB not initialized");
  
  const docRef = doc(db, COLLECTION_NAME, categoryData.slug);
  await setDoc(docRef, {
    ...categoryData,
    createdAt: serverTimestamp(),
  });
}

export async function updateCategory(slug: string, categoryData: Partial<Category>): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = doc(db, COLLECTION_NAME, slug);
  await updateDoc(docRef, {
    ...categoryData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(slug: string, imageUrl?: string): Promise<void> {
  const db = getFirebaseDb();
  const storage = getFirebaseStorage();
  if (!db) throw new Error("Firebase DB not initialized");

  if (storage && imageUrl) {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (err) {
      console.warn("Failed to delete category image", imageUrl, err);
    }
  }

  const docRef = doc(db, COLLECTION_NAME, slug);
  await deleteDoc(docRef);
}

export async function uploadCategoryImage(file: File): Promise<string> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("Firebase Storage not initialized");
  const filename = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `categories/${filename}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
