"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
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
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export function ProductManager() {
  const { products, categories } = useAdminShopData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "visible" | "hidden">("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const byStatus = products.filter((product) => {
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
  }, [products, query, status]);

  function startCreate() {
    setEditing(null);
    setForm(emptyForm);
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
      category: category?.name ?? "Collection",
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
      hidden: false,
      deleted: false,
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

  return (
    <>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-primary">Catalogue</p>
          <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Products</h1>
          <p className="mt-2 text-sm text-muted-foreground">Add, price, feature, edit, or hide every storefront item.</p>
        </div>
        <Button className="rounded-full" onClick={startCreate}>
          <Plus className="size-4" /> Add product
        </Button>
      </header>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products or collections"
          className="h-12 rounded-full bg-card pl-11"
        />
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {(["all", "visible", "hidden"] as const).map((item) => (
          <Button
            key={item}
            size="sm"
            variant={status === item ? "default" : "outline"}
            className="shrink-0 rounded-full capitalize"
            onClick={() => setStatus(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        {filtered.map((product) => (
          <Card key={product.slug} className="grid grid-cols-[78px_minmax(0,1fr)] gap-4 rounded-[1.25rem] p-3 sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
              <Image
                src={product.images[0] ?? "/placeholders/product-coming-soon.svg"}
                unoptimized={bypassImageOptimization(product.images[0] ?? "")}
                alt=""
                fill
                className="object-cover"
                sizes="92px"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-lg">{product.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {product.category} · {product.stock} in stock
                {product.deleted ? " · Deleted" : product.hidden ? " · Hidden" : " · Visible"}
              </p>
              <p className="mt-2 font-semibold">{formatInr(product.price)}</p>
            </div>
            <div className="col-span-2 flex flex-wrap gap-2 sm:col-span-1 sm:justify-end">
              <Button asChild variant="outline" size="sm" className="flex-1 rounded-full sm:flex-none">
                <Link href={`/product/${product.slug}`} target="_blank">
                  <Eye className="size-3.5" /> View
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 rounded-full sm:flex-none" onClick={() => startEdit(product)}>
                <Pencil className="size-3.5" /> Edit
              </Button>
              {product.hidden || product.deleted ? (
                <Button variant="outline" size="sm" className="flex-1 rounded-full sm:flex-none" onClick={() => void restoreProduct(product)}>
                  <RotateCcw className="size-3.5" /> Restore
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="flex-1 rounded-full sm:flex-none" onClick={() => void hideProduct(product)}>
                  <EyeOff className="size-3.5" /> Hide
                </Button>
              )}
              {!product.deleted ? (
                <Button variant="outline" size="sm" className="flex-1 rounded-full text-destructive hover:text-destructive sm:flex-none" onClick={() => void removeProduct(product)}>
                  <Trash2 className="size-3.5" /> Delete
                </Button>
              ) : null}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent position="bottom-sheet" className="overflow-y-auto p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editing ? "Edit product" : "Add product"}</DialogTitle>
            <DialogDescription>All saved values publish to the storefront in real time.</DialogDescription>
          </DialogHeader>
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
                {categories
                  .filter((category) => !category.hidden && !category.deleted)
                  .map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
              </select>
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
              <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold">
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
          <DialogFooter className="sticky bottom-0 mt-2">
            <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="rounded-full" disabled={saving || uploading} onClick={() => void save()}>
              {saving ? <LoaderCircle className="size-4 animate-spin" /> : null}
              Save product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
