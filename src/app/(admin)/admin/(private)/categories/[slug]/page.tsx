import { ProductManager } from "@/components/admin/product-manager";
import { redirect } from "next/navigation";
import { adminCategoryProductsHref } from "@/lib/admin-product-categories";

export default async function AdminCategoryProductsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "wedding-collection" || slug === "premium-collection") redirect(adminCategoryProductsHref(slug));
  return <ProductManager key={slug} categorySlug={slug} />;
}
