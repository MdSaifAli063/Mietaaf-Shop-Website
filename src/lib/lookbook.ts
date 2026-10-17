import { z } from "zod";
import type { Product } from "@/types";

export const MAX_LOOKBOOK_ITEMS = 48;
export const lookbookSettingsSchema = z.object({
  productSlugs: z.array(z.string().trim().min(1).max(180))
    .max(MAX_LOOKBOOK_ITEMS)
    .refine((slugs) => new Set(slugs).size === slugs.length, "Each product can appear only once."),
});
export type LookbookSettings = z.infer<typeof lookbookSettingsSchema>;

export function defaultLookbookSlugs(products: Product[]): string[] {
  return products.filter((product) => !product.hidden && !product.deleted).slice(0, 8).map((product) => product.slug);
}

export function selectLookbookProducts(products: Product[], settings: LookbookSettings | null): Product[] {
  const bySlug = new Map(products.filter((product) => !product.hidden && !product.deleted).map((product) => [product.slug, product]));
  const slugs = settings ? settings.productSlugs : defaultLookbookSlugs(products);
  return Array.from(new Set(slugs)).flatMap((slug) => {
    const product = bySlug.get(slug);
    return product ? [product] : [];
  });
}
