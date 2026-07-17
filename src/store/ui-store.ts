"use client";

import { create } from "zustand";

interface UiState {
  searchOpen: boolean;
  quickViewSlug: string | null;
  quickViewImage: string | null;
  navOpen: boolean;
  loadingRoute: boolean;
  setSearchOpen: (v: boolean) => void;
  setQuickView: (slug: string | null, image?: string) => void;
  setNavOpen: (v: boolean) => void;
  setLoadingRoute: (v: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  searchOpen: false,
  quickViewSlug: null,
  quickViewImage: null,
  navOpen: false,
  loadingRoute: false,
  setSearchOpen: (v) => set({ searchOpen: v }),
  setQuickView: (slug, image) =>
    set({
      quickViewSlug: slug,
      quickViewImage: slug ? (image ?? null) : null,
    }),
  setNavOpen: (v) => set({ navOpen: v }),
  setLoadingRoute: (v) => set({ loadingRoute: v }),
}));
