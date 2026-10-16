"use client";

import Link from "next/link";
import Image from "next/image";
import { SITE_LOGO_URL } from "@/lib/site-logo";
import { bypassImageOptimization } from "@/lib/image-source";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/settings-store";

type LogoProps = {
  className?: string;
  href?: string;
  variant?: "header" | "auth" | "drawer" | "footer";
  priority?: boolean;
  onClick?: () => void;
  src?: string;
};

export function Logo({
  className = "",
  href = "/",
  variant = "header",
  priority = false,
  onClick,
  src,
}: LogoProps) {
  const settingsLogo = useSettingsStore((s) => s.settings.logoUrl);
  const activeLogo = src || settingsLogo || SITE_LOGO_URL;

  const box =
    variant === "footer"
      ? "h-24 w-full max-w-[min(100%,380px)] sm:h-28 sm:max-w-[min(100%,460px)] lg:h-32 lg:max-w-[min(100%,540px)]"
      : variant === "auth"
        ? "h-16 w-40 sm:h-18 sm:w-44"
      : variant === "drawer"
        ? "h-24 w-full max-w-80 sm:h-28"
        : "h-14 w-[clamp(7rem,28vw,11rem)] max-w-full min-w-0 sm:h-16 sm:w-48 md:w-56 lg:h-18 lg:w-64 xl:w-44 2xl:w-48";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        variant === "footer" || variant === "drawer" ? "w-full max-w-full min-w-0" : "min-w-0 shrink",
        className,
      )}
    >
      <span className={cn("relative block", box)}>
        <Image
          src={activeLogo}
          unoptimized={bypassImageOptimization(activeLogo)}
          alt="Mietaaf Couture"
          fill
          className={cn(
            "object-contain dark:brightness-[1.4]",
            variant === "header"
              ? "object-left"
              : variant === "auth"
                ? "object-center"
              : variant === "footer"
                ? "object-left"
                : "object-left sm:object-center",
          )}
          sizes={variant === "auth" ? "260px" : "(max-width: 480px) 260px, (max-width: 640px) 300px, (max-width: 1024px) 400px, 620px"}
          priority={priority}
        />
      </span>
    </Link>
  );
}
