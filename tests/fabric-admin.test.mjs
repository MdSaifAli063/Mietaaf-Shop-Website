import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const result = {};
  const compiled = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("require", "exports", compiled)(name => Object.hasOwn(mocks, name) ? mocks[name] : require(name), result);
  return result;
}
const data = load("src/lib/data/fabrics.ts");
const settings = load("src/lib/fabric-settings.ts", { "@/lib/data/fabrics": data });
const initial = () => settings.defaultFabricSettings();

test("existing catalogues seed administration without a migration or undefined Firestore fields", () => {
  const value = initial();
  assert.equal(value.catalogues.length, 12);
  assert.equal(value.catalogues.reduce((total, catalogue) => total + catalogue.designs.length, 0), 67);
  assert.deepEqual(JSON.parse(JSON.stringify(value)), value);
  assert.equal(value.catalogues[0].hidden, false);
  assert.equal(value.catalogues[0].designs[0].hidden, false);
  assert.equal("crop" in value.catalogues[0].designs[0], false);
  assert.deepEqual(settings.resolveFabricSettings(null), value);
  assert.deepEqual(settings.resolveFabricSettings({ catalogues: [] }), { catalogues: [] });
});

test("visibility and removal apply before public rendering while preserving order and references", () => {
  const value = initial();
  value.catalogues[1].hidden = true;
  value.catalogues[0].designs[0].hidden = true;
  value.catalogues.reverse();
  const visible = settings.selectVisibleFabrics(value.catalogues);
  assert.deepEqual(visible.map(catalogue => catalogue.slug), value.catalogues.filter(catalogue => !catalogue.hidden).map(catalogue => catalogue.slug));
  const armani = visible.find(catalogue => catalogue.slug === "armani-colour-collection");
  assert.equal(armani.designs.length, 11);
  assert.ok(!armani.designs.some(design => design.id === "forest-green"));
  assert.equal(value.catalogues.find(catalogue => catalogue.slug === "armani-colour-collection").designs.length, 12);
  assert.deepEqual(settings.selectVisibleFabrics([]), []);
});

test("catalogue and design validation rejects duplicate IDs, unsafe URLs and invalid dimensions", () => {
  const value = initial();
  assert.equal(settings.fabricSettingsSchema.safeParse({ catalogues: [value.catalogues[0], value.catalogues[0]] }).success, false);
  const catalogue = structuredClone(value.catalogues[0]);
  catalogue.designs.push(catalogue.designs[0]);
  assert.equal(settings.fabricCatalogueSchema.safeParse(catalogue).success, false);
  for (const image of ["javascript:alert(1)", "//evil.example/image.png", "data:image/svg+xml,test", "http://example.test/a.png", "/\\evil.example/a.png", "https://user:password@example.test/a.png"]) assert.equal(settings.fabricImageSchema.safeParse(image).success, false, image);
  for (const image of ["/fabrics/optimized/fabric-palette.webp", "https://firebasestorage.googleapis.com/v0/b/test/o/fabric.png?alt=media&token=example"]) assert.equal(settings.fabricImageSchema.safeParse(image).success, true);
  assert.equal(settings.fabricCatalogueSchema.safeParse({ ...value.catalogues[0], width: 0 }).success, false);
  assert.equal(settings.fabricCatalogueSchema.safeParse({ ...value.catalogues[0], height: 20001 }).success, false);
  assert.equal(settings.fabricCatalogueSchema.safeParse({ ...value.catalogues[0], designs: [] }).success, true);
});

test("public search and deep links use the published catalogue set, including new and hidden designs", () => {
  const helpers = load("src/lib/fabrics.ts", { "@/lib/data/fabrics": data, "@/lib/seo": {}, "@/lib/whatsapp": {} });
  const newCatalogue = { ...initial().catalogues[0], slug: "new-catalogue", title: "New library", designs: [{ id: "custom-blue", name: "Custom blue", reference: "CB7", image: "/new.webp", hidden: false }, { id: "secret", name: "Hidden design", image: "/secret.webp", hidden: true }] };
  const published = settings.selectVisibleFabrics([newCatalogue]);
  assert.equal(helpers.filterFabricCatalogues("all", "cb7", published)[0].slug, "new-catalogue");
  assert.equal(helpers.filterFabricCatalogues("all", "secret", published).length, 0);
  assert.equal(helpers.parseFabricReference("#fabric/new-catalogue/custom-blue", published).design.reference, "CB7");
  assert.equal(helpers.parseFabricReference("#fabric/new-catalogue/secret", published), null);
  assert.equal(helpers.parseFabricReference("#fabric/armani-colour-collection", published), null);
});

