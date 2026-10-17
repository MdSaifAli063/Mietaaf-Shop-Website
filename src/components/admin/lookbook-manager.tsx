"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpRight, Check, LoaderCircle, Plus, RotateCcw, Save, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminShopData } from "@/hooks/use-admin-shop-data";
import { useLookbookSettings } from "@/hooks/use-lookbook-settings";
import { defaultLookbookSlugs, MAX_LOOKBOOK_ITEMS, selectLookbookProducts } from "@/lib/lookbook";
import { saveLookbookSettings } from "@/services/lookbook";
import { buildProductHref } from "@/lib/product-links";
import { ProductThumbnailImage } from "@/components/product/catalog-product-photo";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AdminEditor, AdminEmptyState, AdminField, AdminPageHeader, AdminPagination, AdminPanel, AdminStatus } from "@/components/admin/admin-ui";

export function LookbookManager() {
  const { products, categories } = useAdminShopData();
  const { settings, ready, error } = useLookbookSettings();
  const searchId = useId();
  const [draft, setDraft] = useState<string[] | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [pickerQuery, setPickerQuery] = useState("");
  const [pickerCategory, setPickerCategory] = useState("all");
  const [saving, setSaving] = useState(false);
  const stored = settings?.productSlugs ?? defaultLookbookSlugs(products);
  const slugs = draft ?? stored;
  const dirty = JSON.stringify(slugs) !== JSON.stringify(stored);
  const locked = !ready || error || saving;
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const visibleCount = selectLookbookProducts(products, { productSlugs: slugs }).length;
  const filtered = slugs.map((slug, index) => ({ slug, index, product: bySlug.get(slug) }))
    .filter(({ slug, product }) => `${product?.name ?? slug} ${product?.category ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / 8)));
  const rows = filtered.slice((currentPage - 1) * 8, currentPage * 8);
  const available = products.filter((product) => !product.hidden && !product.deleted
    && (pickerCategory === "all" || product.categorySlug === pickerCategory)
    && `${product.name} ${product.category}`.toLowerCase().includes(pickerQuery.trim().toLowerCase()));

  function openPicker() {
    setSelection([...slugs]);
    setPickerQuery("");
    setPickerCategory("all");
    setOpen(true);
  }

  function toggleSelection(slug: string) {
    if (selection.includes(slug)) {
      setSelection((current) => current.filter((item) => item !== slug));
    } else if (selection.length < MAX_LOOKBOOK_ITEMS) {
      setSelection((current) => [...current, slug]);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (locked || target < 0 || target >= slugs.length) return;
    const next = [...slugs];
    [next[index], next[target]] = [next[target]!, next[index]!];
    setDraft(next);
  }

  async function save() {
    if (locked || !dirty) return;
    setSaving(true);
    try {
      await saveLookbookSettings({ productSlugs: slugs });
      setDraft(null);
      toast.success("Lookbook published to the storefront.");
    } catch {
      toast.error("Could not save the lookbook. Your changes are still here; please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminPageHeader title="Lookbook" eyebrow="Editorial & styling" description="Choose the products shown in your storefront gallery and arrange their display order." actions={<><Button asChild variant="outline" className="h-10 rounded-lg text-xs"><Link href="/lookbook" target="_blank" rel="noopener noreferrer">View lookbook<ArrowUpRight className="size-3.5" /></Link></Button><Button className="h-10 rounded-lg text-xs" disabled={locked} onClick={openPicker}><Plus className="size-4" />Choose products</Button></>} />

      {error ? <div role="alert" className="mb-5 rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-xs leading-6">The saved lookbook could not be loaded. Refresh the page before making changes.</div> : null}
      <AdminPanel className="mb-5 flex flex-wrap items-center justify-between gap-4 p-4">
        <div><p className="text-sm font-semibold">{slugs.length} looks <span className="font-normal text-muted-foreground">/ {MAX_LOOKBOOK_ITEMS}</span></p><p className="mt-1 text-xs leading-5 text-muted-foreground">{ready ? `${visibleCount} available on the storefront. Hidden or removed products are excluded automatically.` : "Loading the saved lookbook…"}</p></div>
        <p role="status" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">{dirty ? <><span className="size-1.5 rounded-full bg-amber-600" />Unsaved changes</> : <><Check className="size-3.5" />{settings ? "Saved selection" : "Original selection"}</>}</p>
      </AdminPanel>

      <AdminPanel className="overflow-hidden">
        <div className="border-b border-border/60 p-4"><div className="relative w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id={searchId} aria-label="Search lookbook" className="h-10 pl-9 text-sm" placeholder="Search selected looks…" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></div></div>
        {rows.length ? <ol aria-label="Lookbook order" className="divide-y divide-border/60">
          {rows.map(({ slug, product, index }) => {
            const name = product?.name ?? slug;
            const visible = product && !product.hidden && !product.deleted;
            return <li key={slug} className="grid min-w-0 grid-cols-[20px_48px_minmax(0,1fr)] items-center gap-3 p-4 sm:grid-cols-[20px_48px_minmax(0,1fr)_auto]">
              <span className="w-5 shrink-0 text-[11px] font-medium tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-surface-silver"><ProductThumbnailImage src={product?.images[0] ?? "/placeholders/product-coming-soon.svg"} alt="" sizes="48px" /></div>
              <div className="min-w-0"><p className="line-clamp-2 text-[13px] font-medium">{name}</p><p className="mt-1 truncate text-[11px] text-muted-foreground">{product?.category ?? "Product unavailable"}</p><span className="mt-2 inline-flex"><AdminStatus status={visible ? "visible" : "unavailable"} /></span></div>
              <div className="col-span-2 col-start-2 flex items-center justify-self-end gap-1.5 sm:col-auto sm:col-start-auto">
                {visible ? <Button asChild size="icon" variant="outline" className="size-8 rounded-md"><Link href={buildProductHref(product.slug, product.images[0])} target="_blank" rel="noopener noreferrer" aria-label={`View ${name}`}><ArrowUpRight className="size-3.5" /></Link></Button> : null}
                <Button size="icon" variant="outline" className="size-8 rounded-md" disabled={locked || index === 0} onClick={() => move(index, -1)} aria-label={`Move ${name} up`}><ArrowUp className="size-3.5" /></Button>
                <Button size="icon" variant="outline" className="size-8 rounded-md" disabled={locked || index === slugs.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${name} down`}><ArrowDown className="size-3.5" /></Button>
                <Button size="icon" variant="ghost" className="size-8 rounded-md text-destructive hover:text-destructive" disabled={locked} onClick={() => setDraft(slugs.filter((item) => item !== slug))} aria-label={`Remove ${name} from lookbook`}><Trash2 className="size-3.5" /></Button>
              </div>
            </li>;
          })}
        </ol> : <AdminEmptyState title={query ? "No matching looks" : "Your lookbook is empty"} description={query ? "Try another product name or collection." : "Choose products from your catalogue to build the storefront gallery."} action={query ? <Button size="sm" variant="outline" onClick={() => setQuery("")}>Clear search</Button> : <Button size="sm" disabled={locked} onClick={openPicker}><Plus className="size-3.5" />Choose products</Button>} />}
        <AdminPagination page={currentPage} pageSize={8} total={filtered.length} onPageChange={setPage} />
      </AdminPanel>

      <div className="sticky bottom-0 z-10 mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/95 p-4 shadow-sm backdrop-blur">
        <p className="text-xs text-muted-foreground">{dirty ? "Save to update the live lookbook." : "Your gallery follows the order above."}</p>
        <div className="flex max-w-full flex-wrap gap-2"><Button variant="outline" className="h-10 gap-1.5 rounded-lg px-2.5 text-[11px] sm:px-3 sm:text-xs" disabled={locked || !dirty} onClick={() => { setDraft(null); setPage(1); }}><RotateCcw className="size-3.5" />Reset changes</Button><Button className="h-10 gap-1.5 rounded-lg px-2.5 text-[11px] sm:px-3 sm:text-xs" disabled={locked || !dirty} onClick={() => void save()}>{saving ? <LoaderCircle className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}Save lookbook</Button></div>
      </div>

      <Dialog open={open} onOpenChange={(value) => { if (!saving) setOpen(value); }}>
        <AdminEditor title="Choose lookbook products" description={`Select up to ${MAX_LOOKBOOK_ITEMS} visible products. Existing order is preserved; newly selected products are added at the end.`} footer={<><p className="mr-auto text-xs text-muted-foreground">{selection.length} / {MAX_LOOKBOOK_ITEMS} selected</p><Button variant="outline" className="rounded-lg" onClick={() => setOpen(false)}>Cancel</Button><Button className="rounded-lg" onClick={() => { setDraft(selection); setPage(1); setOpen(false); }}>Update selection</Button></>}>
          <div className="mb-5 grid gap-4 sm:grid-cols-2"><AdminField label="Search catalogue"><Input value={pickerQuery} onChange={(event) => setPickerQuery(event.target.value)} placeholder="Search products…" /></AdminField><AdminField label="Filter category"><select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" value={pickerCategory} onChange={(event) => setPickerCategory(event.target.value)}><option value="all">All categories</option>{categories.filter((category) => !category.deleted).map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></AdminField></div>
          {available.length ? <div className="space-y-2">{available.map((product) => <label key={product.slug} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/70 p-3 transition-colors has-checked:border-primary/40 has-checked:bg-primary/5"><input type="checkbox" checked={selection.includes(product.slug)} disabled={!selection.includes(product.slug) && selection.length >= MAX_LOOKBOOK_ITEMS} onChange={() => toggleSelection(product.slug)} aria-label={`Include ${product.name}`} /><div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md bg-surface-silver"><ProductThumbnailImage src={product.images[0] ?? "/placeholders/product-coming-soon.svg"} alt="" sizes="36px" /></div><span className="min-w-0"><span className="block text-xs font-medium">{product.name}</span><span className="mt-1 block text-[11px] text-muted-foreground">{product.category}</span></span></label>)}</div> : <p role="status" className="py-10 text-center text-sm text-muted-foreground">No available products match these filters.</p>}
        </AdminEditor>
      </Dialog>
    </>
  );
}
