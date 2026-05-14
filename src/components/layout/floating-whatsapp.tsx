"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { sanitizeWhatsAppNumber } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";
  const num = sanitizeWhatsAppNumber(raw);
  const href = `https://wa.me/${num}?text=${encodeURIComponent("Hello Mietaaf, I would like styling assistance.")}`;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.4 }}
    >
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-black/30 ring-2 ring-white/30 transition-transform hover:scale-105 md:h-16 md:w-16"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 transition-transform group-hover:rotate-6 md:h-8 md:w-8" />
      </Link>
    </motion.div>
  );
}
