"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <Card className="rounded-xl border-border/55 bg-card/90 p-5 shadow-[0_8px_32px_rgba(36,39,33,0.035)] ring-1 ring-black/5 sm:p-7 dark:ring-white/10">
      <h2 className="font-heading text-xl sm:text-2xl">Write to us</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Orders, styling, or press — we reply within one business day.
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();

          setSubmitting(true);
          const formElement = event.currentTarget;
          const form = new FormData(formElement);
          const get = (key: string) => String(form.get(key) || "").trim();
          const name = get("name");
          const email = get("email");
          const phone = get("phone");
          const topic = get("topic");
          const customerMessage = get("message");
          try {
            const response = await fetch("/api/email/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name, email, phone, topic, message: customerMessage, website: get("website"),
              }),
            });

            if (!response.ok) {
              throw new Error("Message delivery failed.");
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
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
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
