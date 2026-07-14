import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_AUTH_WORDMARK_SRC } from "@/lib/auth-wordmark-src";

export function AuthWordmarkLink({ className }: { className?: string }) {
  const src = SITE_AUTH_WORDMARK_SRC.trim();
  if (!src) return null;

  return (
    <Link
      href="/"
      aria-label="Mietaaf — back to home"
      className={cn(
        "mx-auto block w-full max-w-[min(100%,190px)] rounded-sm leading-none outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:max-w-[min(100%,210px)]",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- user-supplied URL may be any host */}
      <img
        src={src}
        alt="Mietaaf"
        width={800}
        height={220}
        className="block h-auto w-full object-contain"
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}
