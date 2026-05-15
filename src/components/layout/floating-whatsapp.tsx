"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SITE_WHATSAPP_E164_DIGITS } from "@/lib/site-contact";
import { sanitizeWhatsAppNumber } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? SITE_WHATSAPP_E164_DIGITS;
  const num = sanitizeWhatsAppNumber(raw);
  const href = `https://wa.me/${num}?text=${encodeURIComponent("Hello Mietaaf, I would like styling assistance.")}`;

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-[max(1.25rem,env(safe-area-inset-right,0px))] z-50 max-w-dvw touch-manipulation animate-in fade-in zoom-in duration-300 md:bottom-[max(2rem,env(safe-area-inset-bottom,0px))] md:right-[max(2rem,env(safe-area-inset-right,0px))]">
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-black/30 ring-2 ring-white/30 transition-transform hover:scale-105 md:h-16 md:w-16"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 transition-transform group-hover:rotate-6 md:h-8 md:w-8" />
      </Link>
    </div>
  );
}
