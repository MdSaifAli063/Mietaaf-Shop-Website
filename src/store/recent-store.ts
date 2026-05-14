"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isShoppingOpen } from "@/lib/shopping-gate";

interface RecentState {
  slugs: string[];
  push: (slug: string) => void;
  clear: () => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set, get) => ({
      slugs: [],
      push: (slug) => {
        if (!isShoppingOpen()) return;
        const next = [slug, ...get().slugs.filter((s) => s !== slug)].slice(0, 12);
        set({ slugs: next });
      },
      clear: () => set({ slugs: [] }),
    }),
    { name: "mietaaf-recent" },
  ),
);
