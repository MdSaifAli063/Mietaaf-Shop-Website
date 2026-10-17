"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ImagePlus, LoaderCircle, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Banner } from "@/types";
import { useAdminShopData } from "@/hooks/use-admin-shop-data";
import { createBanner, deleteBanner, updateBanner, uploadBannerImage } from "@/services/banners";
import { BANNERS } from "@/lib/data/banners";
import { bypassImageOptimization } from "@/lib/image-source";
import { Button } from "@/components/ui/button";
import { AdminEditor, AdminField, AdminPageHeader, AdminPanel, AdminStatus } from "@/components/admin/admin-ui";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";

const blank = { title: "", subtitle: "", image: "", href: "/shop", cta: "Explore" };

export function BannerManager() {
  const { banners } = useAdminShopData();
  const [editing, setEditing] = useState<Banner | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  function startCreate() {
    setEditing(null);
    setForm(blank);
    setOpen(true);
  }
  function startEdit(banner: Banner) {
    setEditing(banner);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle ?? "",
      image: banner.image,
      href: banner.href ?? "/shop",
      cta: banner.cta ?? "Explore",
    });
    setOpen(true);
  }
  function patch(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    if (!form.title.trim() || !form.image.trim()) {
      toast.error("Banner title and image are required.");
      return;
    }
    setSaving(true);
    try {
      const value = { ...form, hidden: false, deleted: false };
      if (editing) await updateBanner(editing.id, value);
      else await createBanner(value);
      toast.success(editing ? "Banner updated live." : "Banner added live.");
      setOpen(false);
    } catch {
      toast.error("Could not save the banner.");
    } finally {
      setSaving(false);
    }
  }

  async function hide(banner: Banner) {
    if (!window.confirm(`Hide the “${banner.title}” slide?`)) return;
    try {
      await updateBanner(banner.id, { ...banner, hidden: true, deleted: false });
      toast.success("Banner hidden.");
    } catch {
      toast.error("Could not hide the banner.");
    }
  }

  async function restore(banner: Banner) {
    try {
      await updateBanner(banner.id, { ...banner, hidden: false, deleted: false });
      toast.success("Banner restored.");
    } catch {
      toast.error("Could not restore the banner.");
    }
  }

  async function remove(banner: Banner) {
    if (!window.confirm(`Delete the “${banner.title}” banner?`)) return;
    try {
      if (BANNERS.some((item) => item.id === banner.id)) {
        await updateBanner(banner.id, { ...banner, hidden: true, deleted: true });
      } else {
        await deleteBanner(banner.id);
      }
      toast.success("Banner deleted.");
    } catch {
      toast.error("Could not delete the banner.");
    }
  }

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      patch("image", await uploadBannerImage(file, setUploadProgress));
      toast.success("Banner image uploaded.");
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Image upload failed. Check Firebase Storage and try again.";
      toast.error(message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  const fieldLabels = { title: "Slide title", subtitle: "Supporting text", image: "Image URL", cta: "Button text", href: "Button link" };

  return (
    <>
      <AdminPageHeader title="Homepage banners" eyebrow="Storefront content" description="Manage the photography, copy and shopping links in your homepage slideshow." actions={<Button className="h-10 rounded-lg text-xs" onClick={startCreate}><Plus className="size-4" /> Add banner</Button>} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"><p>{banners.length} slides · {banners.filter((banner) => !banner.hidden && !banner.deleted).length} visible</p><p>Saved changes appear on the storefront.</p></div>
      <div className="grid gap-4">
        {banners.map((banner, index) => (
          <AdminPanel key={banner.id} className="overflow-hidden sm:grid sm:grid-cols-[210px_minmax(0,1fr)]">
            <div className="relative aspect-[16/9] bg-surface-silver sm:aspect-auto sm:min-h-40"><Image src={banner.image} alt="" fill unoptimized={bypassImageOptimization(banner.image)} className="object-cover" sizes="(min-width:640px) 210px, 100vw" /><span className="absolute left-3 top-3 rounded-md bg-card/95 px-2 py-1 text-[10px] font-semibold">SLIDE {String(index + 1).padStart(2, "0")}</span></div>
            <div className="min-w-0 p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-semibold">{banner.title}</h2><AdminStatus status={banner.deleted ? "deleted" : banner.hidden ? "hidden" : "visible"} /></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{banner.subtitle}</p><p className="mt-2 truncate text-[11px] text-primary">{banner.cta} → {banner.href}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Button asChild size="sm" variant="outline" className="h-8 rounded-md text-xs"><Link href="/" target="_blank" rel="noopener noreferrer"><Eye className="size-3.5" /> Preview</Link></Button>
                <Button size="sm" variant="outline" className="h-8 rounded-md text-xs" onClick={() => startEdit(banner)}><Pencil className="size-3.5" /> Edit</Button>
                {banner.hidden || banner.deleted ? <Button size="sm" variant="outline" className="h-8 rounded-md text-xs" onClick={() => void restore(banner)}><RotateCcw className="size-3.5" /> Restore</Button> : <Button size="sm" variant="outline" className="h-8 rounded-md text-xs" onClick={() => void hide(banner)}><EyeOff className="size-3.5" /> Hide</Button>}
                {!banner.deleted ? <Button size="icon" variant="ghost" className="size-8 rounded-md text-destructive hover:text-destructive" aria-label={`Delete ${banner.title}`} onClick={() => void remove(banner)}><Trash2 className="size-3.5" /></Button> : null}
              </div>
            </div>
          </AdminPanel>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <AdminEditor title={editing ? "Edit banner" : "Add banner"} description="Use a wide photograph and a clear destination for the shopping button." footer={<>

            <Button variant="outline" className="rounded-lg" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="rounded-lg" disabled={saving || uploading} onClick={() => void save()}>{saving ? <LoaderCircle className="size-4 animate-spin" /> : null} Save banner</Button>
        </>}>

          {(["title", "subtitle", "image", "cta", "href"] as const).map((key) => (
            <AdminField key={key} label={fieldLabels[key]}>
              <Input value={form[key]} onChange={(e) => patch(key, e.target.value)} />
            </AdminField>
          ))}
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
