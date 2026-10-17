import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import sharp from "sharp";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const result = {};
  const compiled = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("require", "exports", compiled)(name => Object.hasOwn(mocks, name) ? mocks[name] : require(name), result);
  return result;
}
const data = load("src/lib/data/fabrics.ts");
const whatsapp = load("src/lib/whatsapp.ts", { "@/lib/format": load("src/lib/format.ts") });
const helpers = load("src/lib/fabrics.ts", {
  "@/lib/data/fabrics": data, "@/lib/whatsapp": whatsapp,
  "@/lib/seo": { absoluteUrl: path => new URL(path, "https://www.mietaaf.com").href },
});
const { FABRIC_CATALOGUES: catalogues } = data;

test("every supplied image belongs to a catalogue or the editorial header", () => {
  const files = readdirSync("public/fabrics").filter(file => file.endsWith(".png")).sort();
  assert.equal(catalogues.length, 12);
  assert.equal(catalogues.reduce((total, catalogue) => total + catalogue.designs.length, 0), 67);
  assert.deepEqual([...catalogues.map(catalogue => catalogue.source), data.FABRIC_HERO_SOURCE].sort(), files);
  assert.equal(new Set(catalogues.map(catalogue => catalogue.slug)).size, catalogues.length);
});

test("catalogue and design crops stay inside their original sheets and have generated previews", async () => {
  for (const catalogue of catalogues) {
    const original = await sharp(`public/fabrics/${catalogue.source}`).metadata();
    assert.equal(original.width, catalogue.width); assert.equal(original.height, catalogue.height);
    assert.equal(new Set(catalogue.designs.map(design => design.id)).size, catalogue.designs.length);
    for (const crop of [catalogue.coverCrop, ...catalogue.designs.map(design => design.crop)]) {
      const [left, top, width, height] = crop;
      assert.ok(left >= 0 && top >= 0 && width > 0 && height > 0 && left + width <= original.width && top + height <= original.height, catalogue.slug);
    }
    for (const image of [catalogue.cover, catalogue.image, ...catalogue.designs.map(design => design.image)]) {
      assert.ok(existsSync(`public${image}`), image);
      const metadata = await sharp(`public${image}`).metadata(); assert.equal(metadata.format, "webp");
    }
  }
  assert.ok(existsSync(`public${data.FABRIC_HERO_IMAGE}`));
});

test("families separate tailoring, jacquard, shirting and Terri-Wool", () => {
  assert.equal(helpers.filterFabricCatalogues("all", "").length, 12);
  for (const [family, count] of [["tailoring", 2], ["jacquard", 8], ["shirting", 1], ["terri-wool", 1]]) {
    assert.equal(helpers.filterFabricCatalogues(family, "").length, count);
    assert.ok(helpers.filterFabricCatalogues(family, "").every(catalogue => catalogue.family === family));
  }
});

test("search matches colour, catalogue, family and exact printed reference without changing source order", () => {
  assert.equal(helpers.filterFabricCatalogues("all", "  LACHKINO NAVY  ")[0].slug, "lachkino-colour-collection");
  assert.equal(helpers.filterFabricCatalogues("all", "06A")[0].slug, "jacquard-ivory-and-blush");
  assert.equal(helpers.filterFabricCatalogues("shirting", "black stripes")[0].slug, "shirt-fabric-collection");
  assert.equal(helpers.filterFabricCatalogues("tailoring", "06A").length, 0);
  assert.equal(helpers.filterFabricCatalogues("all", "nonexistent fabric").length, 0);
  assert.equal(helpers.filterFabricCatalogues("all", "jacquard").length, 8);
});

test("every collection and design deep link resolves to the precise reference", () => {
  for (const catalogue of catalogues) {
    for (const design of [undefined, ...catalogue.designs]) {
      const hash = data.fabricReferencePath(catalogue, design).slice("/fabrics".length);
      const parsed = helpers.parseFabricReference(hash);
      assert.equal(parsed.catalogue, catalogue); assert.equal(parsed.design, design);
    }
  }
  for (const hash of ["", "#catalogues", "#fabric/missing", "#fabric/armani-colour-collection/missing", "#fabric/../", "#fabric/armani-colour-collection/forest-green/extra"]) assert.equal(helpers.parseFabricReference(hash), null);
});

test("WhatsApp enquiry encodes the catalogue, selected colour, printed reference and canonical link", () => {
  const catalogue = catalogues.find(catalogue => catalogue.slug === "jacquard-ivory-and-blush");
  const design = catalogue.designs[1];
  const url = new URL(helpers.fabricEnquiryUrl("+91 74110 25321", catalogue, design));
  assert.equal(url.origin + url.pathname, "https://wa.me/917411025321");
  const message = url.searchParams.get("text");
  for (const expected of [catalogue.title, design.name, "Catalogue reference: 06B", `https://www.mietaaf.com${data.fabricReferencePath(catalogue, design)}`, "composition", "availability", "pricing"]) assert.ok(message.includes(expected));
  assert.equal(helpers.parseFabricReference(new URL(message.match(/View: (.+)/)[1]).hash).design, design);
  const general = new URL(helpers.fabricEnquiryUrl("917411025321", catalogues[0])).searchParams.get("text");
  assert.ok(!general.includes("Catalogue reference:"));
  assert.ok(!general.includes("Design / colour:"));
});

test("original catalogue downloads preserve supplied filenames with safe encoded URLs", () => {
  for (const catalogue of catalogues) {
    const url = data.fabricOriginalUrl(catalogue);
    assert.ok(!url.includes(" "));
    assert.equal(decodeURIComponent(url.slice("/fabrics/".length)), catalogue.source);
  }
});
