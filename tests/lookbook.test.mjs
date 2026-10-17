import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const result = {};
  const compiled = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("require", "exports", compiled)((name) => Object.hasOwn(mocks, name) ? mocks[name] : require(name), result);
  return result;
}
const lookbook = load("src/lib/lookbook.ts");
const products = Array.from({ length: 12 }, (_, index) => ({ slug: `product-${index}`, name: `Product ${index}` }));

test("an unconfigured lookbook preserves the first eight visible products", () => {
  const source = products.map((product, index) => ({ ...product, hidden: index === 0, deleted: index === 1 }));
  assert.deepEqual(lookbook.selectLookbookProducts(source, null).map(product => product.slug), products.slice(2, 10).map(product => product.slug));
});

test("saved lookbook order is respected without modifying catalogue order", () => {
  const before = products.map(product => product.slug);
  assert.deepEqual(lookbook.selectLookbookProducts(products, { productSlugs: ["product-6", "product-2", "product-9"] }).map(product => product.slug), ["product-6", "product-2", "product-9"]);
  assert.deepEqual(products.map(product => product.slug), before);
});

test("hidden, deleted, missing and duplicate products never leak into the gallery", () => {
  const source = products.map((product, index) => ({ ...product, hidden: index === 1, deleted: index === 2 }));
  assert.deepEqual(lookbook.selectLookbookProducts(source, { productSlugs: ["product-1", "product-2", "missing", "product-3", "product-3"] }).map(product => product.slug), ["product-3"]);
});

test("an explicitly empty saved selection stays empty instead of restoring fallback looks", () => {
  assert.deepEqual(lookbook.selectLookbookProducts(products, { productSlugs: [] }), []);
  assert.deepEqual(lookbook.selectLookbookProducts(products, { productSlugs: ["missing"] }), []);
});

test("published settings reject duplicate, empty and excessive selections", () => {
  assert.equal(lookbook.lookbookSettingsSchema.safeParse({ productSlugs: ["same", "same"] }).success, false);
  assert.equal(lookbook.lookbookSettingsSchema.safeParse({ productSlugs: [""] }).success, false);
  assert.equal(lookbook.lookbookSettingsSchema.safeParse({ productSlugs: Array.from({ length: lookbook.MAX_LOOKBOOK_ITEMS + 1 }, (_, i) => `product-${i}`) }).success, false);
  assert.equal(lookbook.lookbookSettingsSchema.safeParse({ productSlugs: [] }).success, true);
});

test("lookbook saves target only the existing admin-protected settings document", async () => {
  const writes = [];
  const service = load("src/services/lookbook.ts", {
    "firebase/firestore": { doc: (db, collection, id) => ({ collection, id }), setDoc: async (...args) => writes.push(args), serverTimestamp: () => "timestamp" },
    "@/firebase/client": { getFirebaseDb: () => ({}) },
    "@/lib/lookbook": lookbook,
  });
  await service.saveLookbookSettings({ productSlugs: ["product-4", "product-1"] });
  assert.deepEqual(writes, [[{ collection: "settings", id: "lookbook" }, { productSlugs: ["product-4", "product-1"], updatedAt: "timestamp" }, { merge: true }]]);
  await assert.rejects(service.saveLookbookSettings({ productSlugs: ["same", "same"] }));
  assert.equal(writes.length, 1);
});

test("missing Firebase configuration cannot report a successful publication", async () => {
  const service = load("src/services/lookbook.ts", { "firebase/firestore": {}, "@/firebase/client": { getFirebaseDb: () => null }, "@/lib/lookbook": lookbook });
  await assert.rejects(service.saveLookbookSettings({ productSlugs: [] }));
});

function hookHarness(configured = true) {
  let callbacks;
  let stopped = 0;
  const hook = load("src/hooks/use-lookbook-settings.ts", {
    react: { useSyncExternalStore: (subscribe, getSnapshot, getServerSnapshot) => ({ subscribe, getSnapshot, getServerSnapshot }) },
    "firebase/firestore": {
      doc: (db, collection, id) => ({ collection, id }),
      onSnapshot: (reference, next, error) => { assert.deepEqual(reference, { collection: "settings", id: "lookbook" }); callbacks = { next, error }; return () => stopped++; },
    },
    "@/firebase/client": { getFirebaseDb: () => configured ? {} : null },
    "@/lib/lookbook": lookbook,
  });
  return { store: hook.useLookbookSettings(), callbacks: () => callbacks, stopped: () => stopped };
}

test("live lookbook settings handle updates, invalid data, read failure and subscription cleanup", () => {
  const h = hookHarness();
  assert.deepEqual(h.store.getServerSnapshot(), { settings: null, ready: false, error: false });
  const unsubscribe = h.store.subscribe(() => {});
  h.callbacks().next({ exists: () => true, data: () => ({ productSlugs: ["product-4", "product-1"], updatedAt: "ignored metadata" }) });
  assert.deepEqual(h.store.getSnapshot(), { settings: { productSlugs: ["product-4", "product-1"] }, ready: true, error: false });
  h.callbacks().next({ exists: () => true, data: () => ({ productSlugs: ["same", "same"] }) });
  assert.equal(h.store.getSnapshot().error, true);
  assert.deepEqual(h.store.getSnapshot().settings.productSlugs, ["product-4", "product-1"]);
  h.callbacks().error(new Error("read failed"));
  assert.equal(h.store.getSnapshot().error, true);
  unsubscribe(); assert.equal(h.stopped(), 1);
  const nextUnsubscribe = h.store.subscribe(() => {});
  assert.equal(h.store.getSnapshot().ready, false);
  h.callbacks().next({ exists: () => false });
  assert.deepEqual(h.store.getSnapshot(), { settings: null, ready: true, error: false });
  nextUnsubscribe(); assert.equal(h.stopped(), 2);
});

test("public lookbook without Firebase uses the original gallery safely", () => {
  const h = hookHarness(false);
  const unsubscribe = h.store.subscribe(() => {});
  assert.deepEqual(h.store.getSnapshot(), { settings: null, ready: true, error: false });
  assert.equal(h.callbacks(), undefined);
  unsubscribe();
});
