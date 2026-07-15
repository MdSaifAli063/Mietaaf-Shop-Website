"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE_EMAIL_DISPLAY } from "@/lib/site-contact";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_CONTACT_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <Card className="rounded-[1.5rem] border-border/55 bg-card/90 p-5 shadow-[0_18px_45px_rgba(58,48,38,0.07)] ring-1 ring-black/5 sm:p-7 dark:ring-white/10">
      <h2 className="font-heading text-xl sm:text-2xl">Write to us</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Orders, styling, or press — we reply within one business day.
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();

          if (!EMAILJS_SERVICE_ID || !EMAILJS_CONTACT_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
            toast.error("Contact email service is not configured yet.");
            return;
          }

          setSubmitting(true);
          const formElement = event.currentTarget;
          const form = new FormData(formElement);
          const get = (key: string) => String(form.get(key) || "").trim();
          const name = get("name");
          const email = get("email");
          const phone = get("phone");
          const topic = get("topic");
          const customerMessage = get("message");
          const subject = `Mietaaf contact enquiry - ${topic} - ${name}`;
          const message = [
            "New Mietaaf website contact enquiry",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone || "Not shared"}`,
            `Topic: ${topic}`,
            "",
            "Message:",
            customerMessage,
          ].join("\n");

          try {
            const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_CONTACT_TEMPLATE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                template_params: {
                  to_email: SITE_EMAIL_DISPLAY,
                  subject,
                  from_name: name,
                  reply_to: email,
                  customer_email: email,
                  phone: phone || "Not shared",
                  topic,
                  customer_message: customerMessage,
                  message,
                },
              }),
            });

            if (!response.ok) {
              throw new Error(await response.text());
            }

            toast.success("Message sent to Mietaaf. We will reply shortly.");
            formElement.reset();
          } catch {
            toast.error("We could not send your message. Please try again shortly.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            className="h-11 min-h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-11 min-h-11 rounded-xl"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-phone">
              Phone <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="h-11 min-h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-topic">Enquiry about</Label>
            <select
              id="contact-topic"
              name="topic"
              required
              defaultValue="General enquiry"
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
            >
              <option>General enquiry</option>
              <option>Order support</option>
              <option>Product &amp; styling</option>
              <option>Wedding consultation</option>
              <option>Press &amp; collaboration</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-msg">Message</Label>
          <Textarea id="contact-msg" name="message" rows={4} required className="rounded-xl" />
        </div>
        <Button type="submit" className="h-11 w-full rounded-full sm:w-auto" disabled={submitting}>
          {submitting ? "Sending..." : "Send message"}
        </Button>
      </form>
    </Card>
  );
}
