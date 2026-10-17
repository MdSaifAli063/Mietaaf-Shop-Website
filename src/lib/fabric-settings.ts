import { z } from "zod";
import { FABRIC_CATALOGUES, type FabricCatalogue } from "@/lib/data/fabrics";

const identifier = z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens.");
export const fabricImageSchema = z.string().trim().min(1, "Choose an image.").max(2048).refine(value => {
  if (value.startsWith("/") && !value.startsWith("//") && !/[\\\s<>]/.test(value)) return true;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; }
}, "Use an HTTPS image URL or a local path starting with /.");
export const fabricDesignSchema = z.object({
  id: identifier, name: z.string().trim().min(1, "Enter a design name.").max(120),
  reference: z.string().trim().max(60).default(""), image: fabricImageSchema, hidden: z.boolean().default(false),
});
export const fabricCatalogueSchema = z.object({
  slug: identifier, title: z.string().trim().min(1, "Enter a catalogue title.").max(160),
  family: z.enum(["tailoring", "jacquard", "shirting", "terri-wool"]),
  description: z.string().trim().min(1, "Enter a description.").max(1500),
  cover: fabricImageSchema, image: fabricImageSchema, original: fabricImageSchema.optional(),
  source: z.string().trim().min(1).max(240),
  width: z.number().int().min(1).max(20000), height: z.number().int().min(1).max(20000),
  hidden: z.boolean().default(false),
  designs: z.array(fabricDesignSchema).max(60).refine(designs => new Set(designs.map(design => design.id)).size === designs.length, "Each design needs a unique ID within its catalogue."),
});
export const fabricSettingsSchema = z.object({
  catalogues: z.array(fabricCatalogueSchema).max(60)
    .refine(catalogues => new Set(catalogues.map(catalogue => catalogue.slug)).size === catalogues.length, "Each catalogue needs a unique URL slug."),
}).refine(value => new TextEncoder().encode(JSON.stringify(value)).length <= 750_000, "The library is too large to publish. Use shorter descriptions or fewer designs.");
export type FabricSettings = z.infer<typeof fabricSettingsSchema>;
export type ManagedFabricCatalogue = FabricSettings["catalogues"][number];
export type ManagedFabricDesign = ManagedFabricCatalogue["designs"][number];

export function defaultFabricSettings(): FabricSettings {
  return fabricSettingsSchema.parse({ catalogues: FABRIC_CATALOGUES });
}
export function selectVisibleFabrics(catalogues: readonly FabricCatalogue[]): FabricCatalogue[] {
  return catalogues.filter(catalogue => !catalogue.hidden).map(catalogue => ({ ...catalogue, designs: catalogue.designs.filter(design => !design.hidden) }));
}
export function resolveFabricSettings(raw: unknown): FabricSettings {
  const parsed = fabricSettingsSchema.safeParse(raw);
  return parsed.success ? parsed.data : defaultFabricSettings();
}
