"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  images: Record<string, string>;
  toggle: (id: string, image?: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      images: {},
      toggle: (id, image) => {
        const isSaved = get().ids.includes(id);
        const nextImages = { ...get().images };

        if (isSaved) {
          delete nextImages[id];
        } else if (image) {
          nextImages[id] = image;
        }

        set({
          ids: isSaved ? get().ids.filter((x) => x !== id) : [...get().ids, id],
          images: nextImages,
        });
      },
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [], images: {} }),
    }),
    {
      name: "mietaaf-wishlist",
      skipHydration: true,
    },
  ),
);
