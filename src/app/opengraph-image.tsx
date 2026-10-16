import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Mietaaf Couture — Your Presence, Our Craft";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Preserve the image endpoints for previously shared links, serving the exact
// owner-selected card without cropping, compositing or re-encoding it.
export default async function Image() {
  const image = await readFile(join(process.cwd(), "public/branding/mietaaf-social-card.png"));
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": contentType },
  });
}
