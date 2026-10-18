"use client";

import { useMemo } from "react";
import { usePublicStorefront } from "@/hooks/use-public-storefront";

export function useShopData() {
  const snapshot = usePublicStorefront();
  return useMemo(() => ({
    allProducts: snapshot.allProducts, allCategories: snapshot.allCategories, allBanners: snapshot.allBanners,
    products: snapshot.allProducts.filter(item => !item.hidden && !item.deleted),
    categories: snapshot.allCategories.filter(item => !item.hidden && !item.deleted),
    banners: snapshot.allBanners.filter(item => !item.hidden && !item.deleted),
    loading: false, productsSynced: snapshot.ready, categoriesSynced: snapshot.ready,
  }), [snapshot]);
}
