import { buildOrderWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { CartItem } from "@/types";

export function buildCheckoutWhatsAppUrl(
  data: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    notes?: string;
    items: CartItem[];
    total: number;
  },
  businessPhone: string,
): string {
  const message = buildOrderWhatsAppMessage({
    customerName: data.fullName,
    phone: data.phone,
    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    notes: data.notes,
    items: data.items,
    total: data.total,
  });
  return buildWhatsAppUrl(businessPhone, message);
}
