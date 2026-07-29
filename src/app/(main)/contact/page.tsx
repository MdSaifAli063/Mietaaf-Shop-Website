import type { Metadata } from "next";
import { PageEnter } from "@/components/motion/page-enter";
import { ContactForm } from "@/components/contact/contact-form";
import {
  ContactBusinessDetails,
  ContactBusinessMap,
} from "@/components/contact/contact-business-info";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Contact",
  description:
    "Contact Mietaaf for wedding menswear, premium suits, custom fittings, fabric consultations, and Bengaluru appointments.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageEnter>
      <div className="min-h-screen bg-[#fbf8f2] dark:bg-[#181613]">
        <div className={`${PAGE_CONTAINER} ${PAGE_PY} min-w-0`}>
          <header className="max-w-3xl rounded-[2rem] border border-border/60 bg-[#eee4d6] px-6 py-8 sm:px-9 sm:py-10 dark:bg-[#201d19]">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Contact</p>
            <h1 className="mt-2 font-heading text-3xl sm:text-4xl md:text-[2.65rem]">Concierge desk</h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Appointments and bespoke tailoring in Bengaluru — or reach us digitally from anywhere in India. We arrange visits by appointment so every fitting gets the attention it deserves.
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
