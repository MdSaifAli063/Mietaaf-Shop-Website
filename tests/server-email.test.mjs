import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { test } from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = process.cwd();
const origin = "https://www.mietaaf.com";
const admin = { uid: "owner", token: "admin-token" };
const order = {
  userId: "customer", customerName: "Test Customer", customerEmail: "buyer@example.test",
  total: 25000, status: "pending", createdAt: "2026-10-17T08:00:00.000Z",
  items: [{ name: "Test Suit", size: "40", color: "Black", price: 25000, quantity: 1 }],
};
const contact = { name: "Test Customer", email: "buyer@example.test", phone: "9876543210", topic: "General enquiry", message: "Please help with a fitting.", website: "" };
const appointment = { name: contact.name, email: "", phone: contact.phone, city: "Bengaluru", address: "Test address", serviceType: "Fabric + measurement visit", date: "2026-10-20", time: "11:30", visitType: "Home service", outfitType: "Sherwani", fabrics: ["Silk blends"], budget: "", occasionDate: "", notes: "", website: "" };

function encode(value) {
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encode) } };
  if (value && typeof value === "object") return { mapValue: { fields: fields(value) } };
  if (typeof value === "number") return { doubleValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  return { stringValue: value };
}
function fields(value) { return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, encode(item)])); }

// Load the actual TypeScript route/service modules with isolated environment,
// verified-token fixtures and mocked external HTTP. No live email or DB writes.
function harness(options = {}) {
  const state = {
    data: structuredClone({ orders: { test: order }, users: { customer: { email: "profile@example.test" } }, settings: { site: { supportEmail: "studio@example.test", phoneDisplay: "+91 1234567890", whatsappNumber: "911234567890" } } }),
    version: 1, sends: [], patches: [], requests: [], logs: [], verifications: [],
  };
  const env = { EMAILJS_SERVICE_ID: "server-service", EMAILJS_PUBLIC_KEY: "server-public", EMAILJS_PRIVATE_KEY: "server-private", EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID: "server-order", EMAILJS_CONTACT_TEMPLATE_ID: "server-contact", EMAILJS_APPOINTMENT_TEMPLATE_ID: "server-appointment", ...options.env };
  const fetch = async (input, init = {}) => {
    const url = new URL(input);
    state.requests.push({ url, init });
    if (url.hostname === "api.emailjs.com") {
      state.sends.push(JSON.parse(init.body));
      if (options.providerThrows) throw new Error("secret provider transport detail");
      return new Response(options.providerFails ? options.providerMessage || "secret provider error detail" : "OK", { status: options.providerFails ? 403 : 200 });
    }
    assert.equal(url.hostname, "firestore.googleapis.com");
    const [collection, id] = url.pathname.split("/documents/")[1].split("/").map(decodeURIComponent);
    if (collection === "users" && options.profileFails) throw new Error("profile unavailable");
    if (collection !== "settings") assert.equal(init.headers.Authorization, "Bearer admin-token");
    const data = state.data[collection]?.[id];
    if (!data) return Response.json({ error: { status: "NOT_FOUND" } }, { status: 404 });
    if (init.method === "PATCH") {
      assert.equal(collection, "orders");
      const precondition = url.searchParams.get("currentDocument.updateTime");
      if (precondition && precondition !== String(state.version)) return Response.json({ error: { status: "FAILED_PRECONDITION" } }, { status: 400 });
      if (!precondition) assert.equal(url.searchParams.get("currentDocument.exists"), "true");
      const patch = JSON.parse(init.body).fields;
      assert.deepEqual(url.searchParams.getAll("updateMask.fieldPaths").sort(), Object.keys(patch).sort());
      for (const [key, value] of Object.entries(patch)) data[key] = value.stringValue ?? value.timestampValue;
      state.version++;
      state.patches.push(patch);
    }
    return Response.json({ fields: fields(data), updateTime: String(state.version) });
  };
  const apps = [];
  const overrides = {
    "server-only": {},
    "@/lib/seo": { getSiteUrl: () => origin, absoluteUrl: (value) => origin + value },
    "@/firebase/server-public-config": { readFirebaseEnvValue: () => "test-project" },
    "firebase-admin/app": { getApps: () => apps, initializeApp: (config, name) => { assert.equal(config.projectId, "test-project"); const app = { name }; apps.push(app); return app; } },
    "firebase-admin/auth": { getAuth: () => ({ verifyIdToken: async (token) => { state.verifications.push(token); if (token === "admin-token") return { uid: "owner", admin: true }; if (token === "customer-token") return { uid: "customer" }; throw new Error("invalid token"); } }) },
    ...options.overrides,
  };
  const cache = new Map();
  function load(name) {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (!name.startsWith("@/")) return require(name);
    const file = path.join(root, "src", name.slice(2) + ".ts");
    if (cache.has(file)) return cache.get(file).exports;
    const record = { exports: {} };
    cache.set(file, record);
    const compiled = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
    new Function("require", "module", "exports", "process", "fetch", "console", compiled)(load, record, record.exports, { env }, options.fetch || fetch, { error: (...values) => state.logs.push(values) });
    return record.exports;
  }
  return { state, env, load };
}

