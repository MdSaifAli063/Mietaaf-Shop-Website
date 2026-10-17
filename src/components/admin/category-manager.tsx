"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Eye, EyeOff, ImagePlus, LoaderCircle, Pencil, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Category } from "@/types";
import { useAdminShopData } from "@/hooks/use-admin-shop-data";
import { createCategory, deleteCategory, updateCategory, uploadCategoryImage } from "@/services/categories";
import { CATEGORIES } from "@/lib/data/categories";
import { bypassImageOptimization } from "@/lib/image-source";
import { Button } from "@/components/ui/button";
import { AdminEditor, AdminEmptyState, AdminField, AdminPageHeader, AdminPanel, AdminStatus } from "@/components/admin/admin-ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { adminCategoryProductsHref, groupAdminProducts } from "@/lib/admin-product-categories";

export function CategoryManager() {
  const { categories, products } = useAdminShopData();
  const groups = useMemo(() => new Map(groupAdminProducts(products, categories).map((group) => [group.slug, group])), [products, categories]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ slug: "", name: "", description: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  function startEdit(category: Category) {
    setEditing(category);
    setForm({ slug: category.slug, name: category.name, description: category.description, image: category.image });
    setOpen(true);
  }

  function startCreate() {
    setEditing(null);
    setForm({ slug: "", name: "", description: "", image: "" });
    setOpen(true);
  }

  async function save() {
    const slug = form.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!slug || !form.name.trim() || !form.image.trim()) {
      toast.error("Collection slug, name, and image are required.");
      return;
    }
    setSaving(true);
    try {
      const value: Category = {
        slug,
        name: form.name.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        hidden: false,
        deleted: false,
      };
      if (editing) {
        await updateCategory(editing.slug, value);
        if (editing.slug !== slug) {
          await updateCategory(editing.slug, { hidden: true, deleted: true });
        }
      } else {
        await createCategory(value);
      }
      toast.success(editing ? "Collection updated live." : "Collection added live.");
      setOpen(false);
    } catch {
      toast.error("Could not save the collection.");
    } finally {
      setSaving(false);
    }
  }

  async function hide(category: Category) {
    if (!window.confirm(`Hide “${category.name}” and its category page entry? Products remain available in Shop.`)) return;
    try {
      await updateCategory(category.slug, { ...category, hidden: true, deleted: false });
      toast.success("Collection hidden.");
    } catch {
      toast.error("Could not hide the collection.");
    }
  }

  async function restore(category: Category) {
    try {
      await updateCategory(category.slug, { ...category, hidden: false, deleted: false });
      toast.success("Collection restored.");
    } catch {
      toast.error("Could not restore the collection.");
    }
  }

  async function remove(category: Category) {
    if (!window.confirm(`Delete “${category.name}”? Products assigned to it will not be deleted.`)) return;
    try {
      if (CATEGORIES.some((item) => item.slug === category.slug)) {
        await updateCategory(category.slug, { ...category, hidden: true, deleted: true });
      } else {
        await deleteCategory(category.slug);
      }
      toast.success("Collection deleted.");
    } catch {
      toast.error("Could not delete the collection.");
    }
  }

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const image = await uploadCategoryImage(file, setUploadProgress);
      setForm((current) => ({ ...current, image }));
      toast.success("Collection image uploaded.");
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

  const filteredCategories = categories.filter((category) => `${category.name} ${category.slug}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <>
      <AdminPageHeader title="Categories" eyebrow="Navigation & discovery" description="Open a category to manage its products separately, or edit how the collection appears in your store." actions={<Button className="h-10 rounded-lg text-xs" onClick={startCreate}><Plus className="size-4" /> Add category</Button>} />
      <AdminPanel className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 p-4"><div className="relative w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input aria-label="Search categories" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories…" className="h-10 pl-9 text-sm" /></div><p className="text-xs text-muted-foreground">{filteredCategories.length} collections</p></div>
        {filteredCategories.length ? <ul className="divide-y divide-border/60" aria-label="Categories">
          {filteredCategories.map((category) => (
            <li key={category.slug} className="grid items-center gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="flex min-w-0 items-center gap-4"><div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-silver"><Image src={category.image} alt="" fill unoptimized={bypassImageOptimization(category.image)} className="object-cover" sizes="64px" /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><Link href={adminCategoryProductsHref(category.slug)} className="text-sm font-semibold hover:text-primary hover:underline">{category.name}</Link><AdminStatus status={category.deleted ? "deleted" : category.hidden ? "hidden" : "visible"} /></div><p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{category.description}</p><p className="mt-1 text-[11px] text-muted-foreground">{groups.get(category.slug)?.products.length ?? 0} items <span aria-hidden="true">·</span> {groups.get(category.slug)?.visible ?? 0} visible</p></div></div>
              <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                <Button asChild size="sm" variant="outline" className="h-8 rounded-md border-primary/25 bg-primary/5 text-xs text-primary"><Link href={adminCategoryProductsHref(category.slug)} aria-label={`Manage ${category.name} items`}>Manage items<ChevronRight className="size-3.5" aria-hidden="true" /></Link></Button>
                <Button asChild size="icon" variant="outline" className="size-8 rounded-md"><Link href={`/category/${category.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${category.name}`}><Eye className="size-3.5" /></Link></Button>
                <Button size="sm" variant="outline" className="h-8 rounded-md text-xs" onClick={() => startEdit(category)}><Pencil className="size-3.5" /> Edit</Button>
                {category.hidden || category.deleted ? <Button size="sm" variant="outline" className="h-8 rounded-md text-xs" onClick={() => void restore(category)}><RotateCcw className="size-3.5" /> Restore</Button> : <Button size="sm" variant="outline" className="h-8 rounded-md text-xs" onClick={() => void hide(category)}><EyeOff className="size-3.5" /> Hide</Button>}
                {!category.deleted ? <Button size="icon" variant="ghost" className="size-8 rounded-md text-destructive hover:text-destructive" aria-label={`Delete ${category.name}`} onClick={() => void remove(category)}><Trash2 className="size-3.5" /></Button> : null}
              </div>
            </li>
          ))}
        </ul> : <AdminEmptyState title="No categories found" description="Try another collection name or URL slug." action={<Button size="sm" variant="outline" onClick={() => setQuery("")}>Clear search</Button>} />}
      </AdminPanel>

      <Dialog open={open} onOpenChange={setOpen}>
        <AdminEditor title={editing ? "Edit category" : "Add category"} description="Update its collection page, navigation entry and shop filter." footer={<>

            <Button variant="outline" className="rounded-lg" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="rounded-lg" disabled={saving || uploading} onClick={() => void save()}>
              {saving ? <LoaderCircle className="size-4 animate-spin" /> : null} Save collection
            </Button>
        </>}>

          <AdminField label="URL slug">
            <Input value={form.slug} onChange={(e) => setForm((current) => ({ ...current, slug: e.target.value }))} />
          </AdminField>
          <AdminField label="Name">
            <Input value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
          </AdminField>
          <AdminField label="Description">
            <Textarea className="min-h-24" value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} />
          </AdminField>
          <AdminField label="Image URL">
            <Input value={form.image} onChange={(e) => setForm((current) => ({ ...current, image: e.target.value }))} />
          </AdminField>
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-semibold">
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
        </AdminEditor>
      </Dialog>
    </>
  );
}
