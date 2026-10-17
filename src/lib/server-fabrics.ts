import { cache } from "react";
import { fetchDocumentREST } from "@/lib/firebase-rest";
import { resolveFabricSettings, selectVisibleFabrics } from "@/lib/fabric-settings";

export const getServerFabrics = cache(async () => selectVisibleFabrics(resolveFabricSettings(await fetchDocumentREST("settings", "fabrics")).catalogues));