let address = 0;
function request(body, options = {}) {
  return new Request(origin + "/api/endpoint", {
    method: "POST", body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { "Content-Type": "application/json", Origin: origin, Authorization: "Bearer admin-token", "x-vercel-forwarded-for": `192.0.2.${++address}`, ...options.headers },
  });
}
async function publicPost(h, kind, body, options) {
  return h.load("@/app/api/email/[kind]/route").POST(request(body, options), { params: Promise.resolve({ kind }) });
}

test("admin API rejects missing, invalid and customer tokens before reading orders", async () => {
  const h = harness();
  const post = h.load("@/app/api/admin/orders/confirmation/route").POST;
  for (const [token, status] of [["", 401], ["Bearer forged-admin", 401], ["Bearer customer-token", 403]]) {
    const response = await post(request({ id: "test", action: "confirm" }, { headers: { Authorization: token } }));
    assert.equal(response.status, status);
    assert.equal(h.state.requests.length, 0);
  }
  assert.deepEqual(h.state.verifications, ["forged-admin", "customer-token"]);
});

test("the real Firebase verifier rejects a malformed JWT without trusting claims", async () => {
  const { initializeApp, deleteApp } = require("firebase-admin/app");
  const { getAuth } = require("firebase-admin/auth");
  const app = initializeApp({ projectId: "test-project" }, "email-test-invalid-jwt");
  try { await assert.rejects(getAuth(app).verifyIdToken("not-a-jwt")); }
  finally { await deleteApp(app); }
});

test("admin API rejects recipient, price, template and path injection", async () => {
  const h = harness();
  const post = h.load("@/app/api/admin/orders/confirmation/route").POST;
  for (const body of [
    { id: "test", action: "confirm", to_email: "attacker@example.test" },
    { id: "test", action: "confirm", total: 1 },
    { id: "test", action: "confirm", template_id: "override" },
    { id: "../users/owner", action: "confirm" },
    { id: "test", action: "delete" },
  ]) assert.equal((await post(request(body))).status, 400);
  assert.equal(h.state.requests.length, 0);
});

test("same-origin, JSON type, malformed JSON and body-size checks protect both APIs", async () => {
  for (const endpoint of ["@/app/api/admin/orders/confirmation/route", "@/app/api/email/[kind]/route"]) {
    const h = harness();
    const post = (body, options) => h.load(endpoint).POST(request(body, options), { params: Promise.resolve({ kind: "contact" }) });
    assert.equal((await post(contact, { headers: { Origin: "https://attacker.example" } })).status, 403);
    assert.equal((await post(contact, { headers: { Origin: "" } })).status, 403);
    assert.equal((await post(contact, { headers: { "Content-Type": "text/plain" } })).status, 415);
    assert.equal((await post("{")).status, 400);
    assert.equal((await post(JSON.stringify({ message: "x".repeat(17000) }))).status, 413);
    assert.equal(h.state.sends.length, 0);
  }
});

