import { fetchDocumentREST } from "@/lib/firebase-rest";
import { fabricSettingsSchema } from "@/lib/fabric-settings";
import { lookbookSettingsSchema } from "@/lib/lookbook";

export const revalidate = 60;
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (name !== "fabrics" && name !== "lookbook") return Response.json({ error: "Not found" }, { status: 404 });
  try {
    const raw = await fetchDocumentREST("settings", name, true);
    const data = raw === null ? null : name === "fabrics" ? fabricSettingsSchema.parse(raw) : lookbookSettingsSchema.parse(raw);
    return Response.json({ data }, { headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=120" } });
  } catch { return Response.json({ error: "This collection is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
