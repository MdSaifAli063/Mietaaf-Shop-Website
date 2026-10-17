import "server-only";
import { z } from "zod";
import { ApiError } from "@/lib/server/api";
import { readDocument, patchOrder } from "@/lib/server/firestore";
import { businessContact, sendEmail } from "@/lib/server/email";
import { storedOrderEmailSchema } from "@/lib/validations/email";
import { absoluteUrl } from "@/lib/seo";
import { formatInr } from "@/lib/format";

export async function confirmOrderOnServer(id: string, action: "confirm" | "resend", admin: { uid: string; token: string }) {
  const document = await readDocument("orders", id, admin.token);
  if (!document) throw new ApiError(404, "This order could not be found.");
  const parsed = storedOrderEmailSchema.safeParse(document.data);
  if (!parsed.success) throw new ApiError(409, "The order details need to be reviewed before confirmation.");
  const order = parsed.data;
  if (order.status === "cancelled") throw new ApiError(409, "Cancelled orders cannot be confirmed or emailed.");
  if (action === "resend" && !["confirmed", "shipped"].includes(order.status)) throw new ApiError(409, "Confirm the order before sending a confirmation email.");
  if (action === "confirm" && order.status !== "pending") {
    return { confirmed: true, emailSent: order.confirmationEmailStatus === "sent", alreadyConfirmed: true };
  }
  const now = new Date();
  const started = Date.parse(order.confirmationEmailStartedAt ?? "");
  if (order.confirmationEmailStatus === "sending" && Number.isFinite(started) && now.getTime() - started < 120_000) throw new ApiError(409, "An email request is already being processed. Please wait before retrying.");

  let customerEmail = order.customerEmail;
  if (!z.string().email().safeParse(customerEmail).success && order.userId) {
    try {
      const profile = await readDocument("users", order.userId, admin.token);
      if (typeof profile?.data.email === "string") customerEmail = profile.data.email;
    } catch {
      // Profile lookup only supplies an email fallback. Its availability must
      // not prevent an otherwise valid order from being confirmed.
      console.error("[order-confirmation] Customer email lookup unavailable");
    }
  }
  // Claim this document version before confirming/sending. Repeated Confirm
  // requests are idempotent; explicit Resend is a separate operation.
  await patchOrder(id, {
    ...(action === "confirm" ? { status: "confirmed", confirmedAt: now, confirmedBy: admin.uid } : {}),
    confirmationEmailStatus: "sending", confirmationEmailStartedAt: now, updatedAt: now,
    ...(z.string().email().safeParse(customerEmail).success ? { customerEmail } : {}),
  }, admin.token, document.updateTime);

  let delivered = false;
  try {
    if (!z.string().email().safeParse(customerEmail).success) throw new ApiError(409, "No customer email is available for this order.");
    const settings = await businessContact(admin.token);
    const number = id.toUpperCase();
    const items = order.items.map((item, index) => `${index + 1}. ${item.name} — Size ${item.size}, ${item.color}, Qty ${item.quantity} — ${formatInr(item.price * item.quantity)}`).join("\n");
    const placed = order.createdAt ? new Date(order.createdAt) : now;
    const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeZone: "Asia/Kolkata" }).format(Number.isFinite(placed.getTime()) ? placed : now);
    await sendEmail("ORDER_CONFIRMATION", { to_email: customerEmail, to_name: order.customerName, customer_name: order.customerName, customer_email: customerEmail, reply_to: settings.supportEmail, subject: `Your Mietaaf order #${number} is confirmed`, order_id: number, order_number: number, order_date: date, order_status: "Confirmed", order_items: items, order_total: formatInr(order.total), account_url: absoluteUrl("/profile#orders"), support_email: settings.supportEmail, support_phone: settings.phoneDisplay, whatsapp_url: `https://wa.me/${settings.whatsappNumber}`, message: `Your Mietaaf order #${number} has been confirmed.\n\n${items}\n\nTotal: ${formatInr(order.total)}` });
    delivered = true;
  } catch {
    // Confirmation is independent of email availability. A failed delivery can
    // be retried from the confirmed order without confirming it a second time.
    console.error("[order-confirmation] Email delivery failed");
  }
  await patchOrder(id, { confirmationEmailStatus: delivered ? "sent" : "failed", ...(delivered ? { confirmationEmailSentAt: new Date() } : {}), updatedAt: new Date() }, admin.token);
  return { confirmed: true, emailSent: delivered };
}
