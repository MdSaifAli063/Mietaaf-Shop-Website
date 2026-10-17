import { z } from "zod";
import { apiError, ApiError, checkOrigin, rateLimit, readJson, requestAddress } from "@/lib/server/api";
import { businessContact, sendEmail } from "@/lib/server/email";
import { appointmentEmailSchema, contactEmailSchema } from "@/lib/validations/email";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ kind: string }> }) {
  try {
    checkOrigin(request);
    const { kind } = await context.params;
    if (!["contact", "appointment"].includes(kind)) throw new ApiError(404, "This service is not available.");
    rateLimit(`public-email:${requestAddress(request)}`, 5, 10 * 60_000);
    const body = await readJson(request);
    // Destinations and template IDs always come from the server, never the form.
    if (kind === "contact") {
      const data = contactEmailSchema.safeParse(body);
      if (!data.success) throw new ApiError(400, "Please check the contact details and message.");
      const { name, email, phone, topic, message } = data.data;
      const settings = await businessContact();
      await sendEmail("CONTACT", { to_email: settings.supportEmail, subject: `Mietaaf contact enquiry - ${topic} - ${name}`, from_name: name, reply_to: email, customer_email: email, phone: phone || "Not shared", topic, customer_message: message, message: `New Mietaaf website contact enquiry\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not shared"}\nTopic: ${topic}\n\nMessage:\n${message}` });
    } else {
      const data = appointmentEmailSchema.safeParse(body);
      if (!data.success) throw new ApiError(400, "Please check the appointment details and preferred date and time.");
      const value = data.data;
      const settings = await businessContact();
      const fabrics = value.fabrics.join(", ") || "Help me choose";
      const message = ["Hello Mietaaf,", "I want to book a home service appointment.", "", "Customer details:", `Name: ${value.name}`, `Phone: ${value.phone}`, `Email: ${value.email || "Not shared"}`, `City / Area: ${value.city}`, `Address: ${value.address}`, "", "Appointment preference:", `Service: ${value.serviceType}`, `Date: ${value.date}`, `Time: ${value.time}`, `Visit type: ${value.visitType}`, "", "Style details:", `Outfit: ${value.outfitType}`, `Fabric interest: ${fabrics}`, `Budget range: ${value.budget || "Not decided"}`, `Occasion date: ${value.occasionDate || "Not shared"}`, "", `Notes: ${value.notes || "No extra notes"}`, "", "Please confirm availability and next steps."].join("\n");
      await sendEmail("APPOINTMENT", { to_email: settings.supportEmail, subject: `Mietaaf appointment request - ${value.name}`, from_name: value.name, reply_to: value.email || settings.supportEmail, phone: value.phone, customer_email: value.email || "Not shared", city: value.city, address: value.address, service_type: value.serviceType, appointment_date: value.date, appointment_time: value.time, visit_type: value.visitType, outfit_type: value.outfitType, fabrics, budget: value.budget || "Not decided", occasion_date: value.occasionDate || "Not shared", notes: value.notes || "No extra notes", message });
    }
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiError(error instanceof z.ZodError ? new ApiError(400, "Please check the details and try again.") : error, "public-email");
  }
}
