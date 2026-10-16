import type { Metadata } from "next";
import { PageEnter } from "@/components/motion/page-enter";
import { ContactForm } from "@/components/contact/contact-form";
import {
  ContactBusinessDetails,
  ContactBusinessMap,
} from "@/components/contact/contact-business-info";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import { publicPageMetadata } from "@/lib/seo";
import { PageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = publicPageMetadata({
  title: "Contact & Bangalore Studio",
  description:
    "Visit Mietaaf Couture in Shivaji Nagar, Bangalore (Bengaluru). Contact our team for custom-tailored suits, wedding menswear, studio appointments and doorstep fittings.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageEnter>
      <PageJsonLd type="ContactPage" title="Contact Mietaaf Couture in Bangalore" description="Studio visits by appointment in Shivaji Nagar, Bengaluru, with WhatsApp assistance for orders and fittings." path="/contact" />
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }]} />
      <div className="min-h-screen bg-surface-paper dark:bg-[#181613]">
        <div className={`${PAGE_CONTAINER} ${PAGE_PY} min-w-0`}>
          <header className="max-w-3xl rounded-xl border border-border/60 bg-surface-cream px-6 py-8 sm:px-9 sm:py-10 dark:bg-[#201d19]">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Contact</p>
            <h1 className="mt-2 font-heading text-3xl sm:text-4xl md:text-[2.65rem]">Mietaaf Couture, Bangalore.</h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Appointments and custom tailoring in Bengaluru — or reach us digitally from anywhere in India. We arrange visits by appointment so every fitting gets the attention it deserves.
            </p>
          </header>

          <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-2 lg:gap-10 xl:gap-12">
            <ContactBusinessDetails />
            <ContactForm />
          </div>

          <ContactBusinessMap />
        </div>
      </div>
    </PageEnter>
  );
}
