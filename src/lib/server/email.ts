import "server-only";
import { ApiError } from "@/lib/server/api";
import { readDocument } from "@/lib/server/firestore";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

export type EmailKind = "CONTACT" | "APPOINTMENT" | "ORDER_CONFIRMATION";

function providerDiagnosis(status: number, message: string) {
  // Classify the response into fixed messages. Never log the provider body:
  // it may contain account details, submitted fields or credential values.
  if (/non[\s-]?browser/i.test(message)) {
    return { reason: "NON_BROWSER_API_DISABLED", hint: "Enable API requests for non-browser applications in EmailJS Account -> Security." };
  }
  if (/private[\s_-]?key|access[\s_-]?token/i.test(message)) {
    return { reason: "PRIVATE_KEY_REJECTED", hint: "Check the server-only EMAILJS_PRIVATE_KEY against EmailJS Account -> Security. Restart the server or redeploy after changing it." };
  }
  if (/origin|domain|referer|referrer/i.test(message)) {
    return { reason: "ORIGIN_REJECTED", hint: "Review EmailJS account origin restrictions and enable non-browser API access for this backend integration." };
  }
  if (/public[\s_-]?key|user_id/i.test(message)) {
    return { reason: "PUBLIC_KEY_REJECTED", hint: "Check the server-only EMAILJS_PUBLIC_KEY belongs to the account that owns this service and template." };
  }
  if (status === 429 || /quota|rate limit/i.test(message)) {
    return { reason: "PROVIDER_LIMIT", hint: "Check the EmailJS sending quota and wait before retrying." };
  }
  return {
    reason: status === 403 ? "PROVIDER_ACCESS_DENIED" : "PROVIDER_REQUEST_REJECTED",
    hint: status === 403
      ? "Check EmailJS Account -> Security: allow non-browser API requests and configure EMAILJS_PRIVATE_KEY if private-key authorization is enabled. Confirm the service, template and keys belong to the same account."
      : "Check the EmailJS service connection, template and server configuration.",
  };
}

function value(name: string) {
  // Legacy names are read ONLY here on the server to allow existing deployments
  // to migrate without exposing any EmailJS configuration in client bundles.
  return process.env[name]?.trim() || process.env[`NEXT_PUBLIC_${name}`]?.trim() || "";
}

export async function businessContact(token?: string) {
  try {
    const record = await readDocument("settings", "site", token);
    return {
      supportEmail: typeof record?.data.supportEmail === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.data.supportEmail) ? record.data.supportEmail : DEFAULT_SITE_SETTINGS.supportEmail,
      phoneDisplay: typeof record?.data.phoneDisplay === "string" ? record.data.phoneDisplay : DEFAULT_SITE_SETTINGS.phoneDisplay,
      whatsappNumber: typeof record?.data.whatsappNumber === "string" ? record.data.whatsappNumber.replace(/\D/g, "") : DEFAULT_SITE_SETTINGS.whatsappNumber,
    };
  } catch { return DEFAULT_SITE_SETTINGS; }
}

export async function sendEmail(kind: EmailKind, parameters: Record<string, string>) {
  const service = value("EMAILJS_SERVICE_ID");
  const template = value(`EMAILJS_${kind}_TEMPLATE_ID`) || (kind === "APPOINTMENT" ? value("EMAILJS_TEMPLATE_ID") : "");
  const publicKey = value("EMAILJS_PUBLIC_KEY");
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim() || "";
  if (!service || !template || !publicKey) {
    console.error("[email] Server configuration is incomplete", { kind });
    throw new ApiError(503, "Email delivery is temporarily unavailable. Please try again later.");
  }
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store", signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({ service_id: service, template_id: template, user_id: publicKey, ...(privateKey ? { accessToken: privateKey } : {}), template_params: parameters }),
  });
  if (!response.ok) {
    const message = (await response.text().catch(() => "")).slice(0, 4096);
    console.error("[email] Provider rejected delivery", {
      kind,
      status: response.status,
      ...providerDiagnosis(response.status, message),
    });
    throw new ApiError(502, "The email could not be sent. Please try again later.");
  }
}
