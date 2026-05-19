import type { Category } from "@/types";
import { UNSPLASH_PHOTOS, unsplashImageUrl } from "@/lib/unsplash-images";

export const CATEGORIES: Category[] = [
  {
    slug: "sherwani",
    name: "Sherwani",
    description: "Regal silhouettes for celebrations and weddings.",
    image: unsplashImageUrl(UNSPLASH_PHOTOS.weddingSherwani, 1200, 80),
  },
  {
    slug: "blazer",
    name: "Blazer",
    description: "Structured tailoring with a contemporary edge.",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "coat",
    name: "Coat",
    description: "Layered luxury for cooler evenings and galas.",
    image: unsplashImageUrl(UNSPLASH_PHOTOS.coat, 1200, 80),
  },
  {
    slug: "suits",
    name: "Suits",
    description: "Precision-cut suits for boardrooms and banquets.",
    image: "/catalog/catalog-page-01.png",
  },
  {
    slug: "kurta",
    name: "Kurta",
    description: "Effortless elegance in premium fabrics.",
    image: unsplashImageUrl(UNSPLASH_PHOTOS.festiveGold, 1200, 80),
  },
  {
    slug: "pants",
    name: "Pants",
    description: "Tailored trousers with impeccable drape.",
    image: unsplashImageUrl(UNSPLASH_PHOTOS.suitFormal, 1200, 80),
  },
  {
    slug: "designer-dresses",
    name: "Designer Dresses",
    description: "Statement designer pieces for spotlight moments.",
    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "indo-western",
    name: "Indo-Western",
    description: "Fusion tailoring — global form, Indian soul.",
    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "wedding-collection",
    name: "Wedding Collection",
    description: "Ceremonial grandeur for the groom and his circle.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "festive-collection",
    name: "Festive Collection",
    description: "Rich tones and textures for festive gatherings.",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "premium-collection",
    name: "Premium Collection",
    description: "Our finest curation — limited, elevated, iconic.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format&fit=crop",
  },
];
