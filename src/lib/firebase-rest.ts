import { getFirebasePublicClientConfig } from "@/firebase/server-public-config";

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } }
  | { timestampValue: string }
  | { nullValue: null };

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
};

type FirestoreListResponse = {
  documents?: FirestoreDocument[];
  nextPageToken?: string;
};

type SharedRead<T> = { expires: number; value: Promise<T> };
const collectionReads = new Map<string, SharedRead<Record<string, unknown>[]>>();
const documentReads = new Map<string, SharedRead<Record<string, unknown> | null>>();

/** Share bounded reads: an AbortSignal opts out of React's fetch memoization. */
function sharedRead<T>(reads: Map<string, SharedRead<T>>, key: string, read: () => Promise<T>): Promise<T> {
  const existing = reads.get(key);
  if (existing && existing.expires > Date.now()) return existing.value;
  const entry = { expires: Date.now() + 60000, value: read() };
  reads.set(key, entry);
  void entry.value.catch(() => { entry.expires = Date.now() + 5000; });
  return entry.value;
}

export async function fetchCollectionREST(
  collectionName: string,
): Promise<Record<string, unknown>[] | null> {
  const config = getFirebasePublicClientConfig();
  if (!config?.projectId) return null;

  try {
    return await sharedRead(collectionReads, `${config.projectId}/${collectionName}`, async () => {
      const documents: FirestoreDocument[] = [];
      let pageToken = "";

      do {
        const params = new URLSearchParams({ pageSize: "100" });
        if (pageToken) params.set("pageToken", pageToken);
        const res = await fetch(
          `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${collectionName}?${params}`,
          { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) },
        );
        if (!res.ok) throw new Error("Public catalogue unavailable");
        const data = (await res.json()) as FirestoreListResponse;
        documents.push(...(data.documents ?? []));
        pageToken = data.nextPageToken ?? "";
      } while (pageToken);

      return documents.map((doc) => parseFirestoreDocument(doc));
    });
  } catch {
    return null;
  }
}

/** Read one publicly readable settings document with the same cache as catalogue data. */
export async function fetchDocumentREST(collectionName: string, documentId: string, strict = false): Promise<Record<string, unknown> | null> {
  const config = getFirebasePublicClientConfig();
  if (!config?.projectId) { if (strict) throw new Error("Datastore unavailable"); return null; }
  try {
    return await sharedRead(documentReads, `${config.projectId}/${collectionName}/${documentId}`, async () => {
      const response = await fetch(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${encodeURIComponent(collectionName)}/${encodeURIComponent(documentId)}`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Datastore unavailable");
      return parseFirestoreDocument(await response.json() as FirestoreDocument);
    });
  } catch (error) { if (strict) throw error; return null; }
}

function parseFirestoreDocument(doc: FirestoreDocument): Record<string, unknown> {
  const id = doc.name.split("/").pop();
  const fields = doc.fields ?? {};
  const parsed = parseFields(fields);
  return { id, ...parsed };
}

function parseFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  const parsed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    parsed[key] = parseValue(value);
  }
  return parsed;
}

function parseValue(val: FirestoreValue): unknown {
  if ("stringValue" in val) return val.stringValue;
  if ("integerValue" in val) return parseInt(val.integerValue, 10);
  if ("doubleValue" in val) return val.doubleValue;
  if ("booleanValue" in val) return val.booleanValue;
  if ("arrayValue" in val) {
    return (val.arrayValue.values ?? []).map((v) => parseValue(v));
  }
  if ("mapValue" in val) {
    return parseFields(val.mapValue.fields ?? {});
  }
  if ("timestampValue" in val) return val.timestampValue;
  if ("nullValue" in val) return null;
  return undefined;
}
