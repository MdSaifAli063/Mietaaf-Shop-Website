/** Verified Unsplash IDs for men's fashion — dead IDs map to working replacements. */
export const UNSPLASH_PHOTOS = {
  weddingSherwani: "1519741497674-611481863552",
  suitFormal: "1593032465175-481ac7f401a0",
  festiveGold: "1469334031218-e382a71b716b",
  blazer: "1594938298603-c8148c4dae35",
  coat: "1507679799987-c73779587ccf",
  tailoring: "1520975954732-35dd22299614",
  designer: "1617127365659-c47fa864d8bc",
  portrait: "1507003211169-0a1dd7228f2d",
} as const;

const REPLACEMENTS: Record<string, string> = {
  "1593037617599-2040e0c8d3ad": UNSPLASH_PHOTOS.weddingSherwani,
  "1539533018407-2cb987c8abdc": UNSPLASH_PHOTOS.coat,
  "1617137984093-3e3b3f5e5a0e": UNSPLASH_PHOTOS.festiveGold,
  "1624378515193-66bb5a006a80": UNSPLASH_PHOTOS.suitFormal,
};

export function resolveUnsplashId(photoId: string): string {
  return REPLACEMENTS[photoId] ?? photoId;
}

export function unsplashImageUrl(photoId: string, width = 900, quality = 82): string {
  const id = resolveUnsplashId(photoId);
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=${quality}&auto=format&fit=crop`;
}
