"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, Check, ExternalLink, Layers3, MessageCircle, Search, X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { usePublicFabricSettings as useFabricSettings } from "@/hooks/use-public-document";
import { selectVisibleFabrics } from "@/lib/fabric-settings";
import { FABRIC_CATALOGUES, FABRIC_FAMILIES, fabricOriginalUrl, fabricReferencePath, type FabricCatalogue, type FabricDesign, type FabricFamily } from "@/lib/data/fabrics";
import { fabricEnquiryUrl, fabricFamilyName, filterFabricCatalogues, parseFabricReference } from "@/lib/fabrics";
import { cn } from "@/lib/utils";

type Selection = { catalogue: FabricCatalogue; design?: FabricDesign };

function useVisibleCatalogues(initialCatalogues: FabricCatalogue[]) {
  const { settings, ready, error } = useFabricSettings();
  const current = settings?.catalogues ?? (ready && !error ? FABRIC_CATALOGUES : initialCatalogues);
  return useMemo(() => selectVisibleFabrics(current), [current]);
}

export function FabricLibraryStats({ initialCatalogues }: { initialCatalogues: FabricCatalogue[] }) {
  const catalogues = useVisibleCatalogues(initialCatalogues);
  return <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-primary/15 pt-5 text-xs text-muted-foreground"><p><span className="mr-1.5 font-semibold text-foreground">{catalogues.length}</span>catalogues</p><p><span className="mr-1.5 font-semibold text-foreground">{new Set(catalogues.map(catalogue => catalogue.family)).size}</span>fabric families</p><p>Chosen for you</p></div>;
}

