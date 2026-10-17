"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, ChevronRight, Eye, EyeOff, ImagePlus, LoaderCircle, Pencil, Plus, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useFabricSettings } from "@/hooks/use-fabric-settings";
import { FABRIC_FAMILIES, fabricOriginalUrl, fabricReferencePath } from "@/lib/data/fabrics";
import { defaultFabricSettings, fabricCatalogueSchema, fabricDesignSchema, fabricSettingsSchema, type FabricSettings, type ManagedFabricCatalogue, type ManagedFabricDesign } from "@/lib/fabric-settings";
import { fabricFamilyName } from "@/lib/fabrics";
import { saveFabricSettings, uploadFabricImage } from "@/services/fabrics";
import { AdminEditor, AdminEmptyState, AdminField, AdminPageHeader, AdminPagination, AdminPanel, AdminStatus } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const emptyCatalogue = (): ManagedFabricCatalogue => ({ slug: "", title: "", description: "", family: "tailoring", cover: "", image: "", source: "fabric-catalogue.png", width: 1024, height: 1536, hidden: false, designs: [] });
const emptyDesign = (): ManagedFabricDesign => ({ id: "", name: "", reference: "", image: "", hidden: false });
const initialLibrary = defaultFabricSettings();

export function FabricManager({ catalogueSlug }: { catalogueSlug?: string }) {
  const { settings, ready, error } = useFabricSettings();
  const library = settings ?? initialLibrary;
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const [visibility, setVisibility] = useState("all");
  const [page, setPage] = useState(1);
  const editorTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploads, setUploads] = useState(0);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [designOpen, setDesignOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [catalogueForm, setCatalogueForm] = useState<ManagedFabricCatalogue>(emptyCatalogue);
  const [designForm, setDesignForm] = useState<ManagedFabricDesign>(emptyDesign);
  const locked = !ready || error || saving || uploads > 0;
  const catalogue = library.catalogues.find(item => item.slug === catalogueSlug);
  const visibleCatalogues = library.catalogues.filter(item => !item.hidden);
  const filtered = catalogueSlug
    ? (catalogue?.designs ?? []).filter(item => `${item.name} ${item.reference} ${item.id}`.toLowerCase().includes(query.trim().toLowerCase()) && (visibility === "all" || item.hidden === (visibility === "hidden")))
    : library.catalogues.filter(item => (family === "all" || item.family === family) && (visibility === "all" || item.hidden === (visibility === "hidden")) && `${item.title} ${item.description} ${fabricFamilyName(item.family)}`.toLowerCase().includes(query.trim().toLowerCase()));
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / 10)));
  const rows = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  async function commit(next: FabricSettings, message: string): Promise<boolean> {
    if (locked) return false;
    const parsed = fabricSettingsSchema.safeParse(next);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Check the catalogue details."); return false; }
    setSaving(true);
    try { await saveFabricSettings(parsed.data); toast.success(message); return true; }
    catch { toast.error("Could not publish the fabric library. Your changes are still here; please try again."); return false; }
    finally { setSaving(false); }
  }
  function replaceCatalogue(next: ManagedFabricCatalogue): FabricSettings {
    return { catalogues: library.catalogues.map(item => item.slug === next.slug ? next : item) };
  }
  function startCatalogue(item?: ManagedFabricCatalogue, trigger?: HTMLButtonElement) {
    if (trigger) editorTriggerRef.current = trigger;
    setEditingId(item?.slug ?? null);
    setCatalogueForm(item ? { ...item, original: fabricOriginalUrl(item) } : emptyCatalogue());
    setCatalogueOpen(true);
  }
  function startDesign(item?: ManagedFabricDesign, trigger?: HTMLButtonElement) {
    if (trigger) editorTriggerRef.current = trigger;
    setEditingId(item?.id ?? null); setDesignForm(item ? { ...item } : emptyDesign()); setDesignOpen(true);
  }
  async function saveCatalogue() {
    const { original, ...form } = catalogueForm;
    const parsed = fabricCatalogueSchema.safeParse({ ...form, slug: editingId ?? slugify(form.slug || form.title), cover: form.cover || form.image, original: original?.trim() || form.image });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Check all catalogue fields."); return; }
    if (!editingId && library.catalogues.some(item => item.slug === parsed.data.slug)) { toast.error("This catalogue URL already exists. Choose another slug."); return; }
    const next = editingId ? replaceCatalogue(parsed.data) : { catalogues: [...library.catalogues, parsed.data] };
    if (await commit(next, editingId ? "Fabric catalogue updated." : "Fabric catalogue added.")) setCatalogueOpen(false);
  }
  async function saveDesign() {
    if (!catalogue) return;
    const parsed = fabricDesignSchema.safeParse({ ...designForm, id: editingId ?? slugify(designForm.id || designForm.reference || designForm.name) });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Check all design fields."); return; }
    if (!editingId && catalogue.designs.some(item => item.id === parsed.data.id)) { toast.error("This design ID already exists in the catalogue."); return; }
    const designs = editingId ? catalogue.designs.map(item => item.id === editingId ? parsed.data : item) : [...catalogue.designs, parsed.data];
    if (await commit(replaceCatalogue({ ...catalogue, designs }), editingId ? "Fabric design updated." : "Fabric design added.")) setDesignOpen(false);
  }
  function move(index: number, direction: -1 | 1) {
    const list = catalogueSlug ? catalogue?.designs : library.catalogues;
    if (!list || index + direction < 0 || index + direction >= list.length) return;
    const next = [...list]; [next[index], next[index + direction]] = [next[index + direction]!, next[index]!];
    void commit(catalogue ? replaceCatalogue({ ...catalogue, designs: next as ManagedFabricDesign[] }) : { catalogues: next as ManagedFabricCatalogue[] }, "Display order updated.");
  }
  function changeVisibility(item: ManagedFabricCatalogue | ManagedFabricDesign) {
    const next = catalogue ? replaceCatalogue({ ...catalogue, designs: catalogue.designs.map(design => design.id === (item as ManagedFabricDesign).id ? { ...design, hidden: !design.hidden } : design) }) : replaceCatalogue({ ...item as ManagedFabricCatalogue, hidden: !item.hidden });
    void commit(next, item.hidden ? "Restored to the fabric library." : "Hidden from the fabric library.");
  }
  function remove(item: ManagedFabricCatalogue | ManagedFabricDesign) {
    const name = "title" in item ? item.title : item.name;
    if (!window.confirm(`Remove “${name}”${catalogue ? " from this catalogue" : " and its designs from the fabric library"}? Stored image files will be retained.`)) return;
    void commit(catalogue ? replaceCatalogue({ ...catalogue, designs: catalogue.designs.filter(design => design.id !== (item as ManagedFabricDesign).id) }) : { catalogues: library.catalogues.filter(entry => entry.slug !== (item as ManagedFabricCatalogue).slug) }, catalogue ? "Design removed." : "Catalogue removed.");
  }
  const uploadState = (active: boolean) => setUploads(count => Math.max(0, count + (active ? 1 : -1)));

  if (catalogueSlug && ready && !error && !catalogue) return <><AdminPageHeader title="Catalogue unavailable" description="This fabric catalogue may have been removed." /><Button asChild variant="outline"><Link href="/admin/fabrics">Back to fabrics</Link></Button></>;

  return <>
    {catalogueSlug && <Link href="/admin/fabrics" className="mb-4 inline-flex min-h-9 items-center text-xs text-primary hover:underline">← All fabric catalogues</Link>}
    <AdminPageHeader title={catalogue?.title ?? "Fabrics"} eyebrow={catalogueSlug ? "Designs & colour references" : "Fabric library"} description={catalogueSlug ? "Manage this catalogue’s designs, colour references and display order." : "Manage your fabric catalogues separately from clothing products. Published changes appear on the Fabrics page."} actions={<>
      <Button asChild variant="outline" className="h-10 rounded-lg text-xs"><Link href={catalogue && !catalogue.hidden ? fabricReferencePath(catalogue) : "/fabrics"} target="_blank" rel="noopener noreferrer">View fabrics<ArrowUpRight className="size-3.5" /></Link></Button>
      {catalogue ? <><Button variant="outline" className="h-10 rounded-lg text-xs" disabled={locked} onClick={event => startCatalogue(catalogue, event.currentTarget)}><Pencil className="size-3.5" />Edit catalogue</Button><Button className="h-10 rounded-lg text-xs" disabled={locked || catalogue.designs.length >= 60} onClick={event => startDesign(undefined, event.currentTarget)}><Plus className="size-4" />Add design</Button></> : <Button className="h-10 rounded-lg text-xs" disabled={locked || library.catalogues.length >= 60} onClick={event => startCatalogue(undefined, event.currentTarget)}><Plus className="size-4" />Add catalogue</Button>}
    </>} />
    {error && <div role="alert" className="mb-5 rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-xs leading-6">The saved fabric library could not be loaded. Refresh the page before making changes.</div>}
    {catalogue?.hidden && <div role="status" className="mb-5 rounded-lg border border-amber-600/20 bg-amber-500/5 p-4 text-xs leading-6">This catalogue is hidden. Its designs will remain off the storefront until you restore the catalogue.</div>}
    <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {(catalogue ? [{ label: "Designs", value: catalogue.designs.length }, { label: "Visible designs", value: catalogue.designs.filter(item => !item.hidden).length }, { label: "Fabric family", value: fabricFamilyName(catalogue.family) }] : [{ label: "Catalogues", value: library.catalogues.length }, { label: "Visible catalogues", value: visibleCatalogues.length }, { label: "Visible design references", value: visibleCatalogues.reduce((count, item) => count + item.designs.filter(design => !design.hidden).length, 0) }]).map(item => <AdminPanel key={item.label} className="p-4 last:col-span-2 sm:last:col-span-1"><p className="text-[11px] text-muted-foreground">{item.label}</p><p className="mt-2 text-xl font-semibold tracking-tight">{item.value}</p></AdminPanel>)}
    </div>
    <AdminPanel className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-border/60 p-4">
        <div className="relative w-full sm:max-w-xs"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input aria-label={catalogueSlug ? "Search fabric designs" : "Search fabric catalogues"} value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder={catalogueSlug ? "Search name or reference…" : "Search fabric catalogues…"} className="h-10 pl-9 text-base sm:text-sm" /></div>
        {!catalogueSlug && <select aria-label="Fabric family" value={family} onChange={event => { setFamily(event.target.value); setPage(1); }} className="h-10 max-w-full rounded-lg border border-border bg-card px-3 text-base sm:text-xs"><option value="all">All families</option>{FABRIC_FAMILIES.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>}
        <select aria-label="Visibility" value={visibility} onChange={event => { setVisibility(event.target.value); setPage(1); }} className="h-10 max-w-full rounded-lg border border-border bg-card px-3 text-base sm:text-xs"><option value="all">All visibility</option><option value="visible">Visible</option><option value="hidden">Hidden</option></select>
        <p role="status" className="text-[11px] text-muted-foreground sm:ml-auto">{saving ? "Publishing…" : !ready ? "Loading library…" : `${filtered.length} ${catalogueSlug ? "designs" : "catalogues"}`}</p>
      </div>
      {rows.length ? <ol aria-label={catalogueSlug ? "Fabric designs" : "Fabric catalogues"} className="divide-y divide-border/60">
        {rows.map(item => {
          const isCatalogue = "title" in item;
          const name = isCatalogue ? item.title : item.name;
          const id = isCatalogue ? item.slug : item.id;
          const index = isCatalogue ? library.catalogues.findIndex(entry => entry.slug === id) : catalogue!.designs.findIndex(entry => entry.id === id);
          const length = isCatalogue ? library.catalogues.length : catalogue!.designs.length;
          return <li key={id} data-fabric-row={id} className="grid min-w-0 gap-3 p-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <div className="flex min-w-0 items-center gap-3"><span className="w-5 shrink-0 text-[10px] tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-silver"><Image src={isCatalogue ? item.cover : item.image} alt="" fill unoptimized sizes="64px" className="object-cover" /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2">{isCatalogue ? <Link href={`/admin/fabrics/${item.slug}`} className="text-[13px] font-semibold hover:text-primary hover:underline">{name}</Link> : <p className="text-[13px] font-semibold">{name}</p>}<AdminStatus status={item.hidden ? "hidden" : "visible"} /></div><p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">{isCatalogue ? `${fabricFamilyName(item.family)} · ${item.designs.length} designs · ${item.designs.filter(design => !design.hidden).length} visible` : item.reference ? `Reference: ${item.reference}` : "Colour / design reference"}</p>{isCatalogue && <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">{item.description}</p>}</div></div>
            <div className="flex flex-wrap items-center gap-1.5 xl:justify-end">
              {isCatalogue && <Button asChild variant="outline" size="sm" className="h-8 rounded-md text-[11px]"><Link href={`/admin/fabrics/${item.slug}`}>Manage designs<ChevronRight className="size-3" /></Link></Button>}
              <Button variant="outline" size="icon" className="size-8 rounded-md" disabled={locked || index === 0} onClick={() => move(index, -1)} aria-label={`Move ${name} up`}><ArrowUp className="size-3.5" /></Button>
              <Button variant="outline" size="icon" className="size-8 rounded-md" disabled={locked || index === length - 1} onClick={() => move(index, 1)} aria-label={`Move ${name} down`}><ArrowDown className="size-3.5" /></Button>
              <Button variant="outline" size="sm" className="h-8 rounded-md text-[11px]" disabled={locked} onClick={event => isCatalogue ? startCatalogue(item, event.currentTarget) : startDesign(item, event.currentTarget)}><Pencil className="size-3.5" />Edit</Button>
              <Button variant="outline" size="sm" className="h-8 rounded-md text-[11px]" disabled={locked} onClick={() => changeVisibility(item)}>{item.hidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}{item.hidden ? "Restore" : "Hide"}</Button>
              <Button variant="ghost" size="icon" className="size-8 rounded-md text-destructive hover:text-destructive" disabled={locked} aria-label={`Remove ${name}`} onClick={() => remove(item)}><Trash2 className="size-3.5" /></Button>
            </div>
          </li>;
        })}
      </ol> : <AdminEmptyState title={query || visibility !== "all" || family !== "all" ? "No matching fabrics" : catalogueSlug ? "No designs yet" : "No catalogues yet"} description={catalogueSlug ? "Add individual designs to help customers choose a colour or pattern." : "Add a catalogue sheet and cover image to build your fabric library."} action={<Button variant="outline" size="sm" onClick={() => { setQuery(""); setVisibility("all"); setFamily("all"); }}>Clear filters</Button>} />}
      <AdminPagination page={currentPage} pageSize={10} total={filtered.length} onPageChange={setPage} />
    </AdminPanel>
    <p className="mt-4 text-[11px] leading-6 text-muted-foreground">Changes publish when saved. Hidden catalogues and designs are excluded from the public library. Removing an entry keeps its image files.</p>
    {catalogueSlug && <p className="mt-1 text-[11px] leading-6 text-muted-foreground">Hiding a design removes its selectable preview. It remains visible on any original catalogue sheet containing it.</p>}

    <Dialog open={catalogueOpen} onOpenChange={open => { if (!saving && !uploads) setCatalogueOpen(open); }}>
      <AdminEditor finalFocus={editorTriggerRef} title={editingId ? "Edit fabric catalogue" : "Add fabric catalogue"} description="Set its family, images and storefront details. Add individual designs from Manage designs." footer={<><Button variant="outline" disabled={saving || uploads > 0} onClick={() => setCatalogueOpen(false)}>Cancel</Button><Button disabled={locked} onClick={() => void saveCatalogue()}>{saving && <LoaderCircle className="size-4 animate-spin" />}Save catalogue</Button></>}>
        <fieldset disabled={saving} className="grid min-w-0 gap-5 sm:grid-cols-2">
          <AdminField label="Catalogue title"><Input value={catalogueForm.title} onChange={event => setCatalogueForm(form => ({ ...form, title: event.target.value }))} /></AdminField>
          <AdminField label="URL slug"><Input value={catalogueForm.slug} disabled={!!editingId} placeholder={slugify(catalogueForm.title) || "ivory-jacquards"} onChange={event => setCatalogueForm(form => ({ ...form, slug: event.target.value }))} /><p className="mt-1 text-[10px] leading-5 text-muted-foreground">Fixed after creation so shared links keep working.</p></AdminField>
          <AdminField label="Fabric family"><select className="h-10 w-full border border-border px-3 text-base sm:text-sm" value={catalogueForm.family} onChange={event => setCatalogueForm(form => ({ ...form, family: event.target.value as ManagedFabricCatalogue["family"] }))}>{FABRIC_FAMILIES.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></AdminField>
          <label className="flex min-h-10 items-center gap-2 self-start pt-6 text-xs"><input type="checkbox" checked={catalogueForm.hidden} onChange={event => setCatalogueForm(form => ({ ...form, hidden: event.target.checked }))} />Hide catalogue from storefront</label>
          <AdminField label="Description" className="sm:col-span-2"><Textarea rows={3} value={catalogueForm.description} onChange={event => setCatalogueForm(form => ({ ...form, description: event.target.value }))} /></AdminField>
          <FabricImageField label="Full catalogue image" value={catalogueForm.image} disabled={saving} onBusy={uploadState} onChange={image => setCatalogueForm(form => ({ ...form, image, original: image, cover: form.cover || image }))} onUploaded={details => setCatalogueForm(form => ({ ...form, width: details.width, height: details.height, source: details.name }))} />
          <FabricImageField label="Cover image" value={catalogueForm.cover} disabled={saving} onBusy={uploadState} onChange={cover => setCatalogueForm(form => ({ ...form, cover }))} />
          <AdminField label="Original sheet URL (optional)" className="sm:col-span-2"><Input value={catalogueForm.original ?? ""} onChange={event => setCatalogueForm(form => ({ ...form, original: event.target.value }))} placeholder="Uses the catalogue image when not set" /></AdminField>
          <AdminField label="Image width (px)"><Input type="number" min={1} max={20000} value={catalogueForm.width} onChange={event => setCatalogueForm(form => ({ ...form, width: Number(event.target.value) }))} /></AdminField>
          <AdminField label="Image height (px)"><Input type="number" min={1} max={20000} value={catalogueForm.height} onChange={event => setCatalogueForm(form => ({ ...form, height: Number(event.target.value) }))} /></AdminField>
          <p className="text-[10px] leading-5 text-muted-foreground sm:col-span-2">PNG, JPG, WebP or AVIF, up to 5 MB each. Uploaded catalogue dimensions are filled automatically. A full sheet can be published before adding individual designs.</p>
        </fieldset>
      </AdminEditor>
    </Dialog>
    <Dialog open={designOpen} onOpenChange={open => { if (!saving && !uploads) setDesignOpen(open); }}>
      <AdminEditor finalFocus={editorTriggerRef} title={editingId ? "Edit fabric design" : "Add fabric design"} description="Use the colour or design name and the reference printed on the catalogue, if present." footer={<><Button variant="outline" disabled={saving || uploads > 0} onClick={() => setDesignOpen(false)}>Cancel</Button><Button disabled={locked} onClick={() => void saveDesign()}>{saving && <LoaderCircle className="size-4 animate-spin" />}Save design</Button></>}>
        <fieldset disabled={saving} className="grid min-w-0 gap-5 sm:grid-cols-2">
          <AdminField label="Design / colour name"><Input value={designForm.name} onChange={event => setDesignForm(form => ({ ...form, name: event.target.value }))} /></AdminField>
          <AdminField label="Printed reference (optional)"><Input value={designForm.reference} onChange={event => setDesignForm(form => ({ ...form, reference: event.target.value }))} placeholder="e.g. 06B" /></AdminField>
          <AdminField label="Design ID"><Input value={designForm.id} disabled={!!editingId} placeholder={slugify(designForm.reference || designForm.name) || "blush-floral"} onChange={event => setDesignForm(form => ({ ...form, id: event.target.value }))} /><p className="mt-1 text-[10px] leading-5 text-muted-foreground">Fixed after creation to preserve shared links.</p></AdminField>
          <label className="flex min-h-10 items-center gap-2 self-start pt-6 text-xs"><input type="checkbox" checked={designForm.hidden} onChange={event => setDesignForm(form => ({ ...form, hidden: event.target.checked }))} />Hide design from storefront</label>
          <div className="sm:col-span-2"><FabricImageField label="Design image" value={designForm.image} disabled={saving} onBusy={uploadState} onChange={image => setDesignForm(form => ({ ...form, image }))} /></div>
        </fieldset>
      </AdminEditor>
    </Dialog>
  </>;
}

