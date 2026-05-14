"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { isShoppingOpen } from "@/lib/shopping-gate";

interface CompareState {
  slugs: string[];
  max: number;
  add: (slug: string) => boolean;
  remove: (slug: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      slugs: [],
      max: 4,
      add: (slug) => {
        if (!isShoppingOpen()) {
          toast.error("Sign in to compare products.");
          return false;
        }
        const { slugs, max } = get();
        if (slugs.includes(slug)) return true;
        if (slugs.length >= max) return false;
        set({ slugs: [...slugs, slug] });
        return true;
      },
      remove: (slug) =>
        set({ slugs: get().slugs.filter((s) => s !== slug) }),
      clear: () => set({ slugs: [] }),
    }),
    { name: "mietaaf-compare" },
  ),
);
