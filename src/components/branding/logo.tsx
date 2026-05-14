import Link from "next/link";
import Image from "next/image";
import { SITE_LOGO_URL } from "@/lib/site-logo";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  href?: string;
  variant?: "header" | "drawer" | "footer";
  priority?: boolean;
  onClick?: () => void;
};

const remote = typeof SITE_LOGO_URL === "string" && /^https?:\/\//i.test(SITE_LOGO_URL);

export function Logo({
  className = "",
  href = "/",
  variant = "header",
  priority = false,
  onClick,
}: LogoProps) {
  const box =
    variant === "footer"
      ? "h-24 w-full max-w-[min(100%,380px)] sm:h-28 sm:max-w-[min(100%,460px)] lg:h-32 lg:max-w-[min(100%,540px)]"
      : variant === "drawer"
        ? "h-28 w-[min(96vw,420px)] sm:h-32 sm:w-[min(96vw,520px)]"
        : "h-[4.125rem] w-[min(92vw,300px)] sm:h-20 sm:w-[min(90vw,360px)] lg:h-[5.375rem] lg:w-[min(44vw,480px)] xl:h-24 xl:w-[min(46vw,560px)] 2xl:w-[min(44vw,620px)]";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        variant === "footer" ? "max-w-full min-w-0" : "shrink-0",
        className,
      )}
    >
      <span className={cn("relative block", box)}>
        <Image
          src={SITE_LOGO_URL}
          alt="Mietaaf"
          fill
          className={cn(
            "object-contain contrast-[1.24] saturate-[1.14] sm:contrast-[1.28] sm:saturate-[1.16] lg:contrast-[1.32] lg:saturate-[1.18]",
            variant === "footer"
              ? "brightness-[1.1] drop-shadow-[0_4px_26px_rgba(0,0,0,0.78)]"
              : "drop-shadow-[0_3px_16px_rgba(15,23,42,0.26)] sm:drop-shadow-[0_5px_24px_rgba(15,23,42,0.3)] lg:drop-shadow-[0_6px_32px_rgba(15,23,42,0.34)] dark:drop-shadow-[0_4px_26px_rgba(0,0,0,0.58)] dark:lg:drop-shadow-[0_6px_36px_rgba(0,0,0,0.66)]",
            variant === "header"
              ? "object-left"
              : variant === "footer"
                ? "object-left"
                : "object-left sm:object-center",
          )}
          sizes="(max-width: 640px) 320px, (max-width: 1024px) 420px, 620px"
          priority={priority}
          unoptimized={remote}
        />
      </span>
    </Link>
  );
}
