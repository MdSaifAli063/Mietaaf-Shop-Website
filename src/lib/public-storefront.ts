import type { Banner, Category, Product, SiteSettings } from "@/types";

export type PublicStorefront = {
  allProducts: Product[]; allCategories: Category[]; allBanners: Banner[];
  settings: SiteSettings; logoUrl: string | null;
};
/** Preserve local records and admin tombstones, as the former public listeners did. */
export function mergeStorefrontRecords<T>(local: T[], remote: T[], key: (item: T) => string): T[] {
  const merged = new Map(local.map(item => [key(item), item]));
  for (const item of remote) {
    const previous = merged.get(key(item));
    merged.set(key(item), previous ? { ...previous, ...item } : item);
  }
  return [...merged.values()];
}
