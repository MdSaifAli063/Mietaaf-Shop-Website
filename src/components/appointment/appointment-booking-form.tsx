"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, Mail, MapPin, Phone, Ruler, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE_EMAIL_DISPLAY } from "@/lib/site-contact";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const serviceTypes = [
  "Home fabric consultation",
  "Home measurement visit",
  "Fabric + measurement visit",
  "Wedding party consultation",
  "Studio appointment",
];

const outfitTypes = [
  "Sherwani",
  "Indo-Western",
  "Suit / Tuxedo",
  "Blazer",
  "Kurta set",
  "Multiple outfits",
];

const fabricPreferences = [
  "Silk blends",
  "Brocade",
  "Velvet",
  "Linen blends",
  "Textured suiting",
  "Help me choose",
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

export function AppointmentBookingForm() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="rounded-[2rem] border border-border/60 bg-card/95 p-5 shadow-[0_24px_70px_rgba(58,48,38,0.12)] ring-1 ring-black/5 sm:p-7 dark:ring-white/10"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);

        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        const get = (key: string) => String(form.get(key) || "").trim();
        const fabrics = form.getAll("fabrics").map(String).join(", ") || "Help me choose";
        const name = get("name");
        const email = get("email");

        const message = [
          "Hello Mietaaf,",
          "I want to book a home service appointment.",
          "",
          "Customer details:",
          `Name: ${name}`,
          `Phone: ${get("phone")}`,
          `Email: ${email || "Not shared"}`,
          `City / Area: ${get("city")}`,
          `Address: ${get("address")}`,
          "",
          "Appointment preference:",
          `Service: ${get("serviceType")}`,
          `Date: ${get("date")}`,
          `Time: ${get("time")}`,
          `Visit type: ${get("visitType")}`,
          "",
          "Style details:",
          `Outfit: ${get("outfitType")}`,
          `Fabric interest: ${fabrics}`,
          `Budget range: ${get("budget") || "Not decided"}`,
          `Occasion date: ${get("occasionDate") || "Not shared"}`,
          "",
          `Notes: ${get("notes") || "No extra notes"}`,
          "",
          "Please confirm availability and next steps.",
        ].join("\n");

        const subject = `Mietaaf appointment request - ${name}`;
        const openMailDraft = () => {
          window.location.href = `mailto:${SITE_EMAIL_DISPLAY}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        };

        try {
          if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
            openMailDraft();
            toast.success("EmailJS is not configured yet, so an email draft opened.");
            return;
          }

          const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              service_id: EMAILJS_SERVICE_ID,
              template_id: EMAILJS_TEMPLATE_ID,
              user_id: EMAILJS_PUBLIC_KEY,
              template_params: {
                to_email: SITE_EMAIL_DISPLAY,
                subject,
                from_name: name,
                reply_to: email || SITE_EMAIL_DISPLAY,
                phone: get("phone"),
                customer_email: email || "Not shared",
                city: get("city"),
                address: get("address"),
                service_type: get("serviceType"),
                appointment_date: get("date"),
                appointment_time: get("time"),
                visit_type: get("visitType"),
                outfit_type: get("outfitType"),
                fabrics,
                budget: get("budget") || "Not decided",
                occasion_date: get("occasionDate") || "Not shared",
                notes: get("notes") || "No extra notes",
                message,
              },
            }),
          });

          if (!response.ok) {
            throw new Error(await response.text());
          }

          toast.success("Appointment request sent to Mietaaf email.");
          formElement.reset();
        } catch {
          openMailDraft();
          toast.error("EmailJS could not send right now, so an email draft opened.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-primary">
            Appointment request
          </p>
          <h2 className="mt-2 font-heading text-2xl sm:text-3xl">Book your home visit</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Tell us what you need. Our concierge will confirm your slot, fabric selection,
            and measurement requirements after reviewing your request.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          <Mail className="size-4" aria-hidden />
          Email booking
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <Input name="name" required placeholder="Your name" />
        </Field>
        <Field label="Phone number">
          <Input name="phone" type="tel" required placeholder="+91 98765 43210" />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" placeholder="you@example.com" />
        </Field>
        <Field label="City / area">
          <Input name="city" required placeholder="Bengaluru, Shivaji Nagar..." />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Home visit address">
            <Input name="address" required placeholder="Flat / street / landmark" />
          </Field>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Service type">
          <select
            name="serviceType"
            required
            defaultValue="Fabric + measurement visit"
            className="h-11 w-full rounded-xl border border-input bg-background/80 px-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
          >
            {serviceTypes.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </select>
        </Field>
        <Field label="Preferred date">
          <Input name="date" type="date" required />
        </Field>
        <Field label="Preferred time">
          <Input name="time" type="time" required />
        </Field>
        <Field label="Visit type">
          <select
            name="visitType"
            required
            defaultValue="Home service"
            className="h-11 w-full rounded-xl border border-input bg-background/80 px-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
          >
            <option>Home service</option>
            <option>Studio visit</option>
            <option>Video consultation first</option>
          </select>
        </Field>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
        <Field label="Outfit interest">
          <select
            name="outfitType"
            required
            defaultValue="Sherwani"
            className="h-11 w-full rounded-xl border border-input bg-background/80 px-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
          >
            {outfitTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </Field>
        <Field label="Budget range">
          <Input name="budget" placeholder="Example: Rs 25,000 - Rs 60,000" />
        </Field>
      </div>

      <div className="mt-5 rounded-2xl border border-border/60 bg-muted/30 p-4">
        <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Fabric preferences
        </Label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fabricPreferences.map((fabric) => (
            <label
              key={fabric}
              className="flex min-h-11 items-center gap-3 rounded-xl border border-border/60 bg-background/70 px-3 text-sm"
            >
              <input name="fabrics" type="checkbox" value={fabric} className="size-4 accent-primary" />
              <span>{fabric}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Occasion date">
          <Input name="occasionDate" type="date" />
        </Field>
        <Field label="Quick reminders">
          <div className="grid gap-2 rounded-xl border border-border/60 bg-muted/25 p-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" aria-hidden />
              Slots are confirmed after request review.
          </span>
            <span className="inline-flex items-center gap-2">
              <Ruler className="size-4 text-primary" aria-hidden />
              Keep one well-fitting outfit ready for reference.
            </span>
          </div>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Notes">
            <Textarea
              name="notes"
              rows={4}
              placeholder="Tell us occasion, preferred colors, number of outfits, or any fitting details."
              className="rounded-xl bg-background/80"
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2 sm:gap-x-5">
          <span className="inline-flex items-center gap-2">
            <Phone className="size-4 text-primary" aria-hidden />
            Confirmation by phone or email
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 text-primary" aria-hidden />
            Bengaluru home service
          </span>
          <span className="inline-flex items-center gap-2 sm:col-span-2">
            <Scissors className="size-4 text-primary" aria-hidden />
            Fabric curation and measurement support
          </span>
        </div>
        <Button type="submit" size="lg" className="h-12 min-w-44 rounded-full" disabled={submitting}>
          {submitting ? "Sending..." : "Send appointment"}
        </Button>
      </div>
    </form>
  );
}
