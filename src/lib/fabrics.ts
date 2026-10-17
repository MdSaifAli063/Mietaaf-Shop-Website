import { FABRIC_CATALOGUES, FABRIC_FAMILIES, fabricReferencePath, type FabricCatalogue, type FabricDesign, type FabricFamily } from "@/lib/data/fabrics";
import { absoluteUrl } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function fabricFamilyName(family: FabricFamily): string {
  return FABRIC_FAMILIES.find(item => item.id === family)!.name;
}
export function filterFabricCatalogues(family: FabricFamily | "all", query: string, catalogues: readonly FabricCatalogue[] = FABRIC_CATALOGUES): FabricCatalogue[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return catalogues.filter(catalogue => {
    if (family !== "all" && catalogue.family !== family) return false;
    const text = [catalogue.title, fabricFamilyName(catalogue.family), catalogue.description,
      ...catalogue.designs.flatMap(design => [design.name, design.reference ?? ""])].join(" ").toLowerCase();
    return terms.every(term => text.includes(term));
  });
}
export function parseFabricReference(hash: string, catalogues: readonly FabricCatalogue[] = FABRIC_CATALOGUES): { catalogue: FabricCatalogue; design?: FabricDesign } | null {
  const match = /^#fabric\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?$/.exec(hash);
  if (!match) return null;
  const catalogue = catalogues.find(item => item.slug === match[1]);
  if (!catalogue) return null;
  const design = match[2] ? catalogue.designs.find(item => item.id === match[2]) : undefined;
  if (match[2] && !design) return null;
  return { catalogue, design };
}
export function fabricEnquiryUrl(phone: string, catalogue: FabricCatalogue, design?: FabricDesign): string {
  return buildWhatsAppUrl(phone, [
    "Hello Mietaaf Couture, I would like to enquire about a fabric.",
    `Collection: ${catalogue.title}`, `Family: ${fabricFamilyName(catalogue.family)}`,
    ...(design ? [`Design / colour: ${design.name}`, ...(design.reference ? [`Catalogue reference: ${design.reference}`] : [])] : []),
    `View: ${absoluteUrl(fabricReferencePath(catalogue, design))}`,
    "Please help me with availability, fabric composition, current pricing and a personal fitting.",
  ].join("\n"));
}
