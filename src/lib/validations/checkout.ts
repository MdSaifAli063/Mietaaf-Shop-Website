import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15)
    .regex(/^[\d+\s-]+$/, "Invalid characters in phone"),
  address: z.string().min(8, "Please enter a complete address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a 6-digit pincode"),
  notes: z.string().max(500).optional(),
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
