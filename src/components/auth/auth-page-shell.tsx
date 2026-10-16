import { cn } from "@/lib/utils";
import Image from "next/image";
import { Check, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { AuthUtilityBar } from "@/components/auth/auth-utility-bar";

type AuthPageShellProps = {
  className?: string;
  children: React.ReactNode;
  showPromoPanel?: boolean;
  offWhite?: boolean;
};

const benefits = [
  { icon: Sparkles, label: "Curated collections" },
  { icon: PackageCheck, label: "Easy order tracking" },
  { icon: Check, label: "Saved wishlist and cart" },
  { icon: ShieldCheck, label: "Secure account access" },
];

export function AuthPageShell({
  className,
  children,
  showPromoPanel = true,
  offWhite = false,
}: AuthPageShellProps) {
  return (
    <div
      className={cn(
        "relative isolate min-h-dvh w-full overflow-x-clip",
        offWhite
          ? "bg-surface-paper dark:bg-[#181613]"
          : "bg-linear-to-b from-mietaaf-cream/75 via-background to-background dark:from-mietaaf-cream/10",
        className,
      )}
    >
      <AuthUtilityBar />
      <div
        className={cn(
          "relative mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full items-center px-4 pb-6 pt-2 sm:px-6 sm:pb-8 sm:pt-4 lg:px-8",
          showPromoPanel ? "max-w-xl lg:max-w-6xl" : "max-w-xl",
        )}
      >
        <div className={cn(
          "grid w-full min-w-0",
          showPromoPanel && "overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_16px_60px_rgba(48,42,36,0.06)] lg:grid-cols-[0.95fr_1.05fr]",
        )}>
        {showPromoPanel ? (
          <aside className="relative isolate hidden min-h-[35rem] flex-col justify-end overflow-hidden bg-mietaaf-charcoal p-8 text-mietaaf-cream lg:flex xl:p-10">
            <Image
              src="/about/about-atelier-fitting.webp"
              alt="A Mietaaf sherwani being carefully fitted in the atelier"
              fill
              priority
              sizes="(min-width: 1152px) 520px, 45vw"
              className="-z-20 object-cover object-[center_25%]"
            />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-[#211b15]/95 via-[#211b15]/65 to-[#211b15]/15" />
            <div className="mt-40">
              <p className="mb-5 w-fit rounded-full border border-mietaaf-cream/30 bg-mietaaf-charcoal/45 px-4 py-2 text-[9px] font-medium uppercase tracking-[0.22em] backdrop-blur-md">
                Mietaaf couture
              </p>
              <h2 className="max-w-sm font-heading text-[2.75rem] leading-[1.02] tracking-[-0.02em] xl:text-5xl">
                Thoughtful style, made personal.
              </h2>
              <p className="mt-4 max-w-[32ch] text-sm leading-6 text-mietaaf-cream/85">
                Your favourite pieces, saved details, and orders. All in one considered space.
              </p>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-mietaaf-cream/25 pt-5">
              {benefits.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 text-[11px] leading-4 text-mietaaf-cream/90"
                >
                  <Icon className="size-4 shrink-0 text-[#dfcdb3]" strokeWidth={1.5} aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            </div>
          </aside>
        ) : null}
        <div className="flex min-w-0 items-center">
          <div className="mx-auto w-full max-w-[34rem]">
            {children}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
