"use client";

import { useState } from "react";
import { PageEnter } from "@/components/motion/page-enter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";
import { SITE_ADDRESS_DISPLAY, SITE_PHONE_DISPLAY } from "@/lib/site-contact";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <PageEnter>
      <div className={`${PAGE_CONTAINER} ${PAGE_PY} grid min-w-0 max-w-5xl gap-8 lg:grid-cols-2 lg:gap-10`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Contact</p>
          <h1 className="mt-3 font-heading text-3xl sm:text-4xl">Concierge</h1>
          <p className="mt-4 text-muted-foreground">
            Appointments, bespoke inquiries, and press — reach our Bengaluru atelier desk.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li>Phone: {SITE_PHONE_DISPLAY}</li>
            <li>Email: care@mietaaf.com</li>
            <li>Address: {SITE_ADDRESS_DISPLAY}</li>
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
              <Input id="nm" required className="h-11 min-h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="em">Email</Label>
              <Input id="em" type="email" required className="h-11 min-h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="msg">Message</Label>
              <Textarea id="msg" rows={4} required className="rounded-xl" />
            </div>
            <Button type="submit" className="h-11 w-full rounded-full sm:w-auto" disabled={sent}>
              {sent ? "Sent" : "Send message"}
            </Button>
          </form>
        </Card>
      </div>
    </PageEnter>
  );
}
