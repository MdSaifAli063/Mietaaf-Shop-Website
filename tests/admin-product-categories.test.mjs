import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync("src/lib/admin-product-categories.ts", "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const exports = {};
new Function("exports", compiled)(exports);
const { groupAdminProducts, adminCategoryProductsHref } = exports;
const categories = [{ slug: "sherwani", name: "Sherwani" }, { slug: "suits", name: "Suits" }, { slug: "empty", name: "Empty category" }];

test("each product appears once in its exact saved category, regardless of label or tags", () => {
  const products = [
    { slug: "one", categorySlug: "sherwani", category: "Suits", tags: ["premium", "wedding"] },
    { slug: "two", categorySlug: "suits", category: "Sherwani", wedding: true },
    { slug: "three", categorySlug: "suits", category: "Suits" },
  ];
  const groups = groupAdminProducts(products, categories);
  assert.deepEqual(groups.map(group => group.products.map(product => product.slug)), [["one"], ["two", "three"], []]);
  assert.equal(groups.flatMap(group => group.products).length, products.length);
});

test("hidden and deleted items stay manageable but do not inflate visible counts", () => {
  const groups = groupAdminProducts([
    { slug: "visible", categorySlug: "suits" },
    { slug: "hidden", categorySlug: "suits", hidden: true },
    { slug: "deleted", categorySlug: "suits", deleted: true },
  ], categories);
  assert.equal(groups[1].products.length, 3);
  assert.equal(groups[1].visible, 1);
});

test("removed categories and unassigned records remain accessible without losing products", () => {
  const products = [{ slug: "orphan", categorySlug: "retired", category: "Retired collection" }, { slug: "unassigned", categorySlug: "", category: "Old display label" }];
  const groups = groupAdminProducts(products, categories);
  assert.equal(groups.find(group => group.slug === "retired").name, "Retired collection");
  assert.equal(groups.find(group => group.slug === "").name, "Unassigned products");
  assert.equal(groups.flatMap(group => group.products).length, 2);
  assert.equal(adminCategoryProductsHref(""), "/admin/products/unassigned");
});

test("category order, empty categories, custom slugs and encoded links are retained", () => {
  const groups = groupAdminProducts([], categories);
  assert.deepEqual(groups.map(group => group.slug), ["sherwani", "suits", "empty"]);
  assert.equal(adminCategoryProductsHref("custom-collection"), "/admin/categories/custom-collection");
  assert.equal(adminCategoryProductsHref("wedding-collection"), "/admin/wedding");
  assert.equal(adminCategoryProductsHref("premium-collection"), "/admin/premium");
  assert.equal(adminCategoryProductsHref("custom/collection"), "/admin/categories/custom%2Fcollection");
});

test("category product saves handle empty optional prices and preserve assignment", async () => {
  const writes = [];
  const removed = { type: "delete-field" };
  const mocks = {
    "firebase/firestore": { doc: (db, name, id) => ({ name, id }), setDoc: async (...args) => writes.push(args), serverTimestamp: () => "timestamp", deleteField: () => removed },
    "firebase/storage": {},
    "@/firebase/client": { getFirebaseDb: () => ({}) },
    "@/services/storage-image-upload": {},
  };
  const service = {};
  const script = ts.transpileModule(readFileSync("src/services/products.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("require", "exports", script)((name) => { assert.ok(mocks[name], name); return mocks[name]; }, service);
  const value = { slug: "new-suit", categorySlug: "suits", category: "Suits", compareAtPrice: undefined, discountPercent: undefined };
  await service.createProduct(value);
  assert.equal(writes[0][1].categorySlug, "suits");
  assert.equal(Object.hasOwn(writes[0][1], "compareAtPrice"), false);
  assert.equal(Object.hasOwn(writes[0][1], "discountPercent"), false);
  await service.updateProduct("new-suit", { ...value, hidden: true });
  assert.equal(writes[1][1].categorySlug, "suits");
  assert.equal(writes[1][1].hidden, true);
  assert.equal(writes[1][1].compareAtPrice, removed);
  assert.equal(writes[1][1].discountPercent, removed);
  assert.deepEqual(writes[1][2], { merge: true });
});
