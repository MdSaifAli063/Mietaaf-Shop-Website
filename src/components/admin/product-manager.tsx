"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Eye,
  EyeOff,
  ImagePlus,
  LoaderCircle,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import type { CategorySlug, Product } from "@/types";
import { useAdminShopData } from "@/hooks/use-admin-shop-data";
import { createProduct, deleteProduct, updateProduct, uploadProductImage } from "@/services/products";
import { SHOP_PRODUCTS } from "@/lib/data/products";
import { bypassImageOptimization } from "@/lib/image-source";
import { formatInr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { AdminEditor, AdminEmptyState, AdminField as Field, AdminPageHeader, AdminPagination, AdminPanel, AdminStatus } from "@/components/admin/admin-ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { adminCategoryProductsHref, groupAdminProducts } from "@/lib/admin-product-categories";

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string;
  categorySlug: CategorySlug;
  sizes: string;
  colors: string;
  images: string;
  rating: string;
  reviewCount: string;
  stock: string;
  fabric: string;
  tags: string;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  wedding: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  compareAtPrice: "",
  categorySlug: "sherwani",
  sizes: "38, 40, 42, 44",
  colors: "Classic:#2d2926",
  images: "",
  rating: "4.8",
  reviewCount: "0",
  stock: "1",
  fabric: "Premium fabric",
  tags: "",
  featured: false,
  trending: false,
  newArrival: true,
  wedding: false,
};

