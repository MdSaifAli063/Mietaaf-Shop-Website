"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

function ContactChip({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border/60 bg-muted/40 p-4 dark:bg-muted/20">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-background/80">
        <Icon className="h-4 w-4 text-primary" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{label}</p>
        <div className="mt-1 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

export function ContactBusinessDetails() {
  const { settings } = useSiteSettings();
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl sm:text-2xl">Reach us</h2>
      <div className="grid gap-3 sm:gap-4">
        <ContactChip icon={Phone} label="Phone">
          <a href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`} className="text-foreground hover:underline">{settings.phoneDisplay}</a>
        </ContactChip>
        <ContactChip icon={Mail} label="Email">
          <a href={`mailto:${settings.supportEmail}`} className="break-all text-foreground hover:underline">{settings.supportEmail}</a>
        </ContactChip>
        <ContactChip icon={MapPin} label="Studio"><span>{settings.address}</span></ContactChip>
        <ContactChip icon={Clock} label="Hours">
          <span>10:00 — 19:00 IST · Tue–Sun</span>
          <span className="mt-1 block text-xs">Visits by appointment — message us to schedule.</span>
        </ContactChip>
      </div>
    </div>
  );
}

export function ContactBusinessMap() {
  const { settings } = useSiteSettings();
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(`${settings.address}, India`)}&hl=en&z=16&output=embed`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;
  return (
    <section aria-label="Map" className="mt-12 sm:mt-16">
      <div className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/80 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
        <div className="relative aspect-4/3 min-h-[240px] w-full sm:aspect-21/9 sm:min-h-[300px] md:min-h-[360px]">
          <iframe title={`Map — ${settings.address}`} src={mapSrc} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
        <div className="flex flex-col gap-2 border-t border-border/50 bg-[#eee4d6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:bg-[#201d19]">
          <p className="text-sm text-muted-foreground">{settings.address}</p>
          <Link href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary underline-offset-4 hover:underline">Open in Google Maps</Link>
        </div>
      </div>
    </section>
  );
}
