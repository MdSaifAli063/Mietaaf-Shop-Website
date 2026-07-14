"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/branding/social-brand-icons";
import { FOOTER_LINKS, SITE_SOCIAL_URLS, SITE_TAGLINE } from "@/lib/constants";
import { SITE_ADDRESS_DISPLAY, SITE_EMAIL_DISPLAY, SITE_PHONE_DISPLAY } from "@/lib/site-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background text-foreground dark:bg-card">
      <div className="mx-auto max-w-7xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,1fr))] lg:gap-10 xl:gap-12">
          {/* Brand: logo + blurb + social — left column, contained width */}
          <div className="flex min-w-0 max-w-full flex-col items-start gap-4 lg:pr-4">
            <Logo variant="footer" href="/" className="w-full max-w-full" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {SITE_TAGLINE}. Crafted silhouettes, ceremonial grandeur, and contemporary
              tailoring for the modern gentleman.
            </p>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  {
                    href: SITE_SOCIAL_URLS.linkedin,
                    label: "LinkedIn",
                    Icon: LinkedInIcon,
                  },
                  {
                    href: SITE_SOCIAL_URLS.instagram,
                    label: "Instagram",
                    Icon: InstagramIcon,
                  },
                  {
                    href: SITE_SOCIAL_URLS.facebook,
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
                  <Link href={l.href} className="hover:text-primary">
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
                  <Link href={l.href} className="hover:text-primary">
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
                  <Link href={l.href} className="hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Newsletter
            </h4>
            <p className="text-sm text-muted-foreground">
              Private previews, restocks, and event invitations.
            </p>
            <form
              className="flex touch-manipulation flex-col gap-2 sm:flex-row sm:items-stretch"
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
                className="min-h-11 min-w-0 flex-1 border-border/70 bg-background/70 text-foreground placeholder:text-muted-foreground"
              />
              <Button type="submit" className="h-11 w-full shrink-0 rounded-full sm:w-auto sm:px-8">
                Join
              </Button>
            </form>
            <div className="space-y-2 pt-2 text-sm text-muted-foreground">
              <p className="flex min-w-0 items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" /> <span>{SITE_PHONE_DISPLAY}</span>
              </p>
              <p className="flex min-w-0 items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" /> <span className="break-all">{SITE_EMAIL_DISPLAY}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {SITE_ADDRESS_DISPLAY} — by appointment.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-border/70 pt-6 text-center text-xs text-muted-foreground sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-8 sm:text-start">
          <p className="px-2">© {new Date().getFullYear()} Mietaaf. All rights reserved.</p>
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
