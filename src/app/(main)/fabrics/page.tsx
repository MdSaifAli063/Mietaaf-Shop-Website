import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Layers3, Scissors, Sparkles } from "lucide-react";
import { PageEnter } from "@/components/motion/page-enter";
import { Button } from "@/components/ui/button";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Fabrics",
  description:
    "Discover the upcoming Mietaaf fabric library for ceremonial, festive, and formal tailoring.",
};

const fabricFamilies = [
  {
    name: "Ceremonial silks",
    note: "Rich hand-feel for sherwanis, achkans, and wedding layers.",
    className:
      "bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.55),transparent_25%),linear-gradient(135deg,#d8c29d,#9f7445)]",
  },
  {
    name: "Heritage brocades",
    note: "Woven motifs and considered metallic detail for festive occasions.",
    className:
      "bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.12)_0_2px,transparent_2px_12px),linear-gradient(135deg,#6f2430,#b9794b)]",
  },
  {
    name: "Tailoring wools",
    note: "Elegant structure and dependable drape for suits and tuxedos.",
    className:
      "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.06)_0_1px,transparent_1px_8px),linear-gradient(135deg,#17252b,#4e5e5b)]",
  },
  {
    name: "Linen blends",
    note: "Breathable texture for refined daytime and destination dressing.",
    className:
      "bg-[repeating-linear-gradient(0deg,rgba(91,72,48,0.08)_0_1px,transparent_1px_6px),linear-gradient(135deg,#e6ddca,#b9ad91)]",
  },
] as const;

const previewSteps = [
  {
    icon: Layers3,
    title: "Explore the edit",
    text: "Browse curated fabrics selected for Mietaaf silhouettes.",
  },
  {
    icon: Sparkles,
    title: "Compare the details",
    text: "Understand texture, weight, colour, and occasion suitability.",
  },
  {
    icon: Scissors,
    title: "Tailor your piece",
    text: "Choose a fabric during your studio or home consultation.",
  },
] as const;

export default function FabricsPage() {
  return (
    <PageEnter>
      <div className="min-h-screen bg-[#fbf8f2] dark:bg-[#181613]">
        <div className={`${PAGE_CONTAINER} ${PAGE_PY} min-w-0`}>
          <header className="relative isolate overflow-hidden rounded-[2rem] border border-border/60 bg-[#eee4d6] shadow-[0_24px_70px_rgba(58,48,38,0.08)] dark:bg-[#201d19]">
            <div className="pointer-events-none absolute -left-28 -top-32 size-80 rounded-full bg-[#c59b66]/15 blur-3xl" />
            <div className="grid items-center gap-8 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:px-12 lg:py-14">
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/65 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Coming soon
                </span>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                  The Mietaaf fabric library
                </p>
                <h1 className="mt-3 max-w-xl font-heading text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
                  Begin with the fabric.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  A considered library of silks, brocades, wool blends, velvets, and
                  breathable linens—selected for drape, comfort, and occasion.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button asChild className="h-11 rounded-full px-6">
                    <Link href="/appointment">
                      <CalendarDays className="mr-2 size-4" aria-hidden="true" />
                      Book a fabric consultation
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-11 rounded-full px-6">
                    <Link href="/contact">
                      Contact concierge
                      <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative mx-auto h-[340px] w-full max-w-[520px] sm:h-[430px]">
                <div className="absolute left-[2%] top-[13%] h-[74%] w-[54%] rotate-[-7deg] overflow-hidden rounded-[1.7rem] border border-white/50 bg-[linear-gradient(135deg,#e9ddc6,#a9875c)] shadow-[0_24px_60px_rgba(49,37,25,0.2)]">
                  <span className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.12)_0_2px,transparent_2px_15px)]" />
                  <span className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#3d3025]">
                    Silk
                  </span>
                </div>
                <div className="absolute right-[2%] top-[4%] h-[72%] w-[55%] rotate-[6deg] overflow-hidden rounded-[1.7rem] border border-white/20 bg-[linear-gradient(140deg,#1d3a35,#0e1917)] shadow-[0_28px_70px_rgba(24,28,24,0.28)]">
                  <span className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(212,181,120,0.55)_0_2px,transparent_3px),radial-gradient(circle_at_70%_65%,rgba(212,181,120,0.4)_0_2px,transparent_3px)] bg-[length:32px_32px]" />
                  <span className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#f1dfbd]">
                    Brocade
                  </span>
                </div>
                <div className="absolute bottom-[1%] left-[23%] h-[48%] w-[58%] rotate-[-1deg] overflow-hidden rounded-[1.7rem] border border-white/20 bg-[linear-gradient(135deg,#4b4b4a,#171716)] shadow-[0_30px_70px_rgba(20,18,16,0.3)]">
                  <span className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_7px)]" />
                  <span className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
                    Fine wool
                  </span>
                </div>
              </div>
            </div>
          </header>

          <section className="mt-12 sm:mt-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-primary">
                Preview
              </p>
              <h2 className="mt-2 font-heading text-3xl sm:text-4xl">
                Materials we are curating
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                The online fabric library is being prepared. These are the families that
                will shape the first Mietaaf edit.
              </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {fabricFamilies.map((fabric) => (
                <article
                  key={fabric.name}
                  className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-card/75 shadow-[0_16px_45px_rgba(58,48,38,0.06)]"
                >
                  <div className={`relative aspect-[4/3] ${fabric.className}`}>
                    <span className="absolute inset-3 rounded-[1rem] border border-white/25" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-xl">{fabric.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {fabric.note}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-[2rem] border border-border/60 bg-[#f1e8dc] p-6 sm:mt-16 sm:p-8 lg:p-10 dark:bg-[#201d19]">
            <div className="grid gap-6 md:grid-cols-3">
              {previewSteps.map(({ icon: Icon, title, text }, index) => (
                <div key={title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-background/70 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-1 font-heading text-xl">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="mt-12 overflow-hidden rounded-[2rem] bg-[#1f1f1d] px-6 py-10 text-center text-white sm:mt-16 sm:px-10 sm:py-12">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#d8b98c]">
              Coming soon
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl font-heading text-3xl sm:text-4xl">
              The Mietaaf fabric experience is being woven.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              Until the online library opens, our concierge can guide fabrics during a
              home service or Bengaluru studio appointment.
            </p>
            <Button
              asChild
              variant="secondary"
              className="mt-7 h-11 rounded-full bg-[#f7f1e8] px-7 text-[#1f1f1d] hover:bg-white"
            >
              <Link href="/appointment">Book an appointment</Link>
            </Button>
          </aside>
        </div>
      </div>
    </PageEnter>
  );
}
