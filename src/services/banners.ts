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
import type { Banner } from "@/types";

const COLLECTION_NAME = "banners";

export async function getBanners(): Promise<Banner[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Banner[];
}

export async function getBannerById(id: string): Promise<Banner | null> {
  const db = getFirebaseDb();
  if (!db) return null;
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Banner;
}

export async function createBanner(bannerData: Omit<Banner, "id">): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase DB not initialized");
  
  const docRef = doc(collection(db, COLLECTION_NAME));
  await setDoc(docRef, {
    ...bannerData,
    id: docRef.id,
    createdAt: serverTimestamp(),
  });
}

export async function updateBanner(id: string, bannerData: Partial<Banner>): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...bannerData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBanner(id: string, imageUrl?: string): Promise<void> {
  const db = getFirebaseDb();
  const storage = getFirebaseStorage();
  if (!db) throw new Error("Firebase DB not initialized");

  if (storage && imageUrl) {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (err) {
      console.warn("Failed to delete banner image", imageUrl, err);
    }
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

export async function uploadBannerImage(file: File): Promise<string> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("Firebase Storage not initialized");
  const filename = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `banners/${filename}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
