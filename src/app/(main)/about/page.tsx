import Image from "next/image";
import Link from "next/link";
import { PageEnter } from "@/components/motion/page-enter";
import { Button } from "@/components/ui/button";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import { UNSPLASH_PHOTOS, unsplashImageUrl } from "@/lib/unsplash-images";

const hero = unsplashImageUrl(UNSPLASH_PHOTOS.weddingSherwani, 1600, 80);
const craft = unsplashImageUrl(UNSPLASH_PHOTOS.designer, 1200, 80);
const stitch = unsplashImageUrl(UNSPLASH_PHOTOS.festiveGold, 1200, 80);
const studio = unsplashImageUrl(UNSPLASH_PHOTOS.tailoring, 1100, 80);

const pillars = [
  {
    title: "Ceremony-first design",
    body: "Silhouettes built for baraat light, mandap stillness, and reception movement — each piece considered for how photography, fabric, and tailoring read together.",
  },
  {
    title: "Fabric with intent",
    body: "Silk, wool blends, and metallics are sourced and tested for drape longevity. We prefer honest weight and hand-feel over flashy sheen that won’t travel well.",
  },
  {
    title: "Concierge clarity",
    body: "Sizing, alterations, and timelines are confirmed conversationally — WhatsApp keeps decisions fast and documented so there is no ambiguity before your event.",
  },
] as const;

export default function AboutPage() {
  return (
    <PageEnter>
      <div className="min-h-screen bg-[#fbf8f2] dark:bg-[#181613]">
      <div className={`${PAGE_CONTAINER} ${PAGE_PY} min-w-0`}>
        <div className="grid items-center gap-8 rounded-[2rem] border border-border/60 bg-[#eee4d6] p-6 shadow-[0_22px_60px_rgba(58,48,38,0.06)] sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10 xl:gap-16 dark:bg-[#201d19]">
          <div className="max-w-xl lg:max-w-none">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">About</p>
            <h1 className="mt-3 font-heading text-3xl sm:text-4xl md:text-5xl xl:text-[3.25rem]">
              Mietaaf atelier
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              A luxury men&apos;s house for modern Indian ceremony — sherwanis, indo-western tailoring,
              and precision layering for moments that ask for presence without excess.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We are based in Bengaluru with a studio-by-appointment ethos: focused fittings, honest
              timelines, and wardrobes that feel cinematic in person and dignified in archival
              imagery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <Link href="/shop">View collections</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/contact">Plan a visit</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-muted shadow-lg ring-1 ring-black/5 sm:aspect-5/6 lg:min-h-[min(60vh,560px)] lg:aspect-auto dark:ring-white/10">
            <Image
              src={hero}
              alt="Mietaaf ceremonial tailoring"
              fill
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/50 to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 text-sm font-medium text-white drop-shadow-sm sm:bottom-7 sm:left-7">
              Craft for the aisle, the stage, and everything after.
            </p>
          </div>
        </div>

        <section className="mt-14 rounded-[2rem] border border-border/50 bg-[#eee4d6] p-6 sm:mt-16 sm:p-8 md:mt-20 md:grid md:grid-cols-2 md:gap-10 lg:gap-14 lg:p-10 dark:bg-[#201d19]">
          <div className="relative aspect-16/11 overflow-hidden rounded-2xl bg-muted ring-1 ring-black/5 md:aspect-auto md:min-h-[340px] dark:ring-white/10">
            <Image
              src={craft}
              alt="Detailed embroidery and fabric"
              fill
              sizes="(max-width:768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="mt-8 space-y-6 md:mt-0 md:flex md:flex-col md:justify-center">
            <h2 className="font-heading text-2xl sm:text-3xl">The work</h2>
            <p className="leading-relaxed text-muted-foreground">
              Each silhouette moves through pattern, drape study, and finishing — how a lapel sits
              under stage light, how embroidery scales at a distance, how a hem falls over formal
              footwear. We design for the photographer&apos;s frame and for the comfort of a long
              celebration.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Our team collaborates with clients across India: digital measurements, courier swatches
              when helpful, and studio sessions in Bengaluru when a hands-on fitting is the right
              answer.
            </p>
          </div>
        </section>

        <section className="mt-14 sm:mt-16 md:mt-20">
          <h2 className="font-heading text-2xl sm:text-3xl">How we think</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Three principles keep Mietaaf cohesive from first sketch to final steam before delivery.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3 sm:gap-6">
            {pillars.map(({ title, body }) => (
              <li
                key={title}
                className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm ring-1 ring-black/4 dark:bg-card dark:ring-white/5"
              >
                <h3 className="font-heading text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14 grid gap-6 sm:mt-16 md:mt-20 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-muted md:col-span-2 md:aspect-auto md:min-h-[300px] lg:col-span-1 lg:aspect-4/5 lg:min-h-0">
            <Image src={stitch} alt="Gold thread and occasion wear" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-muted md:col-span-2 lg:col-span-2 lg:min-h-[300px]">
            <Image src={studio} alt="Tailoring workspace" fill sizes="(max-width:1024px) 100vw, 66vw" className="object-cover" />
            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/60 via-black/20 to-transparent p-6 sm:p-8">
              <p className="max-w-xl text-lg font-heading text-white drop-shadow">
                Made in India, minded for the modern gentleman.
              </p>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/90 drop-shadow">
                We believe Indian menswear deserves the same narrative care as global luxury — with
                tailoring languages that honour craft and fit the way you actually live.
              </p>
            </div>
          </div>
        </div>

        <aside className="mt-14 rounded-[2rem] border border-border/60 bg-[#eee4d6] px-6 py-8 text-center sm:mt-16 md:mt-20 md:px-10 dark:bg-[#201d19]">
          <p className="font-heading text-xl text-foreground sm:text-2xl">
            Ready for a conversation?
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Share your date, city, and the pieces you are considering — we&apos;ll guide fit, fabric,
            and timeline.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/contact">Contact concierge</Link>
          </Button>
        </aside>
      </div>
      </div>
    </PageEnter>
  );
}
