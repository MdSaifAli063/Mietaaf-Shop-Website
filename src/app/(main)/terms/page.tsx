import type { Metadata } from "next";
import { PageEnter } from "@/components/motion/page-enter";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Terms & Conditions",
  description:
    "Review Mietaaf website terms for browsing collections, consultations, orders, availability, and product information.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PageEnter>
      <article className={`${PAGE_CONTAINER} ${PAGE_PY} mx-auto max-w-3xl min-w-0`}>
        <h1 className="font-heading text-3xl sm:text-4xl">Terms &amp; conditions</h1>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            By using this website you agree to these terms. Product imagery is representative;
            subtle variations in embroidery, dye lots, and fabric texture may occur.
          </p>
          <p>
            Prices are listed in INR unless stated otherwise. Availability is confirmed by the
            Mietaaf team after you initiate an order via WhatsApp.
          </p>
          <p>
            Nothing on this site constitutes legal, tax, or tailoring advice — final agreements are
            confirmed directly with the brand.
          </p>
        </div>
      </article>
    </PageEnter>
  );
}
