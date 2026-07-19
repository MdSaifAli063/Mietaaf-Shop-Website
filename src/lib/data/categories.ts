import type { Category } from "@/types";
import { CATEGORY_IMAGE_LINKS } from "@/lib/data/image-links/category-images";

export const CATEGORIES: Category[] = [
  {
    slug: "sherwani",
    name: "Sherwani",
    description: "Regal silhouettes for celebrations and weddings.",
    image: CATEGORY_IMAGE_LINKS.sherwani,
  },
  {
    slug: "blazer",
    name: "Blazer",
    description: "Structured tailoring with a contemporary edge.",
    image: CATEGORY_IMAGE_LINKS.blazer,
  },
  {
    slug: "coat",
    name: "Coat",
    description: "Layered luxury for cooler evenings and galas.",
    image: CATEGORY_IMAGE_LINKS.coat,
  },
  {
    slug: "suits",
    name: "Suits",
    description: "Precision-cut suits for boardrooms and banquets.",
    image: CATEGORY_IMAGE_LINKS.suits,
  },
  {
    slug: "kurta",
    name: "Kurta",
    description: "Effortless elegance in premium fabrics.",
    image: CATEGORY_IMAGE_LINKS.kurta,
  },
  {
    slug: "pants",
    name: "Pants",
    description: "Tailored trousers with impeccable drape.",
    image: CATEGORY_IMAGE_LINKS.pants,
  },
  {
    slug: "waistcoat",
    name: "Waistcoat",
    description: "Refined layers for celebrations and formal evenings.",
    image: CATEGORY_IMAGE_LINKS.waistcoat,
  },
  {
    slug: "indo-western",
    name: "Indo-Western",
    description: "Fusion tailoring — global form, Indian soul.",
    image: CATEGORY_IMAGE_LINKS["indo-western"],
  },
  {
    slug: "wedding-collection",
    name: "Wedding Collection",
    description: "Ceremonial grandeur for the groom and his circle.",
    image: CATEGORY_IMAGE_LINKS["wedding-collection"],
  },
  {
    slug: "festive-collection",
    name: "Festive Collection",
    description: "Rich tones and textures for festive gatherings.",
    image: CATEGORY_IMAGE_LINKS["festive-collection"],
  },
  {
    slug: "premium-collection",
    name: "Premium Collection",
    description: "Our finest curation — limited, elevated, iconic.",
    image: CATEGORY_IMAGE_LINKS["premium-collection"],
  },
];
