const OPTIMIZED_REMOTE_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "ik.imagekit.io",
  "firebasestorage.googleapis.com",
  "lh3.googleusercontent.com",
  "bwo.co.in",
]);

/**
 * Known hosts retain Next.js optimization. Unknown admin-managed HTTPS hosts
 * render directly so a newly pasted CMS image cannot crash the storefront.
 */
export function bypassImageOptimization(src: string): boolean {
  if (!/^https?:\/\//i.test(src)) return false;
  try {
    return !OPTIMIZED_REMOTE_IMAGE_HOSTS.has(new URL(src).hostname.toLowerCase());
  } catch {
    return true;
  }
}
