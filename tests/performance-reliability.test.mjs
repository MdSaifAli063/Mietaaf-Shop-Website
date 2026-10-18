import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, mocks = {}, globals = {}) {
  const result = {};
  const compiled = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("require", "exports", ...Object.keys(globals), compiled)(name => Object.hasOwn(mocks, name) ? mocks[name] : require(name), result, ...Object.values(globals));
  return result;
}
const merger = load("src/lib/public-storefront.ts");
const defaults = load("src/lib/site-settings.ts", { "@/lib/site-contact": {} });

test("the public catalogue preserves admin edits, new records and tombstones without changing fallback order", () => {
  const local = [{ slug: "a", name: "Original", price: 10 }, { slug: "b", name: "Second" }];
  const result = merger.mergeStorefrontRecords(local, [{ slug: "a", hidden: true }, { slug: "b", name: "Edited" }, { slug: "new", name: "New" }], item => item.slug);
  assert.deepEqual(result.map(item => item.slug), ["a", "b", "new"]);
  assert.equal(result[0].hidden, true); assert.equal(result[0].price, 10); assert.equal(result[1].name, "Edited");
  assert.equal(local[0].hidden, undefined);
});

test("public catalogue reads only public collections and whitelists site settings fields", async () => {
  const reads = [];
  let outage = false, settingsOutage = false;
  const api = load("src/app/api/storefront/route.ts", {
    "@/lib/firebase-rest": {
      fetchCollectionREST: async name => { reads.push(name); return outage ? null : name === "products" ? [{ slug: "a", hidden: true }] : []; },
      fetchDocumentREST: async (collection, id, strict) => { reads.push(`${collection}/${id}`); assert.equal(strict, true); if (settingsOutage) throw Error("offline"); return id === "site" ? { brandTagline: "Edited", privateKey: "must-not-leak" } : { logoUrl: "/custom.webp", secret: "must-not-leak" }; },
    },
    "@/lib/data/products": { SHOP_PRODUCTS: [{ slug: "a", name: "A" }] },
    "@/lib/data/categories": { CATEGORIES: [] }, "@/lib/data/banners": { BANNERS: [] },
    "@/lib/site-settings": { DEFAULT_SITE_SETTINGS: { brandTagline: "Original" } }, "@/lib/public-storefront": merger,
  });
  const response = await api.GET(), data = await response.json();
  assert.equal(response.status, 200); assert.equal(data.allProducts[0].hidden, true);
  assert.deepEqual(data.settings, { brandTagline: "Edited" }); assert.equal(data.logoUrl, "/custom.webp");
  assert.ok(!JSON.stringify(data).includes("must-not-leak"));
  assert.deepEqual(reads.sort(), ["banners", "categories", "products", "settings/global", "settings/site"]);
  outage = true;
  const failed = await api.GET(); assert.equal(failed.status, 503); assert.equal(failed.headers.get("cache-control"), "no-store");
  outage = false; settingsOutage = true;
  assert.equal((await api.GET()).status, 503);
});

test("bounded REST reads deduplicate concurrent renders and distinguish absent documents from outages", async () => {
  let requests = 0;
  const rest = load("src/lib/firebase-rest.ts", {
    "@/firebase/server-public-config": { getFirebasePublicClientConfig: () => ({ projectId: "test-project" }) },
  }, { fetch: async url => {
    requests++;
    if (url.includes("missing")) return { ok: false, status: 404 };
    if (url.includes("offline")) throw Error("unavailable");
    return { ok: true, status: 200, json: async () => url.includes("settings/") ? { name: "settings/site", fields: { title: { stringValue: "Published" } } } : { documents: [{ name: "products/a", fields: { hidden: { booleanValue: true } } }] } };
  } });
  const collections = await Promise.all(Array.from({ length: 10 }, () => rest.fetchCollectionREST("products")));
  assert.equal(requests, 1); assert.deepEqual(collections[0], [{ id: "a", hidden: true }]);
  await Promise.all(Array.from({ length: 10 }, () => rest.fetchDocumentREST("settings", "site", true)));
  assert.equal(requests, 2);
  assert.equal(await rest.fetchDocumentREST("settings", "missing", true), null);
  await assert.rejects(rest.fetchDocumentREST("settings", "offline", true), /unavailable/);
  assert.equal(await rest.fetchCollectionREST("offline"), null);
});

test("public settings endpoints reject arbitrary documents and preserve explicitly empty publications", async () => {
  const data = load("src/lib/data/fabrics.ts");
  const fabrics = load("src/lib/fabric-settings.ts", { "@/lib/data/fabrics": data });
  const lookbook = load("src/lib/lookbook.ts");
  let raw = { catalogues: [] }, outage = false;
  const reads = [];
  const api = load("src/app/api/public-settings/[name]/route.ts", {
    "@/lib/firebase-rest": { fetchDocumentREST: async (...args) => { reads.push(args); if (outage) throw Error("offline"); return raw; } },
    "@/lib/fabric-settings": fabrics, "@/lib/lookbook": lookbook,
  });
  const request = name => api.GET(new Request("https://example.test"), { params: Promise.resolve({ name }) });
  assert.equal((await request("users")).status, 404); assert.equal(reads.length, 0);
  assert.deepEqual(await (await request("fabrics")).json(), { data: { catalogues: [] } });
  assert.deepEqual(reads[0], ["settings", "fabrics", true]);
  raw = { productSlugs: [] }; assert.deepEqual(await (await request("lookbook")).json(), { data: { productSlugs: [] } });
  outage = true; const failed = await request("fabrics"); assert.equal(failed.status, 503); assert.equal(failed.headers.get("cache-control"), "no-store");
});