test("confirmation uses saved recipient/items and records delivery with server credentials", async () => {
  const h = harness();
  const response = await h.load("@/app/api/admin/orders/confirmation/route").POST(request({ id: "test", action: "confirm" }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { confirmed: true, emailSent: true });
  const saved = h.state.data.orders.test;
  assert.equal(saved.status, "confirmed");
  assert.equal(saved.confirmedBy, "owner");
  assert.equal(saved.confirmationEmailStatus, "sent");
  assert.ok(saved.confirmationEmailSentAt);
  const sent = h.state.sends[0];
  assert.equal(sent.service_id, "server-service");
  assert.equal(sent.template_id, "server-order");
  assert.equal(sent.user_id, "server-public");
  assert.equal(sent.accessToken, "server-private");
  assert.equal(sent.template_params.to_email, order.customerEmail);
  assert.match(sent.template_params.order_items, /Test Suit/);
  assert.equal(sent.template_params.account_url, origin + "/profile#orders");
  assert.equal(sent.template_params.support_email, "studio@example.test");
});

test("same-origin checks support Next internal URLs and browser-facing preview hosts", async () => {
  const h = harness(); const { checkOrigin } = h.load("@/lib/server/api");
  assert.doesNotThrow(() => checkOrigin(new Request("http://localhost:3101/api/email/contact", { headers: { Host: "127.0.0.1:3101", Origin: "http://127.0.0.1:3101" } })));
  assert.doesNotThrow(() => checkOrigin(new Request("http://localhost/api/email/contact", { headers: { Host: "preview.example.test", "x-forwarded-proto": "https", Origin: "https://preview.example.test" } })));
  for (const origin of ["https://attacker.example", "http://preview.example.test", "https://preview.example.test:9999"]) {
    assert.throws(() => checkOrigin(new Request("http://localhost/api/email/contact", { headers: { Host: "preview.example.test", "x-forwarded-proto": "https", Origin: origin } })), { status: 403 });
  }
});

test("provider rejection, network failure and missing configuration still confirm orders", async () => {
  for (const options of [{ providerFails: true }, { providerThrows: true }, { env: { EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID: "" } }]) {
    const h = harness(options);
    const result = await h.load("@/lib/server/order-confirmation").confirmOrderOnServer("test", "confirm", admin);
    assert.deepEqual(result, { confirmed: true, emailSent: false });
    assert.equal(h.state.data.orders.test.status, "confirmed");
    assert.equal(h.state.data.orders.test.confirmationEmailStatus, "failed");
    assert.ok(!JSON.stringify(h.state.logs).includes("secret provider"));
    assert.ok(!JSON.stringify(h.state.logs).includes("server-private"));
  }
});

test("repeating Confirm does not send again; explicit Resend can retry delivery", async () => {
  const h = harness();
  const { confirmOrderOnServer: confirm } = h.load("@/lib/server/order-confirmation");
  await confirm("test", "confirm", admin);
  const result = await confirm("test", "confirm", admin);
  assert.equal(result.alreadyConfirmed, true);
  assert.equal(h.state.sends.length, 1);
  await confirm("test", "resend", admin);
  assert.equal(h.state.sends.length, 2);
  assert.equal(h.state.data.orders.test.status, "confirmed");
});

test("simultaneous confirmations use an atomic document precondition to send once", async () => {
  const h = harness();
  const { confirmOrderOnServer: confirm } = h.load("@/lib/server/order-confirmation");
  const results = await Promise.allSettled([confirm("test", "confirm", admin), confirm("test", "confirm", admin)]);
  assert.equal(results.filter(result => result.status === "fulfilled").length, 1);
  assert.equal(results.find(result => result.status === "rejected").reason.status, 409);
  assert.equal(h.state.sends.length, 1);
});

test("resending a pending/cancelled order and confirming a cancelled order are blocked", async () => {
  for (const [status, action] of [["pending", "resend"], ["cancelled", "resend"], ["cancelled", "confirm"]]) {
    const h = harness(); h.state.data.orders.test.status = status;
    await assert.rejects(h.load("@/lib/server/order-confirmation").confirmOrderOnServer("test", action, admin), { status: 409 });
    assert.equal(h.state.sends.length, 0);
    assert.equal(h.state.patches.length, 0);
  }
});

test("missing and malformed persisted orders are rejected without email", async () => {
  const h = harness(); const confirm = h.load("@/lib/server/order-confirmation").confirmOrderOnServer;
  await assert.rejects(confirm("missing", "confirm", admin), { status: 404 });
  h.state.data.orders.test.items = [];
  await assert.rejects(confirm("test", "confirm", admin), { status: 409 });
  assert.equal(h.state.sends.length, 0);
});

test("profile email fallback and absent email never prevent order confirmation", async () => {
  const h = harness(); h.state.data.orders.test.customerEmail = "";
  await h.load("@/lib/server/order-confirmation").confirmOrderOnServer("test", "confirm", admin);
  assert.equal(h.state.sends[0].template_params.to_email, "profile@example.test");
  const missing = harness(); missing.state.data.orders.test.customerEmail = "";
  delete missing.state.data.users.customer;
  const result = await missing.load("@/lib/server/order-confirmation").confirmOrderOnServer("test", "confirm", admin);
  assert.equal(result.confirmed, true); assert.equal(result.emailSent, false);
  assert.equal(missing.state.sends.length, 0);
});

test("active email leases block duplicate Resend while stale leases can be retried", async () => {
  const h = harness(); Object.assign(h.state.data.orders.test, { status: "confirmed", confirmationEmailStatus: "sending", confirmationEmailStartedAt: new Date().toISOString() });
  const confirm = h.load("@/lib/server/order-confirmation").confirmOrderOnServer;
  await assert.rejects(confirm("test", "resend", admin), { status: 409 });
  h.state.data.orders.test.confirmationEmailStartedAt = new Date(Date.now() - 180000).toISOString();
  await confirm("test", "resend", admin);
  assert.equal(h.state.sends.length, 1);
});

test("an unavailable customer profile does not block confirmation", async () => {
  const h = harness({ profileFails: true }); h.state.data.orders.test.customerEmail = "";
  const result = await h.load("@/lib/server/order-confirmation").confirmOrderOnServer("test", "confirm", admin);
  assert.deepEqual(result, { confirmed: true, emailSent: false });
  assert.equal(h.state.data.orders.test.status, "confirmed");
  assert.equal(h.state.data.orders.test.confirmationEmailStatus, "failed");
});

test("contact and appointment routes preserve template fields and fixed business recipient", async () => {
  for (const [kind, body] of [["contact", contact], ["appointment", appointment]]) {
    const h = harness(); const response = await publicPost(h, kind, body);
    assert.equal(response.status, 200); assert.deepEqual(await response.json(), { ok: true });
    const sent = h.state.sends[0];
    assert.equal(sent.template_id, "server-" + kind);
    assert.equal(sent.template_params.to_email, "studio@example.test");
    assert.equal(sent.template_params.from_name, contact.name);
    assert.match(sent.template_params.message, /Test Customer/);
    if (kind === "contact") assert.equal(sent.template_params.reply_to, contact.email);
    else {
      assert.equal(sent.template_params.reply_to, "studio@example.test");
      assert.equal(sent.template_params.fabrics, "Silk blends");
      assert.equal(sent.template_params.appointment_date, appointment.date);
    }
  }
});

test("public forms reject recipient/template overrides, spam traps, invalid dates and oversized fields", async () => {
  for (const [kind, body] of [
    ["contact", { ...contact, to_email: "attacker@example.test" }],
    ["contact", { ...contact, template_id: "override" }],
    ["contact", { ...contact, website: "spam" }],
    ["contact", { ...contact, name: "Name\nBcc: attacker@example.test" }],
    ["contact", { ...contact, message: "x".repeat(4001) }],
    ["appointment", { ...appointment, date: "2026-02-30" }],
    ["appointment", { ...appointment, time: "25:00" }],
  ]) {
    const h = harness(); assert.equal((await publicPost(h, kind, body)).status, 400); assert.equal(h.state.sends.length, 0);
  }
});

test("public errors never contain credentials or provider details", async () => {
  const h = harness({ providerFails: true }); const response = await publicPost(h, "contact", contact);
  assert.equal(response.status, 502);
  const body = await response.text();
  assert.ok(!/server-private|server-public|secret provider|EMAILJS/.test(body));
});

test("EmailJS 403 diagnostics identify account settings only in backend logs", async () => {
  for (const [message, reason] of [
    ["API calls are disabled for non-browser applications", "NON_BROWSER_API_DISABLED"],
    ["Invalid private key: server-private", "PRIVATE_KEY_REJECTED"],
    ["The origin is not allowed", "ORIGIN_REJECTED"],
    ["Invalid user_id: server-public", "PUBLIC_KEY_REJECTED"],
    ["Forbidden: secret provider error detail", "PROVIDER_ACCESS_DENIED"],
  ]) {
    const h = harness({ providerFails: true, providerMessage: message });
    const response = await publicPost(h, "contact", contact);
    assert.equal(response.status, 502);
    const diagnostic = h.state.logs.find(entry => entry[0] === "[email] Provider rejected delivery")[1];
    assert.equal(diagnostic.reason, reason);
    assert.ok(diagnostic.hint);
    assert.ok(!/server-private|server-public|secret provider/.test(JSON.stringify(h.state.logs)));
    assert.ok(!/EMAILJS|NON_BROWSER_API|Account|Security|server-private/.test(await response.text()));
  }
});

test("public and admin limits reject repeated requests", async () => {
  const h = harness(); const post = h.load("@/app/api/admin/orders/confirmation/route").POST;
  for (let i = 0; i < 20; i++) assert.equal((await post(request({ id: "invalid/path", action: "confirm" }))).status, 400);
  assert.equal((await post(request({ id: "test", action: "confirm" }))).status, 429);
  const p = harness();
  for (let i = 0; i < 5; i++) assert.equal((await publicPost(p, "contact", {}, { headers: { "x-vercel-forwarded-for": "192.0.2.1" } })).status, 400);
  assert.equal((await publicPost(p, "contact", contact, { headers: { "x-vercel-forwarded-for": "192.0.2.1" } })).status, 429);
});

test("client sends only the order ID/action and a fresh Firebase token to the same-origin API", async () => {
  let captured;
  const h = harness({
    overrides: { "@/firebase/client": { getFirebaseAuth: () => ({ currentUser: { getIdToken: async (refresh) => { assert.equal(refresh, true); return "fresh-token"; } } }) } },
    fetch: async (url, init) => { captured = { url, init }; return Response.json({ confirmed: true, emailSent: true }); },
  });
  await h.load("@/services/order-confirmation-email").sendOrderConfirmationEmail("test", "confirm");
  assert.equal(captured.url, "/api/admin/orders/confirmation");
  assert.equal(captured.init.headers.Authorization, "Bearer fresh-token");
  assert.deepEqual(JSON.parse(captured.init.body), { id: "test", action: "confirm" });
});

test("client refuses signed-out requests before any network call", async () => {
  let called = false;
  const h = harness({ overrides: { "@/firebase/client": { getFirebaseAuth: () => null } }, fetch: () => { called = true; } });
  await assert.rejects(h.load("@/services/order-confirmation-email").sendOrderConfirmationEmail("test", "confirm"), /sign in again/);
  assert.equal(called, false);
});
