"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <Card className="rounded-[1.5rem] border-border/55 bg-card/90 p-5 shadow-[0_18px_45px_rgba(58,48,38,0.07)] ring-1 ring-black/5 sm:p-7 dark:ring-white/10">
      <h2 className="font-heading text-xl sm:text-2xl">Write to us</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Orders, appointments, or press — we reply within one business day.
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
          toast.success("Message received — we will reply shortly.");
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" required className="h-11 min-h-11 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" type="email" required className="h-11 min-h-11 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-msg">Message</Label>
          <Textarea id="contact-msg" rows={4} required className="rounded-xl" />
        </div>
        <Button type="submit" className="h-11 w-full rounded-full sm:w-auto" disabled={sent}>
          {sent ? "Sent" : "Send message"}
        </Button>
      </form>
    </Card>
  );
}
