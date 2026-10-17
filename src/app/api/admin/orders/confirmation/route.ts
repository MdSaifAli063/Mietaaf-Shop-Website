import { apiError, ApiError, checkOrigin, rateLimit, readJson } from "@/lib/server/api";
import { requireAdmin } from "@/lib/server/admin-auth";
import { confirmOrderOnServer } from "@/lib/server/order-confirmation";
import { orderActionSchema } from "@/lib/validations/email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const admin = await requireAdmin(request);
    rateLimit(`admin-order-email:${admin.uid}`, 20, 60_000);
    const parsed = orderActionSchema.safeParse(await readJson(request, 4096));
    if (!parsed.success) throw new ApiError(400, "Please choose a valid order action.");
    const result = await confirmOrderOnServer(parsed.data.id, parsed.data.action, admin);
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiError(error, "admin-order-confirmation"); }
}