test("saves target only the admin-protected fabrics document, preserve empty arrays and reject invalid data", async () => {
  const writes = [];
  const service = load("src/services/fabrics.ts", {
    "firebase/firestore": { doc: (db, collection, id) => ({ collection, id }), serverTimestamp: () => "timestamp", setDoc: async (...args) => writes.push(args) },
    "@/firebase/client": { getFirebaseDb: () => ({}) }, "@/lib/fabric-settings": settings,
    "@/services/storage-image-upload": {},
  });
  await service.saveFabricSettings({ catalogues: [] });
  assert.deepEqual(writes, [[{ collection: "settings", id: "fabrics" }, { catalogues: [], updatedAt: "timestamp" }, { merge: true }]]);
  await service.saveFabricSettings(initial());
  assert.equal(writes[1][1].catalogues.length, 12);
  await assert.rejects(service.saveFabricSettings({ catalogues: [{ slug: "invalid" }] }));
  assert.equal(writes.length, 2);
  const failing = load("src/services/fabrics.ts", { "firebase/firestore": {}, "@/firebase/client": { getFirebaseDb: () => null }, "@/lib/fabric-settings": settings, "@/services/storage-image-upload": {} });
  await assert.rejects(failing.saveFabricSettings({ catalogues: [] }));
});

test("fabric uploads use the existing protected image namespace and reject unsupported file types", async () => {
  const uploads = [];
  const service = load("src/services/fabrics.ts", { "firebase/firestore": {}, "@/firebase/client": {}, "@/lib/fabric-settings": settings, "@/services/storage-image-upload": { uploadStorageImage: async options => { uploads.push(options); return "https://example.test/fabric.png"; } } });
  const file = { type: "image/png", size: 100, name: "Fabric.png" };
  assert.equal(await service.uploadFabricImage(file), "https://example.test/fabric.png");
  assert.equal(uploads[0].folder, "products/fabrics"); assert.equal(uploads[0].maxBytes, 5 * 1024 * 1024);
  await assert.rejects(service.uploadFabricImage({ type: "image/svg+xml" }));
  await assert.rejects(service.uploadFabricImage({ type: "application/pdf" }));
  assert.equal(uploads.length, 1);
});

function hookHarness(configured = true) {
  let callbacks; let stopped = 0;
  const hook = load("src/hooks/use-fabric-settings.ts", {
    react: { useSyncExternalStore: (subscribe, getSnapshot, getServerSnapshot) => ({ subscribe, getSnapshot, getServerSnapshot }) },
    "firebase/firestore": { doc: (db, collection, id) => ({ collection, id }), onSnapshot: (reference, ...handlers) => { const [next, error] = handlers.slice(-2); assert.deepEqual(reference, { collection: "settings", id: "fabrics" }); callbacks = { next, error }; return () => stopped++; } },
    "@/firebase/client": { getFirebaseDb: () => configured ? {} : null }, "@/lib/fabric-settings": settings,
  });
  return { store: hook.useFabricSettings(), callbacks: () => callbacks, stopped: () => stopped };
}
test("realtime reads handle saved emptiness, invalid updates, errors and subscription cleanup", () => {
  const h = hookHarness(); const unsubscribe = h.store.subscribe(() => {});
  h.callbacks().next({ metadata: { fromCache: true }, exists: () => false });
  assert.equal(h.store.getSnapshot().ready, false, "An empty offline cache cannot authorize publishing a replacement library.");
  h.callbacks().next({ exists: () => true, data: () => ({ catalogues: [] }) });
  assert.deepEqual(h.store.getSnapshot(), { settings: { catalogues: [] }, ready: true, error: false });
  h.callbacks().next({ exists: () => true, data: () => ({ catalogues: "invalid" }) });
  assert.deepEqual(h.store.getSnapshot(), { settings: { catalogues: [] }, ready: true, error: true });
  h.callbacks().error(new Error("Unavailable")); assert.equal(h.store.getSnapshot().error, true);
  unsubscribe(); assert.equal(h.stopped(), 1);
  const stop = h.store.subscribe(() => {}); assert.equal(h.store.getSnapshot().ready, false);
  h.callbacks().next({ exists: () => false }); assert.deepEqual(h.store.getSnapshot(), { settings: null, ready: true, error: false }); stop();
  assert.equal(h.stopped(), 2);
  const unconfigured = hookHarness(false); unconfigured.store.subscribe(() => {})();
  assert.deepEqual(unconfigured.store.getSnapshot(), { settings: null, ready: true, error: false });
});

test("server rendering, schema and sitemap receive the published visible catalogues or the existing fallback", async () => {
  let raw = null;
  const server = load("src/lib/server-fabrics.ts", { react: { cache: callback => callback }, "@/lib/firebase-rest": { fetchDocumentREST: async (collection, id) => { assert.equal(collection, "settings"); assert.equal(id, "fabrics"); return raw; } }, "@/lib/fabric-settings": settings });
  assert.equal((await server.getServerFabrics()).length, 12);
  raw = { catalogues: [] }; assert.deepEqual(await server.getServerFabrics(), []);
  raw = initial(); raw.catalogues[0].hidden = true; raw.catalogues[1].designs[0].hidden = true;
  const published = await server.getServerFabrics(); assert.equal(published.length, 11); assert.equal(published[0].designs.length, 11);
});

test("Firestore rules keep fabric publishing and image uploads restricted to the admin claim", () => {
  const firestore = readFileSync("firebase/firestore.rules", "utf8");
  const storage = readFileSync("firebase/storage.rules", "utf8");
  assert.match(firestore, /match \/settings\/\{settingId\}\s*\{\s*allow read: if true;\s*allow write: if isAdmin\(\);/);
  assert.match(storage, /match \/products\/\{allPaths=\*\*\}\s*\{\s*allow read: if true;\s*allow create, update: if isAdmin\(\)/);
});
