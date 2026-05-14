"use client";

import { create } from "zustand";

interface UiState {
  searchOpen: boolean;
  quickViewSlug: string | null;
  navOpen: boolean;
  loadingRoute: boolean;
  setSearchOpen: (v: boolean) => void;
  setQuickView: (slug: string | null) => void;
  setNavOpen: (v: boolean) => void;
  setLoadingRoute: (v: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  searchOpen: false,
  quickViewSlug: null,
  navOpen: false,
  loadingRoute: false,
  setSearchOpen: (v) => set({ searchOpen: v }),
  setQuickView: (slug) => set({ quickViewSlug: slug }),
  setNavOpen: (v) => set({ navOpen: v }),
  setLoadingRoute: (v) => set({ loadingRoute: v }),
}));
