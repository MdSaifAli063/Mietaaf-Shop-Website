export type FabricCrop = readonly [number, number, number, number];
export type FabricFamily = "tailoring" | "jacquard" | "shirting" | "terri-wool";
export type FabricDesign = { id: string; name: string; reference?: string; crop?: FabricCrop; image: string; hidden?: boolean };
export type FabricCatalogue = {
  slug: string; title: string; family: FabricFamily; description: string;
  source: string; width: number; height: number; coverCrop?: FabricCrop;
  cover: string; image: string; designs: FabricDesign[];
  original?: string; hidden?: boolean;
};
type DesignInput = { name: string; reference?: string; crop: FabricCrop };

export const FABRIC_FAMILIES: { id: FabricFamily; name: string; note: string }[] = [
  { id: "tailoring", name: "Tailoring", note: "Armani & Lachkino colour collections" },
  { id: "jacquard", name: "Jacquard", note: "Florals, woven motifs & textured designs" },
  { id: "shirting", name: "Shirting", note: "Plain, striped & detailed shirt fabrics" },
  { id: "terri-wool", name: "Terri-Wool", note: "Classic, modern & earthy palettes" },
];

function row(names: string[], xs: number[], top: number, width: number, height: number, references?: string[]): DesignInput[] {
  return names.map((name, index) => ({ name, reference: references?.[index], crop: [xs[index]!, top, width, height] }));
}
function catalogue(value: Omit<FabricCatalogue, "cover" | "image" | "designs"> & { designs: DesignInput[] }): FabricCatalogue {
  return {
    ...value,
    cover: `/fabrics/optimized/${value.slug}--cover.webp`,
    image: `/fabrics/optimized/${value.slug}--catalogue.webp`,
    designs: value.designs.map((design) => {
      const id = (design.reference || design.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return { ...design, id, image: `/fabrics/optimized/${value.slug}--${id}.webp` };
    }),
  };
}
const six = [18, 186, 354, 523, 691, 861];

/** Names/references come from the supplied sheets; no prices or compositions are inferred. */
export const FABRIC_CATALOGUES: FabricCatalogue[] = [
  catalogue({
    slug: "armani-colour-collection", title: "Armani colour collection", family: "tailoring",
    description: "A twelve-colour edit, from forest green and ivory cream to plum, navy and classic white.",
    source: "Armani Premium Fabric Collection.png", width: 1024, height: 1536, coverCrop: [610, 5, 410, 470],
    designs: [
      ...row(["Forest green", "Ivory cream", "Beige taupe", "Blue grey", "Plum Armani", "Dusty lavender"], six, 555, 140, 340),
      ...row(["Burgundy berry", "Navy blue", "Camel brown", "Charcoal black", "Dark grey", "Classic white"], six, 1060, 140, 330),
    ],
  }),
  catalogue({
    slug: "lachkino-colour-collection", title: "Lachkino colour collection", family: "tailoring",
    description: "Twelve numbered shades, pairing rich navy, teal and wine with lighter ivory, taupe and grey.",
    source: "Lachkino Premium Fabric Collection (1).png", width: 1024, height: 1536, coverCrop: [555, 20, 460, 490],
    designs: [
      ...row(["Navy blue", "Teal green", "Olive green", "Maroon", "Brown", "Light grey"], [18, 188, 358, 528, 698, 868], 600, 140, 210, ["01", "02", "03", "04", "05", "06"]),
      ...row(["Taupe", "Ivory", "Plum", "Sage", "Steel blue", "Wine"], [18, 188, 358, 528, 698, 868], 955, 140, 205, ["07", "08", "09", "10", "11", "12"]),
    ],
  }),
  catalogue({
    slug: "ivory-jacquard-edit", title: "The ivory jacquard edit", family: "jacquard",
    description: "Three light-toned designs: a diamond pattern, embroidered florals and foil-accented motifs.",
    source: "Premium Jacquard Fabric Collection.png", width: 1254, height: 1254, coverCrop: [445, 270, 360, 450],
    designs: row(["Diamond jacquard", "Embroidered floral", "Foil-accented jacquard"], [25, 445, 865], 260, 350, 400, ["Design 1", "Design 2", "Design 3"]),
  }),
  catalogue({
    slug: "jacquard-silver-and-blue", title: "Jacquard in silver & blue", family: "jacquard",
    description: "Two floral jacquards with contrasting light and blue grounds and fine, all-over detailing.",
    source: "Elegant Jacquard Fabric Collection.png", width: 1024, height: 1536, coverCrop: [545, 410, 420, 370],
    designs: row(["Light floral jacquard", "Blue floral jacquard"], [45, 545], 410, 420, 370, ["01", "02"]),
  }),
  catalogue({
    slug: "jacquard-six-tone-florals", title: "Jacquard in six tones", family: "jacquard",
    description: "A floral study moving through light neutrals, plum, blue, charcoal and muted green.",
    source: "Jacquard Fabric Collection Elegance.png", width: 1024, height: 1536, coverCrop: [370, 420, 285, 320],
    designs: [
      ...row(["Classic weave", "Elegant motif", "Modern flow"], [35, 370, 705], 420, 285, 320, ["01", "02", "03"]),
      ...row(["Timeless elegance", "Rich texture", "Smooth finish"], [35, 370, 705], 950, 285, 240, ["04", "05", "06"]),
    ],
  }),
  catalogue({
    slug: "jacquard-botanical-textures", title: "Botanical jacquard textures", family: "jacquard",
    description: "Five tonal botanical designs across beige, dark, silver, grey and green palettes.",
    source: "Premium Jacquard Fabric Collection (1).png", width: 1024, height: 1536, coverCrop: [370, 480, 285, 300],
    designs: [
      ...row(["Beige botanical", "Dark botanical", "Silver botanical"], [35, 370, 705], 480, 285, 300, ["01", "02", "03"]),
      ...row(["Grey botanical", "Green botanical"], [45, 550], 960, 420, 260, ["04", "05"]),
    ],
  }),
  catalogue({
    slug: "jacquard-geometric-weaves", title: "Geometric jacquard weaves", family: "jacquard",
    description: "Small repeating motifs and detailed tonal patterns, presented in five numbered designs.",
    source: "Premium Jacquard Fabric Collection (2).png", width: 1024, height: 1536, coverCrop: [35, 600, 285, 240],
    designs: [
      ...row(["Elegant texture", "Smooth feel", "Soft & stretchy"], [35, 370, 705], 600, 285, 240, ["01", "02", "03"]),
      ...row(["Premium quality", "Lightweight palette"], [45, 550], 1010, 420, 250, ["04", "05"]),
    ],
  }),
  catalogue({
    slug: "jacquard-ivory-and-blush", title: "Florals in ivory & blush", family: "jacquard",
    description: "Two botanical colourways with delicate leaf and flower details, labelled 06A and 06B.",
    source: "Premium Jacquard Fabric Collection (3).png", width: 1024, height: 1536, coverCrop: [545, 750, 440, 430],
    designs: row(["Ivory botanical", "Blush botanical"], [35, 545], 750, 440, 430, ["06A", "06B"]),
  }),
  catalogue({
    slug: "jacquard-texture-study", title: "The jacquard texture study", family: "jacquard",
    description: "A closer look at five tonal jacquard references and the collection’s folded-fabric palette.",
    source: "Premium Jacquard Fabric Collection (4).png", width: 1024, height: 1536, coverCrop: [680, 80, 300, 390],
    designs: [
      ...row(["Elegant texture", "Smooth feel", "Soft & stretchy"], [75, 295, 510], 795, 140, 135, ["01", "02", "03"]),
      ...row(["All-day comfort", "Lightweight palette"], [165, 425], 1135, 140, 135, ["04", "05"]),
    ],
  }),
  catalogue({
    slug: "jacquard-four-tone-florals", title: "Florals in four tones", family: "jacquard",
    description: "Rose, blue, grey and mint floral designs, with matching close-up details on the catalogue sheet.",
    source: "Premium Jacquard Fabric Collection Poster.png", width: 1024, height: 1536, coverCrop: [545, 350, 420, 290],
    designs: [
      ...row(["Rose floral", "Blue floral"], [45, 545], 350, 420, 290, ["01", "02"]),
      ...row(["Grey floral", "Mint floral"], [45, 545], 880, 420, 290, ["03", "04"]),
    ],
  }),
  catalogue({
    slug: "shirt-fabric-collection", title: "The shirting collection", family: "shirting",
    description: "Five designs spanning plain white, blue detailing, fine stripes and a light mauve linen look.",
    source: "Premium Shirt Fabric Collection.png", width: 1312, height: 1199, coverCrop: [540, 285, 235, 300],
    designs: row(["Plain white", "White with blue star detail", "White with blue stripes", "White with black stripes", "Light mauve linen look"], [20, 280, 540, 805, 1065], 285, 230, 285, ["Design 1", "Design 2", "Design 3", "Design 4", "Design 5"]),
  }),
  catalogue({
    slug: "terri-wool-palettes", title: "Terri-Wool palettes", family: "terri-wool",
    description: "Six catalogue palettes exploring classic shades, earthy tones and contemporary colour combinations.",
    source: "Terri-Wool Premium Fabric Collection (1).png", width: 1024, height: 1536, coverCrop: [650, 1080, 365, 310],
    designs: [
      ...row(["Classic shades", "Modern mix", "Earthy tones", "Elegant look"], [55, 300, 550, 795], 720, 165, 155, ["01", "02", "03", "04"]),
      ...row(["Premium feel", "Stylish comfort"], [70, 330], 1090, 170, 155, ["05", "06"]),
    ],
  }),
];

export const FABRIC_HERO_IMAGE = "/fabrics/optimized/fabric-palette.webp";
export const FABRIC_HERO_SOURCE = "Elegant Fabric Palette with Draped Textiles.png";
export function fabricOriginalUrl(catalogue: FabricCatalogue): string {
  return catalogue.original || `/fabrics/${encodeURIComponent(catalogue.source)}`;
}
export function fabricReferencePath(catalogue: FabricCatalogue, design?: FabricDesign): string {
  return `/fabrics#fabric/${catalogue.slug}${design ? `/${design.id}` : ""}`;
}
