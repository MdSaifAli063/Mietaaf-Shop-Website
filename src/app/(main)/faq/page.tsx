import { PageEnter } from "@/components/motion/page-enter";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Add pieces to your cart, complete checkout with your delivery details, and you will be redirected to WhatsApp with a pre-filled message for the Mietaaf team.",
  },
  {
    q: "Do you accept online card payments?",
    a: "Not on this storefront. Orders are confirmed conversationally via WhatsApp where the team shares payment and tailoring options.",
  },
  {
    q: "Can I visit the atelier?",
    a: "Yes — appointments are recommended. Contact concierge with your city and preferred dates.",
  },
  {
    q: "What about alterations?",
    a: "Minor alterations guidance is provided remotely; complex fits may be scheduled in-studio.",
  },
];

export default function FaqPage() {
  return (
    <PageEnter>
      <div className={`${PAGE_CONTAINER} ${PAGE_PY} mx-auto max-w-3xl min-w-0`}>
        <h1 className="font-heading text-3xl sm:text-4xl">FAQ</h1>
        <div className="mt-8 divide-y divide-border/60 border-y border-border/60">
          {faqs.map((f) => (
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
