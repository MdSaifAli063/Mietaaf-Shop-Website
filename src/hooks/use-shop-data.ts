"use client";

import { useSyncExternalStore } from "react";
import { collection, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { SHOP_PRODUCTS } from "@/lib/data/products";
import { CATEGORIES as DUMMY_CATEGORIES } from "@/lib/data/categories";
import { BANNERS as DUMMY_BANNERS } from "@/lib/data/banners";
import { getFirebaseDb } from "@/firebase/client";
import type { Product, Category, Banner } from "@/types";

type ShopSnapshot = {
  products: Product[];
  allProducts: Product[];
  categories: Category[];
  allCategories: Category[];
  banners: Banner[];
  allBanners: Banner[];
  loading: boolean;
};

function mergeManagedRecords<T>(
  local: T[],
  remote: T[],
  key: (item: T) => string,
): T[] {
  const merged = new Map(local.map((item) => [key(item), item]));
  for (const item of remote) {
    const itemKey = key(item);
    const fallback = merged.get(itemKey);
    merged.set(itemKey, fallback ? { ...fallback, ...item } : item);
  }
  return Array.from(merged.values());
}

const localSnapshot: ShopSnapshot = {
  products: SHOP_PRODUCTS,
  allProducts: SHOP_PRODUCTS,
  categories: DUMMY_CATEGORIES,
  allCategories: DUMMY_CATEGORIES,
  banners: DUMMY_BANNERS,
  allBanners: DUMMY_BANNERS,
  loading: false,
};

let currentSnapshot = localSnapshot;
let remoteProducts: Product[] = [];
let remoteCategories: Category[] = [];
let remoteBanners: Banner[] = [];
let firestoreUnsubscribers: Unsubscribe[] | null = null;
const listeners = new Set<() => void>();

function publish() {
  const allProducts = mergeManagedRecords(
    SHOP_PRODUCTS,
    remoteProducts,
    (item) => item.slug,
  );
  const allCategories = mergeManagedRecords(
    DUMMY_CATEGORIES,
    remoteCategories,
    (item) => item.slug,
  );
  const allBanners = mergeManagedRecords(
    DUMMY_BANNERS,
    remoteBanners,
    (item) => item.id,
  );
  const visible = <T extends { hidden?: boolean; deleted?: boolean }>(items: T[]) =>
    items.filter((item) => item.hidden !== true && item.deleted !== true);
  currentSnapshot = {
    products: visible(allProducts),
    allProducts,
    categories: visible(allCategories),
    allCategories,
    banners: visible(allBanners),
    allBanners,
    loading: false,
  };
  listeners.forEach((listener) => listener());
}

function startFirestoreSync() {
  if (firestoreUnsubscribers) return;
  const db = getFirebaseDb();
  if (!db) return;

  firestoreUnsubscribers = [
    onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        remoteProducts = snapshot.docs.map((entry) => ({
          id: entry.id,
          ...entry.data(),
        })) as Product[];
        publish();
      },
      () => undefined,
    ),
    onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        remoteCategories = snapshot.docs.map((entry) => entry.data()) as Category[];
        publish();
      },
      () => undefined,
    ),
    onSnapshot(
      collection(db, "banners"),
      (snapshot) => {
        remoteBanners = snapshot.docs.map((entry) => ({
          id: entry.id,
          ...entry.data(),
        })) as Banner[];
        publish();
      },
      () => undefined,
    ),
  ];
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  startFirestoreSync();
  return () => listeners.delete(listener);
}

export function useShopData(): ShopSnapshot {
  return useSyncExternalStore(
    subscribe,
    () => currentSnapshot,
    () => localSnapshot,
  );
}
