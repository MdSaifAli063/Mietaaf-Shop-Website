import "server-only";
import { ApiError } from "@/lib/server/api";
import { getProjectId } from "@/lib/server/admin-auth";

type Value = { stringValue?: string; timestampValue?: string; integerValue?: string; doubleValue?: number; booleanValue?: boolean; nullValue?: null; arrayValue?: { values?: Value[] }; mapValue?: { fields?: Record<string, Value> } };
type Document = { fields?: Record<string, Value>; updateTime: string };
export type StoredDocument = { data: Record<string, unknown>; updateTime: string };

function decode(value: Value): unknown {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.arrayValue) return (value.arrayValue.values ?? []).map(decode);
  if (value.mapValue) return decodeFields(value.mapValue.fields ?? {});
  return null;
}
function decodeFields(fields: Record<string, Value>) { return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decode(value)])); }
function encode(value: string | Date): Value { return value instanceof Date ? { timestampValue: value.toISOString() } : { stringValue: value }; }
function url(collection: string, id: string) { return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(getProjectId())}/databases/(default)/documents/${collection}/${encodeURIComponent(id)}`; }

export async function readDocument(collection: string, id: string, token?: string): Promise<StoredDocument | null> {
  const response = await fetch(url(collection, id), { headers: token ? { Authorization: `Bearer ${token}` } : {}, cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new ApiError(response.status === 403 ? 403 : 502, "The order service could not read the requested information.");
  const document = await response.json() as Document;
  return { data: decodeFields(document.fields ?? {}), updateTime: document.updateTime };
}

export async function patchOrder(id: string, values: Record<string, string | Date>, token: string, updateTime?: string) {
  const target = new URL(url("orders", id));
  for (const field of Object.keys(values)) target.searchParams.append("updateMask.fieldPaths", field);
  // All patches require an existing record; the lock additionally requires the
  // exact version read by this request (compare-and-swap across instances).
  target.searchParams.set(updateTime ? "currentDocument.updateTime" : "currentDocument.exists", updateTime || "true");
  const response = await fetch(target, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ fields: Object.fromEntries(Object.entries(values).map(([key, value]) => [key, encode(value)])) }), cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    const details = await response.json().catch(() => null) as { error?: { status?: string } } | null;
    if (["FAILED_PRECONDITION", "ABORTED"].includes(details?.error?.status ?? "")) throw new ApiError(409, "This order changed. Refresh it before trying again.");
    throw new ApiError(response.status === 403 ? 403 : 502, "The order could not be updated. Please refresh and try again.");
  }
}
