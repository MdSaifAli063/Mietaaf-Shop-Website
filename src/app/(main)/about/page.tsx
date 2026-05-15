import { PageEnter } from "@/components/motion/page-enter";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";

export default function AboutPage() {
  return (
    <PageEnter>
      <article className={`${PAGE_CONTAINER} ${PAGE_PY} mx-auto max-w-3xl min-w-0`}>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">About</p>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl md:text-5xl">Mietaaf atelier</h1>
        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Mietaaf is a luxury men’s fashion house rooted in modern Indian ceremony — sherwanis,
            indo-western tailoring, and precision suiting for moments that demand presence.
          </p>
          <p>
            Each silhouette is developed with fabric-first thinking: how silk catches light, how
            wool holds structure, how gold thread reads on ivory fields. Our concierge team
            finalizes fit and logistics directly with you — including WhatsApp-first ordering for
            clarity and speed.
          </p>
          <p>
            We believe the future of Indian menswear is cinematic: confident, global, and deeply
            respectful of craft.
          </p>
        </div>
      </article>
    </PageEnter>
  );
}
