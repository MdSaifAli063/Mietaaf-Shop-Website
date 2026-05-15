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
        "mx-auto block w-full max-w-[min(100%,220px)] leading-none outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:max-w-[min(100%,252px)] md:max-w-[min(100%,276px)]",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- user-supplied URL may be any host */}
      <img
        src={src}
        alt="Mietaaf"
        width={800}
        height={220}
        className="-mb-10 -mt-1.5 block h-auto w-full object-contain object-top sm:-mb-12 sm:-mt-2 md:-mb-14 md:-mt-2.5"
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}
