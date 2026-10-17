import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import ts from "typescript";

const code = ts.transpileModule(await fs.readFile("src/lib/data/fabrics.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const data = {};
new Function("exports", code)(data);
const directory = path.resolve("public/fabrics/optimized");
await fs.mkdir(directory, { recursive: true });
let count = 0;
async function crop(source, rectangle, target, width, height) {
  const [left, top, cropWidth, cropHeight] = rectangle;
  await sharp(source).extract({ left, top, width: cropWidth, height: cropHeight })
    .resize(width, height, { fit: "cover" }).webp({ quality: 88 }).toFile(target);
  count++;
}
for (const catalogue of data.FABRIC_CATALOGUES) {
  const source = path.join("public/fabrics", catalogue.source);
  const metadata = await sharp(source).metadata();
  if (metadata.width !== catalogue.width || metadata.height !== catalogue.height) throw new Error(`Source dimensions changed: ${catalogue.source}`);
  await crop(source, catalogue.coverCrop, path.join("public", catalogue.cover), 900, 675);
  await sharp(source).webp({ quality: 94 }).toFile(path.join("public", catalogue.image));
  count++;
  for (const design of catalogue.designs) await crop(source, design.crop, path.join("public", design.image), 480, 560);
}
await sharp(path.join("public/fabrics", data.FABRIC_HERO_SOURCE)).resize({ width: 1448 }).webp({ quality: 88 }).toFile(path.join("public", data.FABRIC_HERO_IMAGE));
console.log(`Created ${count + 1} WebP assets for ${data.FABRIC_CATALOGUES.length} catalogues. Original files were preserved.`);
