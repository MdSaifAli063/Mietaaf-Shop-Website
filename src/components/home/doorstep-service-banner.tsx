import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Home, Ruler, SwatchBook } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { PAGE_IMAGE_LINKS } from "@/lib/data/image-links/page-images";
import { bypassImageOptimization } from "@/lib/image-source";

const serviceHighlights = [
  { icon: SwatchBook, label: "Curated fabric selection" },
  { icon: Ruler, label: "Measurements at home" },
  { icon: Home, label: "Personal style guidance" },
];

export function DoorstepServiceBanner() {
  return (
    <section className="bg-surface-cream py-12 sm:py-16 md:py-20 dark:bg-[#201d19]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-xl border border-[#b58a60]/25 bg-[#211e1a] px-5 py-8 text-white shadow-[0_8px_32px_rgba(36,39,33,0.035)] sm:rounded-xl sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <Image
              src={PAGE_IMAGE_LINKS.appointment.hero}
              unoptimized={bypassImageOptimization(PAGE_IMAGE_LINKS.appointment.hero)}
              alt="Mietaaf home service consultation"
              fill
              className="-z-20 object-cover object-[center_30%] opacity-60"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#1d1814]/96 via-[#1d1814]/85 to-[#1d1814]/30" />
            <div className="pointer-events-none absolute -right-20 -top-24 -z-10 size-72 rounded-full bg-[#d7af70]/20 blur-3xl" />

            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#efd7a8] sm:text-xs">
                <Home className="size-3.5" aria-hidden="true" />
                Door-to-door service
              </p>
              <h2 className="mt-4 max-w-xl font-heading text-3xl leading-[1.05] sm:text-4xl md:text-5xl">
                The Mietaaf atelier, at your doorstep.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/78 sm:text-base sm:leading-7">
                From fabric selection to precise measurements and personal styling, our team brings
                the complete Mietaaf experience to your home.
              </p>

              <div className="mt-6 grid gap-2.5 sm:grid-cols-3 sm:gap-3">
                {serviceHighlights.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-xs font-medium text-white/90 backdrop-blur-sm"
                  >
                    <Icon className="size-4 shrink-0 text-[#efd7a8]" aria-hidden="true" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild className="h-11 rounded-full border-mietaaf-cream bg-mietaaf-cream px-5 text-mietaaf-charcoal hover:border-mietaaf-cream/90 hover:bg-mietaaf-cream/90">
                  <Link href="/appointment">
                    Book home service
                    <ArrowUpRight className="ml-1.5 size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-white/30 bg-black/10 px-5 text-white hover:bg-white/12 hover:text-white"
                >
                  <Link href="/appointment#appointment-form">Request a visit</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
