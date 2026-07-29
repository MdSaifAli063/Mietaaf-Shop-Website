"use client";

import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { getFirebaseStorage } from "@/firebase/client";

type UploadStorageImageOptions = {
  file: File;
  folder: "products" | "categories" | "banners";
  maxBytes: number;
  timeoutMs?: number;
  onProgress?: (percentage: number) => void;
};

export async function uploadStorageImage({
  file,
  folder,
  maxBytes,
  timeoutMs = 60_000,
  onProgress,
}: UploadStorageImageOptions): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose a valid image file.");
  }
  if (file.size > maxBytes) {
    throw new Error(`The image must be smaller than ${Math.floor(maxBytes / 1024 / 1024)} MB.`);
  }

  const storage = getFirebaseStorage();
  if (!storage) throw new Error("Firebase Storage is not configured.");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const storageRef = ref(storage, `${folder}/${Date.now()}-${safeName}`);
  const task = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    cacheControl: "public,max-age=31536000,immutable",
  });

  await new Promise<void>((resolve, reject) => {
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      task.cancel();
      reject(new Error("Upload timed out. Check your connection and Firebase Storage rules."));
    }, timeoutMs);

    task.on(
      "state_changed",
      (snapshot) => {
        const percentage = snapshot.totalBytes
          ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          : 0;
        onProgress?.(percentage);
      },
      (error) => {
        window.clearTimeout(timeout);
        reject(
          timedOut
            ? new Error("Upload timed out. Check your connection and Firebase Storage rules.")
            : error,
        );
      },
      () => {
        window.clearTimeout(timeout);
        onProgress?.(100);
        resolve();
      },
    );
  });

  return getDownloadURL(task.snapshot.ref);
}
