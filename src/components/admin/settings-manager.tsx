"use client";

import { useEffect, useState } from "react";
import { ExternalLink, LoaderCircle, Save, Undo2 } from "lucide-react";
import toast from "react-hot-toast";
import type { SiteSettings } from "@/types";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { saveSiteSettings } from "@/services/site-settings";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { AdminField as SettingField, AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SettingsManager() {
  const { settings, loading } = useSiteSettings();
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(settings), [settings]);

  function patch<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    if (!form.supportEmail.includes("@") || !form.whatsappNumber.trim()) {
      toast.error("Add a valid support email and WhatsApp number.");
      return;
    }
    setSaving(true);
    try {
      await saveSiteSettings({
        ...form,
        whatsappNumber: form.whatsappNumber.replace(/\D/g, ""),
      });
      toast.success("Website settings updated live.");
    } catch {
      toast.error("Could not save website settings.");
    } finally {
      setSaving(false);
    }
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(settings);
  const saveButton = <Button className="h-10 rounded-lg text-xs" disabled={saving || loading || !dirty} onClick={() => void save()}>{saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}{saving ? "Saving…" : "Save changes"}</Button>;

  return (
    <div>
      <AdminPageHeader title="Website settings" eyebrow="Storefront preferences" description="Manage the brand details, announcements and contact information customers see." actions={<><span aria-live="polite" className="mr-1 text-[11px] text-muted-foreground">{dirty ? "Unsaved changes" : "No unsaved changes"}</span>{saveButton}</>} />
      <div className="grid items-start gap-5 xl:grid-cols-2">
        <AdminPanel className="p-5 sm:p-6">
          <h2 className="text-sm font-semibold">Brand & social profiles</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Your public tagline, footer copy and social links.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SettingField label="Brand tagline" className="sm:col-span-2"><Input value={form.brandTagline} onChange={(e) => patch("brandTagline", e.target.value)} /></SettingField>
            <SettingField label="Footer description" className="sm:col-span-2"><Textarea className="min-h-24" value={form.footerDescription} onChange={(e) => patch("footerDescription", e.target.value)} /></SettingField>
            <SettingField label="Instagram URL"><Input value={form.instagramUrl} onChange={(e) => patch("instagramUrl", e.target.value)} /></SettingField>
            <SettingField label="Facebook URL"><Input value={form.facebookUrl} onChange={(e) => patch("facebookUrl", e.target.value)} /></SettingField>
            <SettingField label="LinkedIn URL" className="sm:col-span-2"><Input value={form.linkedinUrl} onChange={(e) => patch("linkedinUrl", e.target.value)} /></SettingField>
          </div>
        </AdminPanel>
        <AdminPanel className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-semibold">Announcement bar</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">The first rotating message above your storefront.</p></div><label className="flex min-h-8 items-center gap-2 text-xs"><input type="checkbox" checked={form.announcementEnabled} onChange={(e) => patch("announcementEnabled", e.target.checked)} />Enabled</label></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SettingField label="Desktop message" className="sm:col-span-2"><Textarea className="min-h-24" value={form.announcementText} onChange={(e) => patch("announcementText", e.target.value)} /></SettingField>
            <SettingField label="Mobile message" className="sm:col-span-2"><Input value={form.announcementMobileText} onChange={(e) => patch("announcementMobileText", e.target.value)} /></SettingField>
            <SettingField label="Button text"><Input value={form.announcementCta} onChange={(e) => patch("announcementCta", e.target.value)} /></SettingField>
            <SettingField label="Button link"><Input value={form.announcementHref} onChange={(e) => patch("announcementHref", e.target.value)} /></SettingField>
          </div>
        </AdminPanel>
        <AdminPanel className="p-5 sm:p-6 xl:col-span-2">
          <h2 className="text-sm font-semibold">Business contact</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Used in the footer, contact page and WhatsApp ordering.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SettingField label="Support email"><Input type="email" value={form.supportEmail} onChange={(e) => patch("supportEmail", e.target.value)} /></SettingField>
            <SettingField label="Display phone"><Input value={form.phoneDisplay} onChange={(e) => patch("phoneDisplay", e.target.value)} /></SettingField>
            <SettingField label="WhatsApp number, including country code"><Input inputMode="numeric" value={form.whatsappNumber} onChange={(e) => patch("whatsappNumber", e.target.value)} /></SettingField>
            <SettingField label="Studio address" className="sm:col-span-2 xl:col-span-3"><Textarea value={form.address} onChange={(e) => patch("address", e.target.value)} /></SettingField>
          </div>
        </AdminPanel>
      </div>
      <div className="sticky bottom-0 mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/95 p-3 shadow-sm backdrop-blur">
        <Button asChild variant="ghost" className="h-9 rounded-lg text-xs"><a href="/" target="_blank" rel="noopener noreferrer"><ExternalLink className="size-3.5" /> Preview storefront</a></Button>
        <div className="flex flex-wrap gap-2"><Button variant="outline" className="h-10 rounded-lg text-xs" disabled={saving || !dirty} onClick={() => setForm(settings)}><Undo2 className="size-3.5" />Reset changes</Button>{saveButton}</div>
      </div>
    </div>
  );
}
