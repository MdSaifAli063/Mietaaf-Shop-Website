"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/branding/social-brand-icons";
import { FOOTER_LINKS } from "@/lib/constants";
import { SITE_ADDRESS_DISPLAY, SITE_EMAIL_DISPLAY, SITE_PHONE_DISPLAY } from "@/lib/site-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function SiteFooter() {
  const { settings } = useSiteSettings();
  return (
    <footer className="border-t border-border/80 bg-surface-silver text-foreground">
      <div className="mx-auto max-w-7xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-10 md:gap-12 lg:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,1fr))] lg:gap-10 xl:gap-12">
          {/* Brand: logo + blurb + social — left column, contained width */}
          <div className="col-span-2 flex min-w-0 max-w-full flex-col items-start gap-4 md:col-span-1 lg:pr-4">
            <Logo variant="footer" href="/" className="w-full max-w-full" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {settings.brandTagline}. {settings.footerDescription}
            </p>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  {
                    href: settings.linkedinUrl,
                    label: "LinkedIn",
                    Icon: LinkedInIcon,
                  },
                  {
                    href: settings.instagramUrl,
                    label: "Instagram",
                    Icon: InstagramIcon,
                  },
                  {
                    href: settings.facebookUrl,
                    label: "Facebook",
                    Icon: FacebookIcon,
                  },
                ] as const
              ).map(({ href, label, Icon }) => {
                const external = href.startsWith("http");
                return (
                  <Link
                    key={label}
                    href={href}
                    {...(external
                      ? { target: "_blank" as const, rel: "noopener noreferrer" }
                      : {})}
                    className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-border/70 text-foreground/80 transition-colors hover:border-primary hover:text-primary"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {FOOTER_LINKS.shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-9 items-center py-1 hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {FOOTER_LINKS.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-9 items-center py-1 hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="mb-4 mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {FOOTER_LINKS.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-9 items-center py-1 hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 min-w-0 space-y-4 md:col-span-1">
            <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Newsletter
            </h4>
            <p className="text-sm text-muted-foreground">
              Private previews, restocks, and event invitations.
            </p>
            <form
              className="flex touch-manipulation flex-col gap-2 sm:flex-row sm:items-stretch lg:flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("You are on the list.");
              }}
            >
              <Input
                id="mietaaf-footer-newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="Email"
                aria-label="Newsletter email address"
                className="min-h-12 min-w-0 flex-1 rounded-md border-border bg-card text-foreground placeholder:text-muted-foreground"
              />
              <Button type="submit" className="h-12 w-full shrink-0 rounded-md sm:w-auto sm:px-8 lg:w-full">
                Join
              </Button>
            </form>
            <div className="space-y-2 pt-2 text-sm text-muted-foreground">
              <p className="flex min-w-0 items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" /> <span>{settings.phoneDisplay || SITE_PHONE_DISPLAY}</span>
              </p>
              <p className="flex min-w-0 items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" /> <span className="break-all">{settings.supportEmail || SITE_EMAIL_DISPLAY}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {settings.address || SITE_ADDRESS_DISPLAY} — by appointment.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-border/70 pb-12 pt-6 text-center text-xs text-muted-foreground sm:mt-12 sm:pt-8 lg:flex-row lg:flex-wrap lg:justify-between lg:text-start">
          <p className="px-2">© {new Date().getFullYear()} Mietaaf Couture. All rights reserved.</p>
          <span>
              Design and Develop by{" "}
              <a
                href="https://softtrickscode.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Soft Tricks Code
              </a>
            </span>
          <div className="flex max-w-full flex-wrap justify-center gap-2 sm:justify-end sm:gap-3">
            <span className="rounded-full border border-border/70 px-3 py-1">Secure checkout via WhatsApp</span>
            <span className="rounded-full border border-border/70 px-3 py-1">Made in India</span>
            <span className="rounded-full border border-border/70 px-3 py-1">Concierge support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
