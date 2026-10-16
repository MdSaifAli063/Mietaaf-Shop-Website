import Link from "next/link";
import { Plus } from "lucide-react";
import { BRAND_FAQS } from "@/lib/brand-faq";

export function BrandQuestions() {
  return (
    <section aria-labelledby="brand-questions-heading" className="atelier-section border-t border-border/60 bg-surface-paper">
      <div className="page-container grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div>
          <p className="atelier-eyebrow">A little guidance</p>
          <h2 id="brand-questions-heading" className="mt-3 font-heading text-4xl leading-tight">Before your first fitting.</h2>
          <Link href="/faq" className="atelier-link mt-5 inline-flex min-h-11 items-center text-xs">All questions & answers</Link>
        </div>
        <div className="divide-y divide-border/70 border-y border-border/70">
          {BRAND_FAQS.slice(0, 4).map(({ q, a }) => (
            <details key={q} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                {q}<Plus className="size-4 shrink-0 text-primary transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
