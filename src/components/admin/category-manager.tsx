"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ImagePlus, LoaderCircle, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Category } from "@/types";
import { useAdminShopData } from "@/hooks/use-admin-shop-data";
import { createCategory, deleteCategory, updateCategory, uploadCategoryImage } from "@/services/categories";
import { CATEGORIES } from "@/lib/data/categories";
import { bypassImageOptimization } from "@/lib/image-source";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function CategoryManager() {
  const { categories } = useAdminShopData();
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

  return (
    <>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-primary">Navigation & discovery</p>
          <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Categories</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Add, edit, preview, hide, restore, or delete storefront collections.
          </p>
        </div>
        <Button className="rounded-full" onClick={startCreate}><Plus className="size-4" /> Add category</Button>
      </header>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.slug} className="overflow-hidden rounded-[1.35rem] p-0">
            <div className="relative aspect-[16/10] bg-muted">
              <Image src={category.image} alt="" fill unoptimized={bypassImageOptimization(category.image)} className="object-cover" sizes="(max-width:640px) 100vw, 33vw" />
            </div>
            <div className="p-4">
              <p className="font-heading text-xl">{category.name}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                {category.deleted ? "Deleted" : category.hidden ? "Hidden" : "Visible"} · /{category.slug}
              </p>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{category.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1 rounded-full">
                  <Link href={`/category/${category.slug}`} target="_blank"><Eye className="size-3.5" /> View</Link>
                </Button>
                <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => startEdit(category)}>
                  <Pencil className="size-3.5" /> Edit
                </Button>
                {category.hidden || category.deleted ? (
                  <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => void restore(category)}>
                    <RotateCcw className="size-3.5" /> Restore
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => void hide(category)}>
                    <EyeOff className="size-3.5" /> Hide
                  </Button>
                )}
                {!category.deleted ? (
                  <Button size="sm" variant="outline" className="flex-1 rounded-full text-destructive hover:text-destructive" onClick={() => void remove(category)}>
                    <Trash2 className="size-3.5" /> Delete
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent position="bottom-sheet" className="overflow-y-auto p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editing ? "Edit collection" : "Add collection"}</DialogTitle>
            <DialogDescription>Updates its card, navigation entry, category page, and Shop filter.</DialogDescription>
          </DialogHeader>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">URL slug</span>
            <Input value={form.slug} onChange={(e) => setForm((current) => ({ ...current, slug: e.target.value }))} />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</span>
            <Input value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</span>
            <Textarea className="min-h-24" value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image URL</span>
            <Input value={form.image} onChange={(e) => setForm((current) => ({ ...current, image: e.target.value }))} />
          </label>
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold">
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
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="rounded-full" disabled={saving || uploading} onClick={() => void save()}>
              {saving ? <LoaderCircle className="size-4 animate-spin" /> : null} Save collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
