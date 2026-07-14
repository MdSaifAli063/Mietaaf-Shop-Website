import { useEffect, useState } from "react";
import { getProducts } from "@/services/products";
import { getCategories } from "@/services/categories";
import { getBanners } from "@/services/banners";
import { DUMMY_PRODUCTS } from "@/lib/data/products";
import { CATEGORIES as DUMMY_CATEGORIES } from "@/lib/data/categories";
import { BANNERS as DUMMY_BANNERS } from "@/lib/data/banners";
import { getFirebaseDb } from "@/firebase/client";
import type { Product, Category, Banner } from "@/types";

export function useShopData() {
  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DUMMY_CATEGORIES);
  const [banners, setBanners] = useState<Banner[]>(DUMMY_BANNERS);
  const [loading, setLoading] = useState(true);
  const db = getFirebaseDb();

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const [prod, cat, ban] = await Promise.all([
          getProducts(),
          getCategories(),
          getBanners(),
        ]);
        if (prod.length > 0) setProducts(prod);
        if (cat.length > 0) setCategories(cat);
        if (ban.length > 0) setBanners(ban);
      } catch (err) {
        console.error("Error loading remote shop data", err);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [db]);

  return { products, categories, banners, loading };
}
