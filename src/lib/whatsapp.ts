import type { CartItem, Product } from "@/types";
import { formatInr } from "@/lib/format";

export function sanitizeWhatsAppNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function buildOrderWhatsAppMessage(params: {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
  items: CartItem[];
  total: number;
}): string {
  const lines: string[] = [
    "Hello Mietaaf,",
    "I want to place an order.",
    "",
    "Customer Details:",
    `Name: ${params.customerName}`,
    `Phone: ${params.phone}`,
    `Address: ${params.address}, ${params.city}, ${params.state} - ${params.pincode}`,
  ];
  if (params.notes?.trim()) {
    lines.push(`Notes: ${params.notes.trim()}`);
  }
  lines.push("", "Products:");
  params.items.forEach((item, i) => {
    lines.push(
      `${i + 1}.`,
      `Product Name: ${item.name}`,
      `Size: ${item.size}`,
      `Color: ${item.color}`,
      `Quantity: ${item.quantity}`,
      `Price: ${formatInr(item.price)}`,
      "",
    );
  });
  lines.push(`Total Amount: ${formatInr(params.total)}`, "", "Please confirm my order.");
  return lines.join("\n");
}

export function buildWhatsAppUrl(phoneDigits: string, message: string): string {
  const num = sanitizeWhatsAppNumber(phoneDigits);
  const text = encodeURIComponent(message);
  return `https://wa.me/${num}?text=${text}`;
}

export function buildProductInquiryWhatsAppUrl(
  product: Product,
  params: { size: string; color: string; quantity: number },
  phoneDigits: string,
): string {
  const msg = [
    "Hello Mietaaf,",
    "I am interested in the following product:",
    "",
    `Product: ${product.name}`,
    `Size: ${params.size}`,
    `Color: ${params.color}`,
    `Quantity: ${params.quantity}`,
    `Unit price: ${formatInr(product.price)}`,
    `Line total: ${formatInr(product.price * params.quantity)}`,
    "",
    "Please confirm availability and next steps.",
  ].join("\n");
  return buildWhatsAppUrl(phoneDigits, msg);
}
