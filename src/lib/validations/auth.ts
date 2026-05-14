import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Minimum 6 characters"),
});

export const signupSchema = z
  .object({
    displayName: z.string().min(2, "Name is required"),
    email: z.string().email(),
    password: z.string().min(6, "Minimum 6 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const forgotSchema = z.object({
  email: z.string().email(),
});
