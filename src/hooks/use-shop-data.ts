import { useEffect, useState } from "react";
import { getProducts } from "@/services/products";
import { getCategories } from "@/services/categories";
import { getBanners } from "@/services/banners";
import { DUMMY_PRODUCTS } from "@/lib/data/products";
import { CATEGORIES as DUMMY_CATEGORIES } from "@/lib/data/categories";
import { BANNERS as DUMMY_BANNERS } from "@/lib/data/banners";
import { getFirebaseDb } from "@/firebase/client";
import type { Product, Category, Banner } from "@/types";

type RemoteShopData = {
  products: Product[];
  categories: Category[];
  banners: Banner[];
};

let remoteShopDataPromise: Promise<RemoteShopData> | null = null;

/**
 * The storefront is local-first. Firestore content is an optional enhancement,
 * so a stale deployment of security rules must never break or flood the console.
 * One shared request also avoids React development mode loading every collection twice.
 */
function loadRemoteShopData(): Promise<RemoteShopData> {
  if (!remoteShopDataPromise) {
    remoteShopDataPromise = Promise.allSettled([
      getProducts(),
      getCategories(),
      getBanners(),
    ]).then(([products, categories, banners]) => ({
      products: products.status === "fulfilled" ? products.value : [],
      categories: categories.status === "fulfilled" ? categories.value : [],
      banners: banners.status === "fulfilled" ? banners.value : [],
    }));
  }
  return remoteShopDataPromise;
}

export function useShopData() {
  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DUMMY_CATEGORIES);
  const [banners, setBanners] = useState<Banner[]>(DUMMY_BANNERS);
  const loading = false;
  const db = getFirebaseDb();

  useEffect(() => {
    if (!db) return;
    let active = true;

    async function load() {
      const remote = await loadRemoteShopData();
      if (!active) return;
      if (remote.products.length > 0) setProducts(remote.products);
      if (remote.categories.length > 0) setCategories(remote.categories);
      if (remote.banners.length > 0) setBanners(remote.banners);
    }

    void load();
    return () => {
      active = false;
    };
  }, [db]);

  return { products, categories, banners, loading };
}
