import { PageEnter } from "@/components/motion/page-enter";

export default function ReturnsPage() {
  return (
    <PageEnter>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl">Return policy</h1>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Made-to-measure and altered pieces are generally final sale. Ready-to-wear items may be
            eligible for exchange within seven days of delivery if tags are intact and the garment
            is unworn.
          </p>
          <p>
            Because orders are coordinated via WhatsApp, please document any shipping damage within
            24 hours of receipt with photographs.
          </p>
          <p>Concierge will provide a return authorization before any shipment back to the atelier.</p>
        </div>
      </article>
    </PageEnter>
  );
}
