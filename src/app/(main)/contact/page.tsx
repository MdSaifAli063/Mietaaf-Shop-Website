import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageEnter } from "@/components/motion/page-enter";
import { ContactForm } from "@/components/contact/contact-form";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import {
  SITE_ADDRESS_DISPLAY,
  SITE_EMAIL_DISPLAY,
  SITE_GOOGLE_MAPS_URL,
  SITE_PHONE_DISPLAY,
  getSiteMapsEmbedSrc,
} from "@/lib/site-contact";

function ContactChip({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Phone;
  label: string;
  children: React.ReactNode;
}) {
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

export default function ContactPage() {
  const mapSrc = getSiteMapsEmbedSrc();

  return (
    <PageEnter>
      <div className={`${PAGE_CONTAINER} ${PAGE_PY} min-w-0`}>
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Contact</p>
          <h1 className="mt-2 font-heading text-3xl sm:text-4xl md:text-[2.65rem]">Concierge desk</h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Appointments and bespoke tailoring in Bengaluru — or reach us digitally from anywhere in
            India. We arrange visits by appointment so every fitting gets the attention it deserves.
          </p>
        </header>

        <section aria-label="Map" className="mt-8 sm:mt-10">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
            <div className="relative aspect-4/3 min-h-[220px] w-full sm:aspect-21/9 sm:min-h-[280px] md:min-h-[320px]">
              <iframe
                title={`Map — ${SITE_ADDRESS_DISPLAY}`}
                src={mapSrc}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-col gap-2 border-t border-border/50 bg-card/90 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-sm text-muted-foreground">{SITE_ADDRESS_DISPLAY}</p>
              <Link
                href={SITE_GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Open in Google Maps
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-2 lg:gap-10 xl:gap-12">
          <div className="space-y-4">
            <h2 className="font-heading text-xl sm:text-2xl">Reach us</h2>
            <div className="grid gap-3 sm:gap-4">
              <ContactChip icon={Phone} label="Phone">
                <a href={`tel:${SITE_PHONE_DISPLAY.replace(/\s/g, "")}`} className="text-foreground hover:underline">
                  {SITE_PHONE_DISPLAY}
                </a>
              </ContactChip>
              <ContactChip icon={Mail} label="Email">
                <a href={`mailto:${SITE_EMAIL_DISPLAY}`} className="break-all text-foreground hover:underline">
                  {SITE_EMAIL_DISPLAY}
                </a>
              </ContactChip>
              <ContactChip icon={MapPin} label="Studio">
                <span>{SITE_ADDRESS_DISPLAY}</span>
              </ContactChip>
              <ContactChip icon={Clock} label="Hours">
                <span>10:00 — 19:00 IST · Tue–Sun</span>
                <span className="mt-1 block text-xs">Visits by appointment — message us to schedule.</span>
              </ContactChip>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </PageEnter>
  );
}