export function FabricLibrary({ initialCatalogues = FABRIC_CATALOGUES }: { initialCatalogues?: FabricCatalogue[] }) {
  const [family, setFamily] = useState<FabricFamily | "all">("all");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [zoom, setZoom] = useState(1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const { settings } = useSiteSettings();
  const visibleCatalogues = useVisibleCatalogues(initialCatalogues);
  const catalogues = filterFabricCatalogues(family, query, visibleCatalogues);

  useEffect(() => {
    const sync = () => { setSelection(parseFabricReference(window.location.hash, visibleCatalogues)); setZoom(1); };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => { window.removeEventListener("hashchange", sync); window.removeEventListener("popstate", sync); };
  }, [visibleCatalogues]);

  function select(next: Selection | null) {
    setSelection(next);
    setZoom(1);
    viewerRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const hash = next ? fabricReferencePath(next.catalogue, next.design).split("#")[1] : "";
    if (next || window.location.hash.startsWith("#fabric/")) {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}${hash ? `#${hash}` : ""}`);
    }
  }

  return (
    <section id="catalogues" aria-labelledby="fabric-library-title" className="scroll-mt-28 pt-12 sm:pt-16">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div className="max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">Texture. Colour. Possibility.</p>
          <h2 id="fabric-library-title" className="mt-2 font-heading text-4xl sm:text-5xl">Find your starting point.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Explore the collection, take a closer look at each design, then let us help you find the right fabric for your piece.</p>
        </div>
        <label className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Search fabric catalogues</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try navy, floral or 06A…" className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-10 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" />
          {query && <button type="button" aria-label="Clear fabric search" onClick={() => setQuery("")} className="absolute right-1 top-1 flex size-10 items-center justify-center rounded-lg hover:bg-surface-silver"><X className="size-4" /></button>}
        </label>
      </div>
      <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filter by fabric family">
        {[{ id: "all" as const, name: "All fabrics" }, ...FABRIC_FAMILIES].map(item => {
          const count = item.id === "all" ? visibleCatalogues.length : visibleCatalogues.filter(catalogue => catalogue.family === item.id).length;
          return <button key={item.id} type="button" aria-pressed={family === item.id} onClick={() => setFamily(item.id)} className={cn("inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", family === item.id ? "border-mietaaf-charcoal bg-mietaaf-charcoal text-mietaaf-cream" : "border-border bg-card hover:border-primary/50 hover:bg-surface-silver")}>
            {item.name}<span className={cn("text-[10px]", family === item.id ? "text-white/65" : "text-muted-foreground")}>{count}</span>
          </button>;
        })}
      </div>
      <p role="status" className="my-5 text-xs text-muted-foreground">{catalogues.length} {catalogues.length === 1 ? "catalogue" : "catalogues"}{query.trim() ? ` matching “${query.trim()}”` : " to explore"}</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" data-fabric-grid>
        {catalogues.map(catalogue => <article key={catalogue.slug} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_4px_20px_rgba(48,42,36,0.025)] transition-shadow hover:shadow-[0_12px_32px_rgba(48,42,36,0.08)]" data-catalogue={catalogue.slug}>
          <button type="button" className="relative block aspect-[4/3] w-full overflow-hidden bg-surface-silver text-left" aria-label={`Explore ${catalogue.title}`} onClick={event => { triggerRef.current = event.currentTarget; select({ catalogue }); }}>
            <Image src={catalogue.cover} alt={`${catalogue.title} fabric texture`} fill sizes="(min-width: 1024px) 390px, (min-width: 640px) 50vw, 100vw" unoptimized className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.035]" />
            <span className="absolute left-3 top-3 rounded-full border border-white/50 bg-[#fffdfa]/95 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#302a24]">{fabricFamilyName(catalogue.family)}</span>
            <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full border border-white/40 bg-[#fffdfa]/90 text-[#302a24]"><ArrowUpRight className="size-4" aria-hidden="true" /></span>
          </button>
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-primary"><Layers3 className="size-3.5" aria-hidden="true" />{catalogue.designs.length} design references</p>
            <h3 className="mt-2 font-heading text-[27px] leading-tight">{catalogue.title}</h3>
            <p className="mb-5 mt-2 text-sm leading-6 text-muted-foreground">{catalogue.description}</p>
            <Button type="button" className="mt-auto h-10 w-full rounded-lg" onClick={event => { triggerRef.current = event.currentTarget; select({ catalogue }); }}>View designs <ArrowUpRight className="ml-2 size-3.5" aria-hidden="true" /></Button>
          </div>
        </article>)}
      </div>
      {!catalogues.length && <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-14 text-center"><Search className="mx-auto size-6 text-primary" aria-hidden="true" /><h3 className="mt-4 font-heading text-2xl">{visibleCatalogues.length ? "Let’s try another fabric." : "A new fabric edit is on its way."}</h3><p className="mt-2 text-sm text-muted-foreground">{visibleCatalogues.length ? "Search a colour, design reference or collection name." : "Our team can help you explore fabrics during a personal consultation."}</p>{visibleCatalogues.length ? <Button variant="outline" onClick={() => { setFamily("all"); setQuery(""); }} className="mt-5">Show all catalogues</Button> : <Button asChild variant="outline" className="mt-5"><a href="/appointment">Book a fabric consultation</a></Button>}</div>}
      <Dialog open={!!selection} onOpenChange={open => { if (!open) select(null); }}>
        <DialogContent finalFocus={triggerRef} className="flex max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-6xl flex-col gap-0 overflow-hidden bg-card p-0 sm:max-h-[92dvh] sm:w-[calc(100%-2rem)]" overlayClassName="bg-black/45 backdrop-blur-sm">
          {selection && <>
            <div className="shrink-0 border-b border-border px-4 py-4 pr-14 sm:px-6 sm:pr-16">
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-primary">{fabricFamilyName(selection.catalogue.family)} · Fabric library</p>
              <DialogTitle className="font-heading text-2xl leading-tight sm:text-3xl">{selection.catalogue.title}</DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-5">Select a design to enquire, or explore the complete catalogue sheet.</DialogDescription>
            </div>
            <div className="min-h-0 overflow-y-auto overscroll-contain" data-fabric-dialog-body>
              <div className="grid min-w-0 lg:grid-cols-[1.05fr_1fr]">
                <div className="min-w-0 bg-surface-silver p-3 sm:p-5 lg:border-r lg:border-border">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">{selection.design ? "Design preview" : "Full catalogue"}</span>
                    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5" role="group" aria-label="Image zoom">
                      <button type="button" aria-label="Zoom out" disabled={zoom === 1} onClick={() => setZoom(value => Math.max(1, value - .5))} className="flex size-9 items-center justify-center rounded-md hover:bg-surface-silver disabled:cursor-default disabled:opacity-30"><ZoomOut className="size-4" /></button>
                      <button type="button" onClick={() => setZoom(1)} aria-label="Reset image zoom" className="h-9 min-w-12 rounded-md px-1 text-xs tabular-nums hover:bg-surface-silver">{zoom * 100}%</button>
                      <button type="button" aria-label="Zoom in" disabled={zoom === 3} onClick={() => setZoom(value => Math.min(3, value + .5))} className="flex size-9 items-center justify-center rounded-md hover:bg-surface-silver disabled:cursor-default disabled:opacity-30"><ZoomIn className="size-4" /></button>
                    </div>
                  </div>
                  <div ref={viewerRef} tabIndex={0} role="region" aria-label="Fabric image; scroll to explore when zoomed" className="max-h-[58dvh] min-w-0 overflow-auto overscroll-contain rounded-lg border border-border/70 bg-white focus-visible:outline-2 focus-visible:outline-primary lg:max-h-[60dvh]" data-fabric-viewer>
                    <div style={{ width: `${zoom * 100}%` }}>
                      <Image src={selection.design?.image ?? selection.catalogue.image} alt={selection.design ? `${selection.design.name}${selection.design.reference ? `, reference ${selection.design.reference}` : ""} — ${selection.catalogue.title}` : `Complete ${selection.catalogue.title} catalogue with design references`} width={selection.design ? 480 : selection.catalogue.width} height={selection.design ? 560 : selection.catalogue.height} unoptimized className="block h-auto w-full" />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-primary">
                    <a href={fabricOriginalUrl(selection.catalogue)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 underline-offset-4 hover:underline"><ExternalLink className="size-3.5" aria-hidden="true" />Open original sheet</a>
                    <a href={fabricOriginalUrl(selection.catalogue)} download={selection.catalogue.source} className="inline-flex min-h-9 items-center gap-1.5 underline-offset-4 hover:underline"><ArrowDownToLine className="size-3.5" aria-hidden="true" />Download catalogue</a>
                  </div>
                </div>
                <div className="min-w-0 p-4 sm:p-6">
                  <p className="text-sm leading-6 text-muted-foreground">{selection.catalogue.description}</p>
                  <div className="mb-4 mt-5 flex items-center justify-between gap-3"><h3 className="text-xs font-semibold">{selection.catalogue.designs.length ? "Choose a design / colour" : "Explore the complete collection"}</h3><button type="button" onClick={() => select({ catalogue: selection.catalogue })} aria-pressed={!selection.design} className="min-h-9 shrink-0 rounded-md border border-border px-3 text-[11px] hover:bg-surface-silver">Full sheet</button></div>
                  {!selection.catalogue.designs.length && <p className="text-sm leading-6 text-muted-foreground">Browse the full sheet, then send the collection to our team for help choosing a fabric.</p>}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3" role="group" aria-label="Fabric designs">
                    {selection.catalogue.designs.map(design => <button key={design.id} type="button" aria-pressed={selection.design?.id === design.id} aria-label={`${design.name}${design.reference ? `, reference ${design.reference}` : ""}`} onClick={() => select({ catalogue: selection.catalogue, design })} className={cn("min-w-0 overflow-hidden rounded-lg border bg-surface-paper text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", selection.design?.id === design.id ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/60")}>
                      <div className="relative aspect-[5/4] overflow-hidden"><Image src={design.image} alt="" fill sizes="150px" unoptimized className="object-cover" />{selection.design?.id === design.id && <span className="absolute right-1 top-1 rounded-full bg-mietaaf-charcoal p-1 text-white"><Check className="size-3" aria-hidden="true" /></span>}</div>
                      <span className="block p-2 text-[10px] leading-4 sm:text-[11px]">{design.reference && <span className="mb-0.5 block font-semibold text-primary">{design.reference}</span>}{design.name}</span>
                    </button>)}
                  </div>
                  <p className="mt-5 rounded-lg bg-surface-silver px-3 py-3 text-[11px] leading-5 text-muted-foreground">See a fabric you love? We’ll confirm its composition, availability and price, and help you choose in person. Screen colours may vary from the actual fabric.</p>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 border-t border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="min-w-0 text-xs leading-5"><span className="block text-[9px] font-semibold uppercase tracking-[0.15em] text-primary">Your enquiry</span>{selection.design ? `${selection.design.reference ? `${selection.design.reference} · ` : ""}${selection.design.name}` : "Explore this collection with our team"}</p>
              <Button asChild className="h-11 w-full shrink-0 rounded-lg px-5 sm:w-auto"><a href={fabricEnquiryUrl(settings.whatsappNumber, selection.catalogue, selection.design)} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 size-4" aria-hidden="true" />Enquire on WhatsApp <ArrowUpRight className="ml-2 size-3.5" aria-hidden="true" /></a></Button>
            </div>
          </>}
        </DialogContent>
      </Dialog>
    </section>
  );
}
