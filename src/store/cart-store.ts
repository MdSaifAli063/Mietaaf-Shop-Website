"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
}

function lineKey(i: Pick<CartItem, "productId" | "size" | "color">): string {
  return `${i.productId}__${i.size}__${i.color}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const key = lineKey(item);
        const existing = get().items.find(
          (x) => lineKey(x) === key,
        );
        if (existing) {
          set({
            items: get().items.map((x) =>
              lineKey(x) === key
                ? { ...x, quantity: x.quantity + item.quantity }
                : x,
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (key) => {
        set({ items: get().items.filter((x) => lineKey(x) !== key) });
      },
      updateQty: (key, qty) => {
        if (qty < 1) {
          set({ items: get().items.filter((x) => lineKey(x) !== key) });
          return;
        }
        set({
          items: get().items.map((x) =>
            lineKey(x) === key ? { ...x, quantity: qty } : x,
          ),
        });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "mietaaf-cart",
      skipHydration: true,
    },
  ),
);

export { lineKey as cartLineKey };
