"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_WHATSAPP_E164_DIGITS } from "@/lib/site-contact";
import { sanitizeWhatsAppNumber } from "@/lib/whatsapp";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M16.04 3C8.86 3 3.02 8.82 3.02 15.98c0 2.45.69 4.84 1.99 6.91L3 30.32l7.62-1.99a13.06 13.06 0 0 0 5.42 1.17h.01c7.18 0 13.02-5.82 13.02-12.98C29.07 8.84 23.23 3 16.04 3Zm0 24.26h-.01c-1.84 0-3.65-.49-5.23-1.42l-.38-.23-4.52 1.18 1.21-4.39-.25-.4a10.71 10.71 0 0 1-1.63-5.69c0-5.9 4.82-10.71 10.75-10.71 2.87 0 5.57 1.12 7.6 3.14a10.65 10.65 0 0 1 3.15 7.57c0 5.9-4.82 10.71-10.75 10.71Z"
      />
      <path
        d="M22.23 18.94c-.34-.17-2.01-.99-2.32-1.1-.31-.12-.54-.17-.77.17-.23.34-.88 1.1-1.08 1.33-.2.23-.4.26-.74.09-.34-.17-1.43-.53-2.73-1.68a10.2 10.2 0 0 1-1.89-2.35c-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.85-1.05-2.54-.28-.66-.56-.57-.77-.58h-.66c-.23 0-.6.09-.91.43-.31.34-1.19 1.16-1.19 2.83 0 1.67 1.22 3.29 1.39 3.52.17.23 2.4 3.66 5.81 5.13.81.35 1.45.56 1.94.72.82.26 1.56.22 2.15.13.66-.1 2.01-.82 2.29-1.61.28-.8.28-1.48.2-1.62-.09-.14-.31-.23-.65-.4Z"
      />
    </svg>
  );
}

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? SITE_WHATSAPP_E164_DIGITS;
  const num = sanitizeWhatsAppNumber(raw);
  const href = `https://wa.me/${num}?text=${encodeURIComponent("Hello Mietaaf, I would like styling assistance.")}`;

  if (pathname === "/cart" || pathname === "/checkout") return null;

  return (
    <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] right-[max(0.75rem,env(safe-area-inset-right,0px))] z-50 max-w-dvw touch-manipulation animate-in fade-in zoom-in duration-300 sm:bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] sm:right-[max(1.25rem,env(safe-area-inset-right,0px))] md:bottom-[max(2rem,env(safe-area-inset-bottom,0px))] md:right-[max(2rem,env(safe-area-inset-right,0px))]">
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-12 w-12 items-center justify-center rounded-full border border-black/25 bg-[#25D366] text-white shadow-2xl shadow-black/35 ring-2 ring-white/40 transition-transform hover:scale-105 sm:h-14 sm:w-14 md:h-16 md:w-16"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="h-8 w-8 text-white transition-transform group-hover:rotate-6 sm:h-9 sm:w-9 md:h-10 md:w-10" />
      </Link>
    </div>
  );
}
