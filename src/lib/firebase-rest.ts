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
};

export async function fetchCollectionREST(collectionName: string) {
  const config = getFirebasePublicClientConfig();
  if (!config?.projectId) return null;

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${collectionName}?pageSize=100`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );
    if (!res.ok) return null;
    const data = (await res.json()) as FirestoreListResponse;
    if (!data.documents) return [];

    return data.documents.map((doc) => parseFirestoreDocument(doc));
  } catch (error) {
    console.error(`Error fetching collection ${collectionName} via REST:`, error);
    return null;
  }
}

function parseFirestoreDocument(doc: FirestoreDocument) {
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
