import { formatInr } from "@/lib/format";
import {
  SITE_EMAIL_DISPLAY,
  SITE_PHONE_DISPLAY,
  SITE_WHATSAPP_E164_DIGITS,
} from "@/lib/site-contact";
import type { OrderLine } from "@/types";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export type OrderConfirmationEmail = {
  id: string;
  customerName: string;
  customerEmail: string;
  createdAt: Date | null;
  items: OrderLine[];
  total: number;
  supportEmail?: string;
  supportPhone?: string;
  whatsappNumber?: string;
};

export function isOrderConfirmationEmailConfigured(): boolean {
  return Boolean(
    EMAILJS_SERVICE_ID &&
      EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID &&
      EMAILJS_PUBLIC_KEY,
  );
}

function formatOrderItems(items: OrderLine[]): string {
  return items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} — Size ${item.size}, ${item.color}, Qty ${
          item.quantity
        } — ${formatInr(item.price * item.quantity)}`,
    )
    .join("\n");
}

export async function sendOrderConfirmationEmail(
  order: OrderConfirmationEmail,
): Promise<void> {
  if (
    !EMAILJS_SERVICE_ID ||
    !EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID ||
    !EMAILJS_PUBLIC_KEY
  ) {
    throw new Error("Order confirmation email is not configured.");
  }

  const orderNumber = order.id.toUpperCase();
  const accountUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    window.location.origin
  }/profile#orders`;
  const orderDate = order.createdAt
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(
        order.createdAt,
      )
    : new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(
        new Date(),
      );
  const orderItems = formatOrderItems(order.items);
  const subject = `Your Mietaaf order #${orderNumber} is confirmed`;
  const supportEmail = order.supportEmail || SITE_EMAIL_DISPLAY;
  const supportPhone = order.supportPhone || SITE_PHONE_DISPLAY;
  const whatsappNumber = order.whatsappNumber || SITE_WHATSAPP_E164_DIGITS;

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: order.customerEmail,
        to_name: order.customerName,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        reply_to: supportEmail,
        subject,
        order_id: orderNumber,
        order_number: orderNumber,
        order_date: orderDate,
        order_status: "Confirmed",
        order_items: orderItems,
        order_total: formatInr(order.total),
        account_url: accountUrl,
        support_email: supportEmail,
        support_phone: supportPhone,
        whatsapp_url: `https://wa.me/${whatsappNumber}`,
        message: `Your Mietaaf order #${orderNumber} has been confirmed.\n\n${orderItems}\n\nTotal: ${formatInr(
          order.total,
        )}`,
      },
    }),
  });

  if (!response.ok) {
    throw new Error((await response.text()) || "EmailJS request failed.");
  }
}
