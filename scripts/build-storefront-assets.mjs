import fs from "node:fs/promises";
import sharp from "sharp";

await fs.mkdir("public/hero/optimized", { recursive: true });
for (const name of ["wedding-edit", "premium-suits", "festive-gold"]) {
  const source = `public/hero/${name}.webp`;
  const metadata = await sharp(source).metadata();
  const cropWidth = Math.round(metadata.height * .61);
  const crop = { left: Math.round((metadata.width - cropWidth) * .68), top: 0, width: cropWidth, height: metadata.height };
  for (const width of [960, 1440]) {
    await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 68 }).toFile(`public/hero/optimized/${name}-${width}.webp`);
    await sharp(source).resize({ width, withoutEnlargement: true }).avif({ quality: 40, effort: 4 }).toFile(`public/hero/optimized/${name}-${width}.avif`);
  }
  for (const width of [480, 768]) {
    await sharp(source).extract(crop).resize({ width }).webp({ quality: 60 }).toFile(`public/hero/optimized/${name}-mobile-${width}.webp`);
    await sharp(source).extract(crop).resize({ width }).avif({ quality: 35, effort: 4 }).toFile(`public/hero/optimized/${name}-mobile-${width}.avif`);
  }
}
await sharp("public/branding/mietaaf-logo.png").resize({ width: 600, withoutEnlargement: true }).webp({ quality: 88 }).toFile("public/branding/mietaaf-logo-display.webp");
console.log("Created responsive hero/display-logo assets. Original images and the social card are unchanged.");
