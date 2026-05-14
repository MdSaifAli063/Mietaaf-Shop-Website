"use client";

import { useState } from "react";
import { PageEnter } from "@/components/motion/page-enter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <PageEnter>
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Contact</p>
          <h1 className="mt-3 font-heading text-4xl">Concierge</h1>
          <p className="mt-4 text-muted-foreground">
            Appointments, bespoke inquiries, and press — reach our Mumbai atelier desk.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li>Phone: +91 99999 99999</li>
            <li>Email: care@mietaaf.com</li>
            <li>Hours: 10:00 — 19:00 IST, Tue–Sun</li>
          </ul>
        </div>
        <Card className="border-border/60 p-6">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast.success("Message received — we will reply shortly.");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="nm">Name</Label>
              <Input id="nm" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="em">Email</Label>
              <Input id="em" type="email" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="msg">Message</Label>
              <Textarea id="msg" rows={4} required className="rounded-xl" />
            </div>
            <Button type="submit" className="rounded-full" disabled={sent}>
              {sent ? "Sent" : "Send message"}
            </Button>
          </form>
        </Card>
      </div>
    </PageEnter>
  );
}
