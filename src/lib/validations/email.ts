import { z } from "zod";

const line = (max: number) => z.string().trim().max(max).refine((value) => !/[\x00-\x1f\x7f]/.test(value));
const email = z.string().trim().email().max(254);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
});

export const contactEmailSchema = z.object({
  name: line(100).min(1), email, phone: line(40).default(""),
  topic: z.enum(["General enquiry", "Order support", "Product & styling", "Wedding consultation", "Press & collaboration"]),
  message: z.string().trim().min(1).max(4000), website: z.literal("").optional(),
}).strict();

export const appointmentEmailSchema = z.object({
  name: line(100).min(1), phone: line(40).min(5), email: email.or(z.literal("")).default(""),
  city: line(150).min(1), address: line(500).min(1),
  serviceType: z.enum(["Home fabric consultation", "Home measurement visit", "Fabric + measurement visit", "Wedding party consultation", "Studio appointment"]),
  date, time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  visitType: z.enum(["Home service", "Studio visit", "Video consultation first"]),
  outfitType: z.enum(["Sherwani", "Indo-Western", "Suit / Tuxedo", "Blazer", "Kurta set", "Multiple outfits"]),
  fabrics: z.array(z.enum(["Silk blends", "Brocade", "Velvet", "Linen blends", "Textured suiting", "Help me choose"])).max(6).default([]),
  budget: line(150).default(""), occasionDate: date.or(z.literal("")).default(""), notes: z.string().trim().max(2000).default(""), website: z.literal("").optional(),
}).strict();

export const orderActionSchema = z.object({ id: z.string().regex(/^[A-Za-z0-9_-]{1,128}$/), action: z.enum(["confirm", "resend"]) }).strict();

export const storedOrderEmailSchema = z.object({
  customerName: line(200).min(1), customerEmail: z.string().default(""), userId: z.string().max(128).optional(),
  total: z.number().finite().min(0).max(1_000_000_000),
  status: z.enum(["pending", "confirmed", "shipped", "cancelled"]),
  createdAt: z.string().optional(), confirmationEmailStatus: z.string().optional(), confirmationEmailStartedAt: z.string().optional(),
  items: z.array(z.object({ name: line(200).min(1), size: line(60), color: line(100), price: z.number().finite().min(0).max(1_000_000_000), quantity: z.number().int().min(1).max(1000) })).min(1).max(50),
});
