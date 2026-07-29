import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  deleteObject,
} from "firebase/storage";
import { getFirebaseDb, getFirebaseStorage } from "@/firebase/client";
import { uploadStorageImage } from "@/services/storage-image-upload";
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
  await setDoc(docRef, {
    ...bannerData,
    updatedAt: serverTimestamp(),
  }, { merge: true });
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

const MAX_BANNER_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_BANNER_SOURCE_BYTES = 25 * 1024 * 1024;

async function optimizeBannerImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose a valid JPG, PNG, WebP, or AVIF image.");
  }
  if (file.size > MAX_BANNER_SOURCE_BYTES) {
    throw new Error("The selected image is larger than 25 MB.");
  }

  // Small images do not benefit enough from browser recompression.
  if (file.size <= 2 * 1024 * 1024 || file.type === "image/svg+xml") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2400 / bitmap.width, 1600 / bitmap.height);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image processing is unavailable.");
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", 0.86);
    });
    if (!blob) throw new Error("The image could not be optimized.");

    const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-");
    return new File([blob], `${baseName || "banner"}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch {
    // Browsers without bitmap/canvas support can still upload an already-valid file.
    return file;
  }
}

export async function uploadBannerImage(
  sourceFile: File,
  onProgress?: (percentage: number) => void,
): Promise<string> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("Firebase Storage not initialized");
  const file = await optimizeBannerImage(sourceFile);
  if (file.size > MAX_BANNER_UPLOAD_BYTES) {
    throw new Error("The optimized banner is still larger than 8 MB. Choose a smaller image.");
  }

  return uploadStorageImage({
    file,
    folder: "banners",
    maxBytes: MAX_BANNER_UPLOAD_BYTES,
    onProgress,
  });
}
