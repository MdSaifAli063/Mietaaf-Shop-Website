import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/** Server-rendered business context, readable without JavaScript or a carousel. */
export function BrandIntroduction() {
  return (
    <section aria-labelledby="mietaaf-couture-heading" className="border-b border-border/60 bg-surface-paper py-10 sm:py-14">
      <div className="page-container grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-14">
        <div>
          <p className="atelier-eyebrow">Custom-Tailored Menswear · Bangalore</p>
          <h1 id="mietaaf-couture-heading" className="mt-3 font-heading text-4xl leading-tight tracking-[-0.025em] sm:text-5xl">Mietaaf Couture</h1>
        </div>
        <div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Suits for your everyday presence. Sherwanis for your biggest moments. Discover custom-tailored suits,
            wedding menswear and Indo-Western tailoring at our studio in Shivaji Nagar, Bengaluru (Bangalore).
            Visit by appointment, request a doorstep consultation, and confirm your order through WhatsApp.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
            <Link href="/about" className="atelier-link inline-flex min-h-11 items-center gap-2 text-xs">Our atelier <ArrowUpRight className="size-3.5" aria-hidden="true" /></Link>
            <Link href="/contact" className="atelier-link inline-flex min-h-11 items-center gap-2 text-xs">Visit us in Bangalore <ArrowUpRight className="size-3.5" aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
