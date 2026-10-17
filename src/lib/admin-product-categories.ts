import type { Category, Product } from "@/types";

export type AdminProductGroup = {
  slug: string;
  name: string;
  products: Product[];
  visible: number;
};

/** Use the saved category slug, rather than display names or promotional tags. */
export function groupAdminProducts(products: Product[], categories: Category[]): AdminProductGroup[] {
  const groups = new Map<string, AdminProductGroup>();
  for (const category of categories) {
    groups.set(category.slug, { slug: category.slug, name: category.name, products: [], visible: 0 });
  }
  for (const product of products) {
    const slug = product.categorySlug || "";
    let group = groups.get(slug);
    if (!group) {
      // Keep records whose category was removed accessible for reassignment.
      group = { slug, name: slug ? product.category || slug : "Unassigned products", products: [], visible: 0 };
      groups.set(slug, group);
    }
    group.products.push(product);
    if (!product.hidden && !product.deleted) group.visible += 1;
  }
  return Array.from(groups.values());
}

export function adminCategoryProductsHref(slug: string) {
  if (slug === "wedding-collection") return "/admin/wedding";
  if (slug === "premium-collection") return "/admin/premium";
  return slug ? `/admin/categories/${encodeURIComponent(slug)}` : "/admin/products/unassigned";
}
