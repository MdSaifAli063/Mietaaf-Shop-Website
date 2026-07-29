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
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

  return (
    <>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-primary">Homepage</p>
          <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Hero banners</h1>
          <p className="mt-2 text-sm text-muted-foreground">Control the large homepage slides, copy, buttons, and links.</p>
        </div>
        <Button className="rounded-full" onClick={startCreate}><Plus className="size-4" /> Add banner</Button>
      </header>
      <div className="mt-7 grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden rounded-[1.35rem] p-0 sm:grid sm:grid-cols-[240px_minmax(0,1fr)]">
            <div className="relative aspect-[16/9] bg-muted sm:aspect-auto sm:min-h-40">
              <Image src={banner.image} alt="" fill unoptimized={bypassImageOptimization(banner.image)} className="object-cover" sizes="240px" />
            </div>
            <div className="flex min-w-0 flex-col justify-center p-5">
              <p className="font-heading text-2xl">{banner.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{banner.subtitle}</p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
                {banner.deleted ? "Deleted" : banner.hidden ? "Hidden" : "Visible"}
              </p>
              <p className="mt-2 truncate text-xs text-primary">{banner.cta} → {banner.href}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link href="/" target="_blank"><Eye className="size-3.5" /> View</Link>
                </Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => startEdit(banner)}><Pencil className="size-3.5" /> Edit</Button>
                {banner.hidden || banner.deleted ? (
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => void restore(banner)}><RotateCcw className="size-3.5" /> Restore</Button>
                ) : (
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => void hide(banner)}><EyeOff className="size-3.5" /> Hide</Button>
                )}
                {!banner.deleted ? (
                  <Button size="sm" variant="outline" className="rounded-full text-destructive hover:text-destructive" onClick={() => void remove(banner)}><Trash2 className="size-3.5" /> Delete</Button>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent position="bottom-sheet" className="overflow-y-auto p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editing ? "Edit banner" : "Add banner"}</DialogTitle>
            <DialogDescription>Use a wide, high-resolution image for the best result.</DialogDescription>
          </DialogHeader>
          {(["title", "subtitle", "image", "cta", "href"] as const).map((key) => (
            <label key={key}>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{key}</span>
              <Input value={form[key]} onChange={(e) => patch(key, e.target.value)} />
            </label>
          ))}
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
            <Button className="rounded-full" disabled={saving || uploading} onClick={() => void save()}>{saving ? <LoaderCircle className="size-4 animate-spin" /> : null} Save banner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
