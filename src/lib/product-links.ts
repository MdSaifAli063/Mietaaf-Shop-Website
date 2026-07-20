/** Build a product URL that keeps the image currently shown to the customer. */
export function buildProductHref(slug: string, image?: string): string {
  const pathname = `/product/${slug}`;
  return image ? `${pathname}?image=${encodeURIComponent(image)}` : pathname;
}

/** Only accept local public paths or HTTPS image links from the URL. */
export function normalizeProductImageParam(value: string | null): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;

  try {
    const url = new URL(value);
    const trustedHosts = new Set([
      "images.unsplash.com",
      "ik.imagekit.io",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
    ]);
    return url.protocol === "https:" && trustedHosts.has(url.hostname) ? value : undefined;
  } catch {
    return undefined;
  }
}
