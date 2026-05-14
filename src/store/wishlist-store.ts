"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isShoppingOpen } from "@/lib/shopping-gate";
import toast from "react-hot-toast";

interface WishlistState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        if (!isShoppingOpen()) {
          toast.error("Sign in to use your wishlist.");
          return;
        }
        set({
          ids: get().ids.includes(id)
            ? get().ids.filter((x) => x !== id)
            : [...get().ids, id],
        });
      },
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: "mietaaf-wishlist" },
  ),
);