test("Firebase initializes once, avoids the startup OAuth iframe and uses the documented long-polling transport", () => {
  const calls = [], app = {}, auth = {}, db = {};
  const client = load("src/firebase/client.ts", {
    "firebase/app": { getApps: () => [], initializeApp: () => app },
    "firebase/auth": { browserLocalPersistence: "local", indexedDBLocalPersistence: "indexed", initializeAuth: (a, settings) => { calls.push({ kind: "auth", a, settings }); return auth; }, getAuth: () => { throw Error("Unexpected default initialization"); } },
    "firebase/firestore": { initializeFirestore: (a, settings) => { calls.push({ kind: "db", a, settings }); return db; }, getFirestore: () => { throw Error("Unexpected default initialization"); } },
    "firebase/storage": {}, "./config": { isFirebaseConfigured: () => true, getFirebaseEnv: () => ({}) },
  });
  assert.equal(client.getFirebaseAuth(), auth); assert.equal(client.getFirebaseAuth(), auth);
  assert.equal(client.getFirebaseDb(), db); assert.equal(client.getFirebaseDb(), db);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0].settings, { persistence: ["local", "indexed"] });
  assert.deepEqual(calls[1].settings, { experimentalForceLongPolling: true, experimentalLongPollingOptions: { timeoutSeconds: 25 } });
});

test("admin settings wait for server confirmation on every subscription and retain saved settings during an outage", () => {
  let next, timeout, stopped = 0;
  const hook = load("src/hooks/use-admin-site-settings.ts", {
    react: { useSyncExternalStore: (subscribe, getSnapshot) => ({ subscribe, getSnapshot }) },
    "firebase/firestore": { doc: () => ({}), onSnapshot: (ref, options, callback) => { assert.equal(options.includeMetadataChanges, true); next = callback; return () => stopped++; } },
    "@/firebase/client": { getFirebaseDb: () => ({}) }, "@/lib/site-settings": { DEFAULT_SITE_SETTINGS: { brandTagline: "Original" } },
  }, { setTimeout: callback => { timeout = callback; return 1; }, clearTimeout: () => {} });
  const store = hook.useAdminSiteSettings(); let stop = store.subscribe(() => {});
  next({ metadata: { fromCache: true }, exists: () => false }); assert.equal(store.getSnapshot().loading, true);
  next({ metadata: { fromCache: false }, exists: () => true, data: () => ({ brandTagline: "Saved" }) });
  assert.equal(store.getSnapshot().loading, false); stop();
  stop = store.subscribe(() => {}); assert.equal(store.getSnapshot().loading, true);
  timeout(); assert.equal(store.getSnapshot().error, true); assert.equal(store.getSnapshot().settings.brandTagline, "Saved");
  next({ metadata: { fromCache: false }, exists: () => true, data: () => ({ brandTagline: "Recovered" }) });
  assert.equal(store.getSnapshot().error, false); assert.equal(store.getSnapshot().settings.brandTagline, "Recovered");
  stop(); assert.equal(stopped, 2);
});

test("display logo optimization preserves custom artwork and the selected social card", () => {
  const logo = load("src/lib/site-logo.ts");
  assert.equal(logo.displayLogoUrl("/branding/mietaaf-logo.png"), "/branding/mietaaf-logo-display.webp");
  assert.equal(logo.displayLogoUrl("https://cdn.example.test/my-logo.png"), "https://cdn.example.test/my-logo.png");
  assert.equal(logo.SITE_SOCIAL_CARD_URL, "/branding/mietaaf-social-card.png");
});

test("public reads share one request, preserve last-good data on failure and recover after reconnection", async () => {
  const events = new Map(), timers = new Map(); let nextTimer = 0, requests = 0, fail = false;
  const listenerTarget = { addEventListener: (name, callback) => events.set(name, callback), removeEventListener: name => events.delete(name) };
  const document = { ...listenerTarget, visibilityState: "visible" }, navigator = { onLine: true };
  const data = { allProducts: [{ slug: "published" }], allCategories: [], allBanners: [], settings: { brandTagline: "Published" }, logoUrl: null };
  const hook = load("src/hooks/use-public-storefront.ts", {
    react: { useSyncExternalStore: (subscribe, getSnapshot) => ({ subscribe, getSnapshot }) },
    "@/lib/data/products": { SHOP_PRODUCTS: [] }, "@/lib/data/categories": { CATEGORIES: [] }, "@/lib/data/banners": { BANNERS: [] }, "@/lib/site-settings": defaults,
  }, { window: listenerTarget, document, navigator, fetch: async () => { requests++; if (fail) throw Error("offline"); return { ok: true, json: async () => data }; }, setTimeout: callback => { const id = ++nextTimer; timers.set(id, callback); return id; }, clearTimeout: id => timers.delete(id) });
  const store = hook.usePublicStorefront();
  const stop1 = store.subscribe(() => {}), stop2 = store.subscribe(() => {});
  await new Promise(resolve => setImmediate(resolve)); assert.equal(requests, 1); assert.equal(store.getSnapshot().allProducts[0].slug, "published");
  fail = true; events.get("focus")(); await new Promise(resolve => setImmediate(resolve)); assert.equal(store.getSnapshot().error, true); assert.equal(store.getSnapshot().allProducts[0].slug, "published");
  fail = false; events.get("online")(); await new Promise(resolve => setImmediate(resolve)); assert.equal(store.getSnapshot().error, false);
  stop1(); stop2(); assert.equal(timers.size, 0); assert.equal(events.size, 0);
});