function FabricImageField({ label, value, disabled, onChange, onBusy, onUploaded }: { label: string; value: string; disabled: boolean; onChange: (url: string) => void; onBusy: (active: boolean) => void; onUploaded?: (details: { width: number; height: number; name: string }) => void }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  async function upload(file?: File) {
    if (!file) return;
    setUploading(true); setProgress(0); onBusy(true);
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("Choose an image smaller than 5 MB.");
      if (!["image/png", "image/jpeg", "image/webp", "image/avif"].includes(file.type)) throw new Error("Choose a PNG, JPG, WebP or AVIF image.");
      const objectUrl = URL.createObjectURL(file);
      let dimensions: { width: number; height: number };
      try { const image = new window.Image(); image.src = objectUrl; await image.decode(); dimensions = { width: image.naturalWidth, height: image.naturalHeight }; if (!dimensions.width || !dimensions.height || dimensions.width > 20000 || dimensions.height > 20000) throw new Error("Choose an image up to 20,000 pixels per side."); }
      finally { URL.revokeObjectURL(objectUrl); }
      const url = await uploadFabricImage(file, setProgress); onChange(url); onUploaded?.({ ...dimensions, name: file.name }); toast.success("Fabric image uploaded. Save to publish it.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "The image could not be uploaded."); }
    finally { setUploading(false); onBusy(false); }
  }
  return <div className="min-w-0 space-y-3"><AdminField label={label}><Input value={value} disabled={disabled || uploading} placeholder="Paste an image URL or upload below" onChange={event => onChange(event.target.value)} /></AdminField><label className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-lg border border-border bg-card px-3 text-[11px] font-medium"><input type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="sr-only" disabled={disabled || uploading} onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; void upload(file); }} />{uploading ? <LoaderCircle className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}{uploading ? `Uploading ${progress}%` : "Upload image"}</label></div>;
}