function formFromProduct(product: Product): ProductForm {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: String(product.price),
    compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
    categorySlug: product.categorySlug,
    sizes: product.sizes.join(", "),
    colors: product.colors.map((color) => `${color.name}:${color.hex}`).join("\n"),
    images: product.images.join("\n"),
    rating: String(product.rating),
    reviewCount: String(product.reviewCount),
    stock: String(product.stock),
    fabric: product.fabric,
    tags: product.tags.join(", "),
    featured: Boolean(product.featured),
    trending: Boolean(product.trending),
    newArrival: Boolean(product.newArrival),
    wedding: Boolean(product.wedding),
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductManager({ categorySlug }: { categorySlug?: string }) {
  const { products, categories } = useAdminShopData();
  const router = useRouter();
  const categoryPickerId = useId();
  const groups = useMemo(() => groupAdminProducts(products, categories), [products, categories]);
  const scoped = categorySlug !== undefined;
  const selectedCategory = categories.find((category) => category.slug === categorySlug);
  const selectedGroup = groups.find((group) => group.slug === categorySlug);
  const categoryName = selectedGroup?.name ?? categorySlug ?? "";
  const canCreate = scoped ? Boolean(selectedCategory && !selectedCategory.deleted) : categories.some((category) => !category.deleted);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"all" | "visible" | "hidden">("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const byStatus = groups.flatMap((group) => group.products).filter((product) => {
      if (scoped && (product.categorySlug || "") !== categorySlug) return false;
      if (status === "visible") return !product.hidden && !product.deleted;
      if (status === "hidden") return product.hidden || product.deleted;
      return true;
    });
    if (!normalized) return byStatus;
    return byStatus.filter((product) =>
      [product.name, product.slug, product.category]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [groups, categorySlug, scoped, query, status]);

  function startCreate() {
    setEditing(null);
    const category = selectedCategory && !selectedCategory.deleted ? selectedCategory : categories.find((item) => !item.hidden && !item.deleted) ?? categories.find((item) => !item.deleted);
    if (!category) return;
    setForm({ ...emptyForm, categorySlug: category.slug });
    setOpen(true);
  }

  function startEdit(product: Product) {
    setEditing(product);
    setForm(formFromProduct(product));
    setOpen(true);
  }

  function patch<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    const slug = slugify(form.slug || form.name);
    const price = Number(form.price);
    if (!form.name.trim() || !slug || !Number.isFinite(price) || price <= 0) {
      toast.error("Add a product name, slug, and valid price.");
      return;
    }

    const category = categories.find((item) => item.slug === form.categorySlug);
    if (!category || category.deleted) {
      toast.error("Choose an available category before saving this product.");
      return;
    }
    const images = form.images.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
    const compareAtPrice = Number(form.compareAtPrice);
    const colors = form.colors.split(/\r?\n|,/).flatMap((item) => {
      const [name, hex] = item.split(":").map((part) => part.trim());
      return name ? [{ name, hex: hex || "#2d2926" }] : [];
    });
    const product: Product = {
      id: editing?.id ?? slug,
      slug,
      name: form.name.trim(),
      description: form.description.trim() || "A thoughtfully crafted Mietaaf piece.",
      price,
      compareAtPrice:
        Number.isFinite(compareAtPrice) && compareAtPrice > price ? compareAtPrice : undefined,
      discountPercent:
        Number.isFinite(compareAtPrice) && compareAtPrice > price
          ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
          : undefined,
      category: category.name,
      categorySlug: form.categorySlug,
      sizes: form.sizes.split(",").map((item) => item.trim()).filter(Boolean),
      colors: colors.length ? colors : [{ name: "Classic", hex: "#2d2926" }],
      images: images.length ? images : ["/placeholders/product-coming-soon.svg"],
      rating: Math.min(5, Math.max(0, Number(form.rating) || 0)),
      reviewCount: Math.max(0, Math.round(Number(form.reviewCount) || 0)),
      stock: Math.max(0, Math.round(Number(form.stock) || 0)),
      fabric: form.fabric.trim() || "Premium fabric",
      tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
      featured: form.featured,
      trending: form.trending,
      newArrival: form.newArrival,
      wedding: form.wedding,
      popularity: editing?.popularity ?? 0,
      hidden: editing?.hidden ?? false,
      deleted: editing?.deleted ?? false,
    };

    setSaving(true);
    try {
      if (editing) {
        await updateProduct(slug, product);
        if (editing.slug !== slug) {
          await updateProduct(editing.slug, { hidden: true });
        }
      } else {
        await createProduct(product);
      }
      toast.success(editing ? "Product updated live." : "Product added live.");
      setOpen(false);
    } catch {
      toast.error("Could not save the product. Check the admin claim and Firebase rules.");
    } finally {
      setSaving(false);
    }
  }

  async function hideProduct(product: Product) {
    if (!window.confirm(`Hide “${product.name}” from the storefront?`)) return;
    try {
      await updateProduct(product.slug, {
        id: product.id,
        slug: product.slug,
        hidden: true,
        deleted: false,
      });
      toast.success("Product hidden from the storefront.");
    } catch {
      toast.error("Could not hide this product.");
    }
  }

  async function restoreProduct(product: Product) {
    try {
      await updateProduct(product.slug, {
        id: product.id,
        slug: product.slug,
        hidden: false,
        deleted: false,
      });
      toast.success("Product restored to the storefront.");
    } catch {
      toast.error("Could not restore this product.");
    }
  }

  async function removeProduct(product: Product) {
    if (!window.confirm(`Permanently remove “${product.name}”? This cannot be undone for an admin-created product.`)) return;
    try {
      const isLocalProduct = SHOP_PRODUCTS.some((item) => item.slug === product.slug);
      if (isLocalProduct) {
        await updateProduct(product.slug, {
          id: product.id,
          slug: product.slug,
          hidden: true,
          deleted: true,
        });
      } else {
        await deleteProduct(product.slug);
      }
      toast.success("Product removed.");
    } catch {
      toast.error("Could not remove this product.");
    }
  }

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadProductImage(file, setUploadProgress);
      patch("images", [form.images.trim(), url].filter(Boolean).join("\n"));
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Image upload failed. Check Firebase Storage rules.",
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  const pageSize = 10;
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)));
  const pageProducts = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pageGroups = groupAdminProducts(pageProducts, categories).filter((group) => group.products.length > 0);

  return (
    <>
      {scoped ? <Link href="/admin/categories" className="mb-4 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" aria-hidden="true" />All categories</Link> : null}
      <AdminPageHeader title={categorySlug === "" ? "Unassigned products" : scoped ? `${categoryName} products` : "Products"} eyebrow={scoped ? "Category catalogue" : "Catalogue"} description={categorySlug === "" ? "Review products without a category and choose an available category in each product’s editor." : scoped ? `Manage only the items assigned to ${categoryName}. Change a product’s category in its editor to move it.` : "Browse products grouped by category, or open one category to manage its items separately."} actions={<Button className="h-10 rounded-lg text-xs" disabled={!canCreate} onClick={startCreate}><Plus className="size-4" /> Add product</Button>} />
      <AdminPanel className="mb-5 flex flex-wrap items-end justify-between gap-4 p-4">
        <div className="w-full min-w-0 sm:max-w-sm">
          <label htmlFor={categoryPickerId} className="mb-2 block text-xs font-medium">Manage category</label>
          <select id={categoryPickerId} className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm" value={scoped ? `category:${categorySlug}` : "all"} onChange={(event) => router.push(event.target.value === "all" ? "/admin/products" : adminCategoryProductsHref(event.target.value.slice(9)))}>
            <option value="all">All categories ({products.length} items)</option>
            {scoped && !selectedGroup ? <option value={`category:${categorySlug}`}>{categoryName || "Unavailable category"} (0 items)</option> : null}
            {groups.map((group) => <option key={group.slug} value={`category:${group.slug}`}>{group.name} ({group.products.length} items){categories.find((category) => category.slug === group.slug)?.deleted ? " — deleted category" : ""}</option>)}
          </select>
        </div>
        <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">{scoped ? selectedGroup?.products.length ?? 0 : products.length}</span> items <span aria-hidden="true">·</span> {scoped ? selectedGroup?.visible ?? 0 : groups.reduce((sum, group) => sum + group.visible, 0)} visible{selectedCategory?.hidden || selectedCategory?.deleted ? <span className="ml-2 inline-flex"><AdminStatus status={selectedCategory.deleted ? "deleted" : "hidden"} /></span> : null}</p>
      </AdminPanel>
      <AdminPanel className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 p-4">
          <div className="relative w-full sm:max-w-sm sm:flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input aria-label="Search products" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search by product or collection…" className="h-10 pl-9 text-sm" /></div>
          <div className="flex flex-wrap gap-1 rounded-lg bg-surface-silver/70 p-1" aria-label="Product visibility">
            {(["all", "visible", "hidden"] as const).map((item) => <Button key={item} size="sm" variant="ghost" aria-pressed={status === item} className={`h-8 rounded-md px-3 text-xs capitalize ${status === item ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`} onClick={() => { setStatus(item); setPage(1); }}>{item}</Button>)}
          </div>
        </div>
        <div aria-hidden="true" className="hidden grid-cols-[minmax(0,1fr)_100px_80px_90px_240px] gap-4 border-b border-border/60 bg-surface-silver/40 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground xl:grid"><span>Product</span><span>Price</span><span>Stock</span><span>Status</span><span className="text-right">Actions</span></div>
        {pageProducts.length ? pageGroups.map((group) => <section key={group.slug} aria-label={`${group.name} products`}>
          {!scoped ? <div className="flex flex-wrap items-center justify-between gap-2 border-y border-border/60 bg-surface-silver/40 px-4 py-3"><h2 className="text-xs font-semibold">{group.name}</h2><Link href={adminCategoryProductsHref(group.slug)} className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">Manage category<ChevronRight className="size-3" aria-hidden="true" /></Link></div> : null}
          <ul aria-label={`${group.name} items`} className="divide-y divide-border/60">
          {group.products.map((product) => (
            <li key={product.slug} className="grid min-w-0 items-center gap-3 p-4 transition-colors hover:bg-surface-silver/20 sm:grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-[minmax(0,1fr)_100px_80px_90px_240px] xl:gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-md border border-border/50 bg-surface-silver"><Image src={product.images[0] ?? "/placeholders/product-coming-soon.svg"} unoptimized={bypassImageOptimization(product.images[0] ?? "")} alt="" fill className="object-cover" sizes="44px" /></div>
                <div className="min-w-0"><p className="line-clamp-2 text-[13px] font-medium leading-5">{product.name}</p><p className="mt-1 truncate text-[11px] text-muted-foreground">{product.category}</p><div className="mt-2 flex flex-wrap items-center gap-2 text-xs xl:hidden"><span className="font-semibold">{formatInr(product.price)}</span><span className="text-muted-foreground">{product.stock} in stock</span><AdminStatus status={product.deleted ? "deleted" : product.hidden ? "hidden" : "visible"} /></div></div>
              </div>
              <p className="hidden text-xs font-semibold tabular-nums xl:block">{formatInr(product.price)}</p>
              <p className={`hidden text-xs tabular-nums xl:block ${product.stock <= 5 ? "font-medium text-amber-700 dark:text-amber-300" : "text-muted-foreground"}`}>{product.stock}</p>
              <div className="hidden xl:block"><AdminStatus status={product.deleted ? "deleted" : product.hidden ? "hidden" : "visible"} /></div>
              <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                <Button asChild variant="outline" size="icon" className="size-8 rounded-md"><Link href={`/product/${product.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${product.name}`}><Eye className="size-3.5" /></Link></Button>
                <Button variant="outline" size="sm" className="h-8 rounded-md text-xs" onClick={() => startEdit(product)}><Pencil className="size-3.5" /> Edit</Button>
                {product.hidden || product.deleted ? <Button variant="outline" size="sm" className="h-8 rounded-md text-xs" onClick={() => void restoreProduct(product)}><RotateCcw className="size-3.5" /> Restore</Button> : <Button variant="outline" size="sm" className="h-8 rounded-md text-xs" onClick={() => void hideProduct(product)}><EyeOff className="size-3.5" /> Hide</Button>}
                {!product.deleted ? <Button variant="ghost" size="icon" className="size-8 rounded-md text-destructive hover:text-destructive" aria-label={`Delete ${product.name}`} onClick={() => void removeProduct(product)}><Trash2 className="size-3.5" /></Button> : null}
              </div>
            </li>
          ))}
        </ul></section>) : <AdminEmptyState title={scoped && !query && status === "all" ? "No products in this category yet" : "No products found"} description={scoped && !query && status === "all" ? "Add a product here or move an existing product into this category using its editor." : "Try another search or change the visibility filter."} action={scoped && !query && status === "all" ? (canCreate ? <Button size="sm" onClick={startCreate}><Plus className="size-3.5" />Add product</Button> : <Button asChild variant="outline" size="sm"><Link href="/admin/categories">All categories</Link></Button>) : <Button variant="outline" size="sm" onClick={() => { setQuery(""); setStatus("all"); setPage(1); }}>Clear filters</Button>} />}
        <AdminPagination page={currentPage} pageSize={pageSize} total={filtered.length} onPageChange={setPage} />
      </AdminPanel>

      <Dialog open={open} onOpenChange={setOpen}>
        <AdminEditor title={editing ? "Edit product" : "Add product"} description="Saved product changes update the storefront. Review the details before saving." footer={<>

            <Button variant="outline" className="rounded-lg" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="rounded-lg" disabled={saving || uploading} onClick={() => void save()}>
              {saving ? <LoaderCircle className="size-4 animate-spin" /> : null}
              Save product
            </Button>
        </>}>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Product name">
              <Input value={form.name} onChange={(e) => {
                patch("name", e.target.value);
                if (!editing) patch("slug", slugify(e.target.value));
              }} />
            </Field>
            <Field label="URL slug">
              <Input value={form.slug} onChange={(e) => patch("slug", slugify(e.target.value))} />
            </Field>
            <Field label="Collection">
              <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.categorySlug} onChange={(e) => patch("categorySlug", e.target.value as CategorySlug)}>
                {!categories.some((category) => category.slug === form.categorySlug) ? <option value={form.categorySlug} disabled>Choose an available category</option> : null}
                {categories
                  .filter((category) => !category.deleted || category.slug === form.categorySlug)
                  .map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}{category.deleted ? " (deleted — choose another)" : category.hidden ? " (hidden)" : ""}
                    </option>
                  ))}
              </select>
              {!categories.some((category) => category.slug === form.categorySlug) ? <p className="mt-2 text-xs text-muted-foreground">This product’s category is unavailable. Choose a category before saving.</p> : null}
            </Field>
            <Field label="Fabric">
              <Input value={form.fabric} onChange={(e) => patch("fabric", e.target.value)} />
            </Field>
            <Field label="Selling price (₹)">
              <Input type="number" min="1" value={form.price} onChange={(e) => patch("price", e.target.value)} />
            </Field>
            <Field label="Original price (₹)">
              <Input type="number" min="0" value={form.compareAtPrice} onChange={(e) => patch("compareAtPrice", e.target.value)} />
            </Field>
            <Field label="Stock">
              <Input type="number" min="0" value={form.stock} onChange={(e) => patch("stock", e.target.value)} />
            </Field>
            <Field label="Rating (0–5)">
              <Input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => patch("rating", e.target.value)} />
            </Field>
            <Field label="Review count">
              <Input type="number" min="0" value={form.reviewCount} onChange={(e) => patch("reviewCount", e.target.value)} />
            </Field>
            <Field label="Sizes (comma separated)">
              <Input value={form.sizes} onChange={(e) => patch("sizes", e.target.value)} />
            </Field>
            <Field label="Colors (one Name:#hex per line)" className="sm:col-span-2">
              <Textarea value={form.colors} onChange={(e) => patch("colors", e.target.value)} />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea className="min-h-24" value={form.description} onChange={(e) => patch("description", e.target.value)} />
            </Field>
            <Field label="Image links (one per line)" className="sm:col-span-2">
              <Textarea className="min-h-28" value={form.images} onChange={(e) => patch("images", e.target.value)} />
              <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-semibold">
                {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
                {uploading ? `Uploading ${uploadProgress}%` : "Upload image"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="sr-only"
                  disabled={uploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    void upload(file);
                  }}
                />
              </label>
            </Field>
            <Field label="Tags (comma separated)" className="sm:col-span-2">
              <Input value={form.tags} onChange={(e) => patch("tags", e.target.value)} />
            </Field>
            <div className="flex flex-wrap gap-4 sm:col-span-2">
              {(["featured", "trending", "newArrival", "wedding"] as const).map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm capitalize">
                  <input type="checkbox" checked={form[key]} onChange={(e) => patch(key, e.target.checked)} />
                  {key === "newArrival" ? "New arrival" : key}
                </label>
              ))}
            </div>
          </div>
        </AdminEditor>
      </Dialog>
    </>
  );
}
