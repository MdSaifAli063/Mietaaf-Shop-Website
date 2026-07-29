"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase/client";
import { SHOP_PRODUCTS } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";
import { BANNERS } from "@/lib/data/banners";
import type { Banner, Category, Product } from "@/types";

function mergeAll<T>(
  local: T[],
  remote: T[],
  key: (item: T) => string,
): T[] {
  const merged = new Map(local.map((item) => [key(item), item]));
  remote.forEach((item) => {
    const existing = merged.get(key(item));
    merged.set(key(item), existing ? { ...existing, ...item } : item);
  });
  return Array.from(merged.values());
}

export function useAdminShopData() {
  const [remoteProducts, setRemoteProducts] = useState<Product[]>([]);
  const [remoteCategories, setRemoteCategories] = useState<Category[]>([]);
  const [remoteBanners, setRemoteBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db) return;
    const unsubscribers = [
      onSnapshot(collection(db, "products"), (snapshot) => {
        setRemoteProducts(
          snapshot.docs.map((entry) => ({
            id: entry.id,
            ...entry.data(),
          })) as Product[],
        );
      }),
      onSnapshot(collection(db, "categories"), (snapshot) => {
        setRemoteCategories(snapshot.docs.map((entry) => entry.data()) as Category[]);
      }),
      onSnapshot(collection(db, "banners"), (snapshot) => {
        setRemoteBanners(
          snapshot.docs.map((entry) => ({
            id: entry.id,
            ...entry.data(),
          })) as Banner[],
        );
      }),
    ];
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  const products = useMemo(
    () => mergeAll(SHOP_PRODUCTS, remoteProducts, (item) => item.slug),
    [remoteProducts],
  );
  const categories = useMemo(
    () => mergeAll(CATEGORIES, remoteCategories, (item) => item.slug),
    [remoteCategories],
  );
  const banners = useMemo(
    () => mergeAll(BANNERS, remoteBanners, (item) => item.id),
    [remoteBanners],
  );

  return { products, categories, banners };
}
