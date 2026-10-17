import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, CalendarDays, Layers3, MessageCircle, Scissors } from "lucide-react";
import { FabricLibrary, FabricLibraryStats } from "@/components/fabrics/fabric-library";
import { PageEnter } from "@/components/motion/page-enter";
import { BreadcrumbJsonLd, JsonLdScript } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { FABRIC_HERO_IMAGE, fabricReferencePath } from "@/lib/data/fabrics";
import { getServerFabrics } from "@/lib/server-fabrics";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import { absoluteUrl, publicPageMetadata } from "@/lib/seo";

export const revalidate = 60;
const description = "Explore Mietaaf Couture’s fabric library for custom-tailored menswear. Browse colour and design catalogues, enquire on WhatsApp or book a Bangalore fabric consultation.";
export const metadata: Metadata = publicPageMetadata({
  title: "Fabric Catalogues & Personal Tailoring", description, path: "/fabrics",
  keywords: ["fabric catalogue Bangalore", "jacquard fabric designs", "shirt fabrics", "Mietaaf fabric consultation"],
});
const steps = [
  { icon: Layers3, title: "Discover your fabric", text: "Explore colours and textures, then view the complete catalogue for the finer details." },
  { icon: MessageCircle, title: "Make it personal", text: "Send us your chosen design on WhatsApp. We’ll guide you on pricing and availability." },
  { icon: Scissors, title: "Meet for a fitting", text: "See the fabric in person and plan your piece at our Bengaluru studio or a home consultation." },
];

export default async function FabricsPage() {
  const catalogues = await getServerFabrics();
  return <PageEnter>
    <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Fabric library", url: "/fabrics" }]} />
    <JsonLdScript data={{
      "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${absoluteUrl("/fabrics")}#webpage`,
      name: "Mietaaf Couture Fabric Library", description, url: absoluteUrl("/fabrics"),
      isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      mainEntity: { "@type": "ItemList", numberOfItems: catalogues.length, itemListElement: catalogues.map((catalogue, index) => ({
        "@type": "ListItem", position: index + 1, item: { "@type": "CreativeWork", name: catalogue.title,
          description: catalogue.description, url: absoluteUrl(fabricReferencePath(catalogue)),
          image: absoluteUrl(catalogue.image) },
      })) },
    }} />
    <div className="min-h-screen bg-surface-paper">
      <div className={`${PAGE_CONTAINER} ${PAGE_PY}`}>
        <header className="grid overflow-hidden rounded-2xl border border-border/70 bg-background lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary">The Mietaaf fabric library</p>
            <h1 className="mt-5 max-w-lg font-heading text-5xl leading-[.98] sm:text-6xl lg:text-[68px]">Begin with<br />the fabric.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">Rich colour, intricate jacquards, refined shirting. Discover the fabric that feels like you, then let us shape it into something personal.</p>
            <div className="mt-7 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap">
              <Button asChild className="h-11 rounded-full px-5"><a href="#catalogues">Explore catalogues <ArrowDown className="ml-2 size-4" aria-hidden="true" /></a></Button>
              <Button asChild variant="outline" className="h-11 rounded-full px-5"><Link href="/appointment">Book a consultation <ArrowUpRight className="ml-2 size-4" aria-hidden="true" /></Link></Button>
            </div>
            <FabricLibraryStats initialCatalogues={catalogues} />
          </div>
          <div className="relative min-h-72 bg-surface-silver sm:min-h-96 lg:min-h-[530px]">
            <Image src={FABRIC_HERO_IMAGE} alt="Neutral fabric rolls and softly draped textiles from the Mietaaf fabric palette" fill priority sizes="(min-width: 1024px) 640px, 100vw" unoptimized className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 border-t border-white/40 pt-4 text-[10px] font-medium uppercase tracking-[0.25em] text-white sm:bottom-8 sm:left-8 sm:right-8">Your presence, our craft.</p>
          </div>
        </header>
        <FabricLibrary initialCatalogues={catalogues} />
        <section aria-label="Your fabric journey" className="mt-12 grid gap-7 rounded-2xl border border-border/70 bg-surface-silver p-6 sm:mt-16 sm:p-8 md:grid-cols-3 lg:p-10">
          {steps.map(({ icon: Icon, title, text }, index) => <div key={title} className="flex min-w-0 gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary"><Icon className="size-4" aria-hidden="true" /></span><div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">0{index + 1}</p><h2 className="mt-1 font-heading text-2xl">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div></div>)}
        </section>
        <aside className="mb-5 mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl bg-mietaaf-charcoal p-6 text-mietaaf-cream sm:mt-16 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-xl"><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d8b98c]">Made around you</p><h2 className="mt-3 font-heading text-3xl sm:text-4xl">Some choices are best felt in person.</h2><p className="mt-3 text-sm leading-7 text-white/70">Feel the texture, compare the colour and discuss your occasion with our team. Visit the Bengaluru studio or request a doorstep consultation.</p></div>
          <Button asChild variant="secondary" className="h-12 w-full shrink-0 rounded-full bg-mietaaf-cream px-6 text-mietaaf-charcoal hover:bg-white sm:w-auto"><Link href="/appointment"><CalendarDays className="mr-2 size-4" aria-hidden="true" />Book your fabric consultation</Link></Button>
        </aside>
      </div>
    </div>
  </PageEnter>;
}
