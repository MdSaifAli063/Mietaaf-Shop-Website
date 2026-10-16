import Link from "next/link";
import { MessageCircle, Ruler, SwatchBook } from "lucide-react";

const services = [
  { icon: SwatchBook, title: "Curated fabrics", detail: "Considered in every detail", href: "/fabrics" },
  { icon: Ruler, title: "Personal fittings", detail: "At home or in our atelier", href: "/appointment" },
  { icon: MessageCircle, title: "WhatsApp checkout", detail: "Personal assistance with your order", href: "/contact" },
];

export function ShoppingAssurance() {
  return (
    <section aria-label="The Mietaaf shopping experience" className="border-b border-border/80 bg-surface-paper">
      <div className="page-container grid grid-cols-3 divide-x divide-border/80 py-4 sm:py-5">
        {services.map(({ icon: Icon, title, detail, href }) => (
          <Link key={title} href={href} className="group flex min-w-0 flex-col items-center justify-center gap-2 px-2 text-center sm:flex-row sm:gap-3 sm:px-5 sm:text-left">
            <Icon className="size-4 shrink-0 stroke-[1.3] text-primary sm:size-5" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-[9px] font-medium uppercase leading-4 tracking-[0.08em] group-hover:text-primary sm:text-[10px] sm:tracking-[0.14em]">{title}</span>
              <span className="mt-1 hidden text-xs text-muted-foreground lg:block">{detail}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
