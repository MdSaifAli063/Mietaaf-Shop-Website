import type { Metadata } from "next";
import { PageEnter } from "@/components/motion/page-enter";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import { publicPageMetadata } from "@/lib/seo";
import { BRAND_FAQS } from "@/lib/brand-faq";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = publicPageMetadata({
  title: "Ordering, Fittings & Studio FAQs",
  description:
    "Find Mietaaf Couture in Bangalore, book a studio or doorstep fitting, and learn how sizing, delivery and WhatsApp-only checkout work.",
  path: "/faq",
});


export default function FaqPage() {
  return (
    <PageEnter>
      <FaqJsonLd items={BRAND_FAQS} />
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Questions & Answers", url: "/faq" }]} />
      <div className={`${PAGE_CONTAINER} ${PAGE_PY} mx-auto max-w-3xl min-w-0`}>
        <h1 className="font-heading text-3xl sm:text-4xl">Your Mietaaf Couture questions, answered.</h1>
        <div className="mt-8 divide-y divide-border/60 border-y border-border/60">
          {BRAND_FAQS.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none font-medium outline-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-xs text-muted-foreground group-open:rotate-180">▼</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </PageEnter>
  );
}
