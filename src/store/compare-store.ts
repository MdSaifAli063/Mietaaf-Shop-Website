"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareState {
  slugs: string[];
  images: Record<string, string>;
  max: number;
  add: (slug: string, image?: string) => boolean;
  remove: (slug: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      slugs: [],
      images: {},
      max: 4,
      add: (slug, image) => {
        const { slugs, images, max } = get();
        if (slugs.includes(slug)) {
          if (image) set({ images: { ...images, [slug]: image } });
          return true;
        }
        if (slugs.length >= max) return false;
        set({
          slugs: [...slugs, slug],
          images: image ? { ...images, [slug]: image } : images,
        });
        return true;
      },
      remove: (slug) => {
        const nextImages = { ...get().images };
        delete nextImages[slug];
        set({
          slugs: get().slugs.filter((s) => s !== slug),
          images: nextImages,
        });
      },
      clear: () => set({ slugs: [], images: {} }),
    }),
    {
      name: "mietaaf-compare",
      skipHydration: true,
    },
  ),
);
