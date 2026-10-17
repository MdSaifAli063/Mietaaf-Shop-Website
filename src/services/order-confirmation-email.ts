"use client";

import { getFirebaseAuth } from "@/firebase/client";

type ConfirmationResult = {
  confirmed: boolean;
  emailSent: boolean;
  alreadyConfirmed?: boolean;
};

export async function sendOrderConfirmationEmail(
  id: string,
  action: "confirm" | "resend",
): Promise<ConfirmationResult> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error("Please sign in again before managing orders.");
  const token = await user.getIdToken(true);
  const response = await fetch("/api/admin/orders/confirmation", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id, action }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error || "Could not process this order. Please try again.");
  return result as ConfirmationResult;
}
