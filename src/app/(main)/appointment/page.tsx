import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Clock,
  Home,
  MapPin,
  Ruler,
  Scissors,
  Sparkles,
  SwatchBook,
} from "lucide-react";
import { AppointmentBookingForm } from "@/components/appointment/appointment-booking-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageEnter } from "@/components/motion/page-enter";
import { PAGE_IMAGE_LINKS } from "@/lib/data/image-links/page-images";
import { PAGE_CONTAINER } from "@/lib/layout";
import { SITE_PHONE_DISPLAY } from "@/lib/site-contact";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Book an Appointment",
  description:
    "Book Mietaaf home service for curated fabric collections, measurements, and custom menswear consultation in Bengaluru.",
  path: "/appointment",
  image: PAGE_IMAGE_LINKS.appointment.hero,
});

const steps = [
  {
    icon: CalendarCheck,
    title: "Choose your slot",
    text: "Share your preferred date, time, outfit need, and location.",
  },
  {
    icon: SwatchBook,
    title: "Explore fabrics",
    text: "We bring a curated selection of premium fabrics, trims, and styling references.",
  },
  {
    icon: Ruler,
    title: "Measurements at home",
    text: "Our team captures fitting details and notes your comfort preferences.",
  },
  {
    icon: BadgeCheck,
    title: "Confirm design",
    text: "Finalize fabric, silhouette, delivery plan, and next tailoring steps.",
  },
];

const serviceCards = [
  {
    icon: Home,
    title: "Home consultation",
    text: "A personal appointment at your home for fabric selection and styling guidance.",
  },
  {
    icon: Scissors,
    title: "Custom tailoring",
    text: "Sherwanis, suits, tuxedos, blazers, kurta sets, and wedding party looks.",
  },
  {
    icon: Sparkles,
    title: "Occasion planning",
    text: "Outfit direction for weddings, receptions, festive events, and formal evenings.",
  },
];

export default function AppointmentPage() {
  return (
    <PageEnter>
      <main className="min-h-screen bg-[#fbf8f2] text-foreground dark:bg-[#181613]">
        <section className="relative isolate overflow-hidden bg-[#171512] text-white">
          <div className="absolute inset-0">
            <Image
              src={PAGE_IMAGE_LINKS.appointment.hero}
              alt="Mietaaf premium menswear consultation"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_22%] opacity-72"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/78 via-black/46 to-black/18" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#fbf8f2] to-transparent dark:from-[#181613]" />
          </div>

          <div className={`${PAGE_CONTAINER} relative z-10 grid min-h-[calc(100svh-8rem)] items-end gap-8 py-10 sm:min-h-[620px] sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-16`}>
            <div className="max-w-3xl pb-6">
              <Badge className="border-white/20 bg-white/10 text-white backdrop-blur">
                Home service in Bengaluru
              </Badge>
              <h1 className="mt-5 max-w-3xl font-heading text-4xl leading-[0.95] sm:text-6xl lg:text-7xl">
                Custom fittings, fabrics, and measurements at your doorstep.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/82 sm:text-lg">
                Book a Mietaaf appointment for curated fabric collections, style guidance,
                and precise measurements for your next celebration or formal occasion.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 rounded-full px-6">
                  <a href="#appointment-form">
                    Book an appointment
                    <ArrowRight className="size-4" aria-hidden />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/30 bg-black/15 px-6 text-white hover:bg-white/10"
                >
                  <Link href="/contact">Contact concierge</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 rounded-[2rem] border border-white/16 bg-black/30 p-4 backdrop-blur-md sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-2xl font-semibold">40+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/68">Fabric options</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-2xl font-semibold">60 min</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/68">Visit window</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-2xl font-semibold">1:1</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/68">Style support</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${PAGE_CONTAINER} py-12 sm:py-16`}>
          <div className="grid gap-5 md:grid-cols-3">
            {serviceCards.map((service) => (
              <div
                key={service.title}
                className="rounded-[1.6rem] border border-border/60 bg-card/88 p-5 shadow-[0_18px_50px_rgba(58,48,38,0.08)]"
              >
                <div className="flex size-11 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                  <service.icon className="size-5" aria-hidden />
                </div>
                <h2 className="mt-4 font-heading text-2xl">{service.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#eee4d6] py-12 dark:bg-[#201d19] sm:py-16">
          <div className={PAGE_CONTAINER}>
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                  How it works
                </p>
                <h2 className="mt-3 font-heading text-3xl sm:text-4xl">
                  A smooth appointment from first message to final fit.
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  We keep the process simple: choose a time, review fabrics, get measured,
                  and confirm the next tailoring step with complete clarity.
                </p>
                <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Clock className="size-4 text-primary" aria-hidden />
                    Available Tuesday to Sunday, 10:00 to 19:00 IST
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="size-4 text-primary" aria-hidden />
                    Home service currently focused on Bengaluru
                  </span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="relative rounded-[1.6rem] border border-border/60 bg-background/70 p-5"
                  >
                    <span className="absolute right-5 top-5 font-heading text-4xl text-primary/18">
                      0{index + 1}
                    </span>
                    <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <step.icon className="size-5" aria-hidden />
                    </div>
                    <h3 className="mt-5 font-heading text-xl">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="appointment-form" className={`${PAGE_CONTAINER} scroll-mt-28 py-12 sm:py-16`}>
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
              Book an appointment
            </p>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl">
              Share your details and we will confirm your visit.
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Need help before booking? Call us at{" "}
              <a href={`tel:${SITE_PHONE_DISPLAY.replace(/\s/g, "")}`} className="text-foreground underline underline-offset-4">
                {SITE_PHONE_DISPLAY}
              </a>
              .
            </p>
          </div>
          <AppointmentBookingForm />
        </section>
      </main>
    </PageEnter>
  );
}
