"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentState {
  slugs: string[];
  images: Record<string, string>;
  push: (slug: string, image?: string) => void;
  clear: () => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set, get) => ({
      slugs: [],
      images: {},
      push: (slug, image) => {
        const next = [slug, ...get().slugs.filter((s) => s !== slug)].slice(0, 12);
        const nextImages = Object.fromEntries(
          Object.entries({ ...get().images, ...(image ? { [slug]: image } : {}) }).filter(
            ([savedSlug]) => next.includes(savedSlug),
          ),
        );
        set({ slugs: next, images: nextImages });
      },
      clear: () => set({ slugs: [], images: {} }),
    }),
    {
      name: "mietaaf-recent",
      skipHydration: true,
    },
  ),
);
