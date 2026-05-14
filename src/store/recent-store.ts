"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentState {
  slugs: string[];
  push: (slug: string) => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set, get) => ({
      slugs: [],
      push: (slug) => {
        const next = [slug, ...get().slugs.filter((s) => s !== slug)].slice(0, 12);
        set({ slugs: next });
      },
    }),
    { name: "mietaaf-recent" },
  ),
);
