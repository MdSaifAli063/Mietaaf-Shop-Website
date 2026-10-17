import "server-only";
import { createHash } from "node:crypto";
import { getSiteUrl } from "@/lib/seo";

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  // Next's internal request URL can use localhost behind a reverse proxy.
  // Compare with the browser-facing Host as well, including its port/protocol.
  const host = request.headers.get("host") || url.host;
  const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() || url.protocol.slice(0, -1);
  const allowed = new Set([getSiteUrl()]);
  if (["http", "https"].includes(protocol) && /^[a-z0-9.:[\]-]+$/i.test(host)) {
    allowed.add(`${protocol}://${host.toLowerCase()}`);
  }
  if (!origin || !allowed.has(origin)) {
    throw new ApiError(403, "This request is not allowed.");
  }
}

export async function readJson(request: Request, maxBytes = 16_384): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new ApiError(415, "Please send a valid request.");
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, "Please send a valid request.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) { await reader.cancel(); throw new ApiError(413, "This request is too large."); }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "Please send a valid request.");
  }
}

// Per-instance abuse protection. Order delivery also uses a durable Firestore
// precondition, so concurrent server instances cannot send the same operation.
const limits = new Map<string, { count: number; until: number }>();
export function rateLimit(key: string, maximum: number, windowMs: number) {
  const now = Date.now();
  if (limits.size > 2000) for (const [id, entry] of limits) if (entry.until <= now) limits.delete(id);
  const entry = limits.get(key);
  if (entry && entry.until > now) {
    if (entry.count >= maximum) throw new ApiError(429, "Please wait a little before trying again.");
    entry.count += 1;
  } else {
    if (limits.size > 5000) throw new ApiError(429, "Please try again shortly.");
    limits.set(key, { count: 1, until: now + windowMs });
  }
}

export function requestAddress(request: Request) {
  const value = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "unknown";
  return createHash("sha256").update(value.split(",")[0].trim()).digest("hex");
}

export function apiError(error: unknown, context: string) {
  const status = error instanceof ApiError ? error.status : 500;
  // Never return provider responses, tokens, credentials or stack traces.
  console.error(`[${context}] request failed`, { status });
  return Response.json({ error: error instanceof ApiError ? error.message : "We could not complete this request. Please try again." }, { status, headers: { "Cache-Control": "no-store" } });
}
