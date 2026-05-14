"use client";

import Link from "next/link";
import { Share2, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { FOOTER_LINKS, SITE_TAGLINE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-mietaaf-charcoal text-mietaaf-cream dark:bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,1fr))] lg:gap-10 xl:gap-12">
          {/* Brand: logo + blurb + social — left column, contained width */}
          <div className="flex min-w-0 max-w-full flex-col items-start gap-4 lg:pr-4">
            <Logo variant="footer" href="/" className="w-full max-w-full" />
            <p className="max-w-sm text-sm leading-relaxed text-mietaaf-cream/80">
              {SITE_TAGLINE}. Crafted silhouettes, ceremonial grandeur, and contemporary
              tailoring for the modern gentleman.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Instagram", "Facebook", "Pinterest"].map((s) => (
                <Link
                  key={s}
                  href="#"
                  className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-white/15 text-mietaaf-cream/90 transition-colors hover:border-primary hover:text-primary"
                  aria-label={s}
                >
                  <Share2 className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-mietaaf-cream/85">
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
            <ul className="space-y-2 text-sm text-mietaaf-cream/85">
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
            <ul className="space-y-2 text-sm text-mietaaf-cream/85">
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
            <p className="text-sm text-mietaaf-cream/80">
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
                className="min-h-11 min-w-0 flex-1 border-white/20 bg-white/5 text-mietaaf-cream placeholder:text-mietaaf-cream/50"
              />
              <Button type="submit" className="h-11 w-full shrink-0 rounded-full sm:w-auto sm:px-8">
                Join
              </Button>
            </form>
            <div className="space-y-2 pt-2 text-sm text-mietaaf-cream/80">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> +91 99999 99999
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> care@mietaaf.com
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Atelier District, Mumbai — by appointment.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/10 pt-6 text-center text-xs text-mietaaf-cream/60 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-8 sm:text-start">
          <p className="px-2">© {new Date().getFullYear()} Mietaaf. All rights reserved.</p>
          <div className="flex max-w-full flex-wrap justify-center gap-2 sm:justify-end sm:gap-3">
            <span className="rounded-full border border-white/15 px-3 py-1">Secure checkout via WhatsApp</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Made in India</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Concierge support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
