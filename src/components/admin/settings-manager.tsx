"use client";

import { useEffect, useState } from "react";
import { ExternalLink, LoaderCircle, Save, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import type { SiteSettings } from "@/types";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { saveSiteSettings } from "@/services/site-settings";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  return (
    <div>
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-primary">Global content</p>
        <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Website settings</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Update the announcement bar and contact information used across the header and footer.
        </p>
      </header>

      <Card className="mt-7 rounded-[1.5rem] p-5 sm:p-7">
        <h2 className="font-heading text-2xl">Brand presentation</h2>
        <p className="mt-1 text-sm text-muted-foreground">Global footer copy and public social profiles.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <SettingField label="Brand tagline" className="sm:col-span-2">
            <Input value={form.brandTagline} onChange={(e) => patch("brandTagline", e.target.value)} />
          </SettingField>
          <SettingField label="Footer description" className="sm:col-span-2">
            <Textarea value={form.footerDescription} onChange={(e) => patch("footerDescription", e.target.value)} />
          </SettingField>
          <SettingField label="LinkedIn URL">
            <Input value={form.linkedinUrl} onChange={(e) => patch("linkedinUrl", e.target.value)} />
          </SettingField>
          <SettingField label="Instagram URL">
            <Input value={form.instagramUrl} onChange={(e) => patch("instagramUrl", e.target.value)} />
          </SettingField>
          <SettingField label="Facebook URL" className="sm:col-span-2">
            <Input value={form.facebookUrl} onChange={(e) => patch("facebookUrl", e.target.value)} />
          </SettingField>
        </div>
      </Card>

      <Card className="mt-5 rounded-[1.5rem] p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl">Announcement bar</h2>
            <p className="mt-1 text-sm text-muted-foreground">The first rotating message at the top of the storefront.</p>
          </div>
          <label className="flex shrink-0 items-center gap-2 text-sm">
            <input type="checkbox" checked={form.announcementEnabled} onChange={(e) => patch("announcementEnabled", e.target.checked)} />
            Enabled
          </label>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <SettingField label="Desktop message" className="sm:col-span-2">
            <Textarea value={form.announcementText} onChange={(e) => patch("announcementText", e.target.value)} />
          </SettingField>
          <SettingField label="Mobile message">
            <Input value={form.announcementMobileText} onChange={(e) => patch("announcementMobileText", e.target.value)} />
          </SettingField>
          <SettingField label="Button text">
            <Input value={form.announcementCta} onChange={(e) => patch("announcementCta", e.target.value)} />
          </SettingField>
          <SettingField label="Button link" className="sm:col-span-2">
            <Input value={form.announcementHref} onChange={(e) => patch("announcementHref", e.target.value)} />
          </SettingField>
        </div>
      </Card>

      <Card className="mt-5 rounded-[1.5rem] p-5 sm:p-7">
        <h2 className="font-heading text-2xl">Business contact</h2>
        <p className="mt-1 text-sm text-muted-foreground">Displayed publicly in the footer and used by the WhatsApp announcement.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <SettingField label="Support email">
            <Input type="email" value={form.supportEmail} onChange={(e) => patch("supportEmail", e.target.value)} />
          </SettingField>
          <SettingField label="Display phone">
            <Input value={form.phoneDisplay} onChange={(e) => patch("phoneDisplay", e.target.value)} />
          </SettingField>
          <SettingField label="WhatsApp number (country code + number)">
            <Input inputMode="numeric" value={form.whatsappNumber} onChange={(e) => patch("whatsappNumber", e.target.value)} />
          </SettingField>
          <SettingField label="Studio address" className="sm:col-span-2">
            <Textarea value={form.address} onChange={(e) => patch("address", e.target.value)} />
          </SettingField>
        </div>
      </Card>

      <Card className="mt-5 rounded-[1.5rem] border-primary/20 bg-primary/5 p-5">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm leading-6 text-muted-foreground">
            Firebase project keys, EmailJS credentials, SEO verification, and deployment secrets stay in Vercel Environment Variables. They are intentionally not editable in the browser admin panel.
          </p>
        </div>
      </Card>

      <div className="sticky bottom-3 mt-6 flex flex-col gap-2 rounded-2xl border border-border/70 bg-background/90 p-3 shadow-xl backdrop-blur sm:flex-row sm:justify-end">
        <Button asChild variant="outline" className="rounded-full">
          <a href="/" target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4" /> Preview site</a>
        </Button>
        <Button className="rounded-full" disabled={saving || loading} onClick={() => void save()}>
          {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save website settings
        </Button>
      </div>
    </div>
  );
}

function SettingField({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
