import { cn } from "@/lib/utils";
import { Check, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { AuthUtilityBar } from "@/components/auth/auth-utility-bar";

type AuthPageShellProps = {
  className?: string;
  children: React.ReactNode;
  showPromoPanel?: boolean;
  offWhite?: boolean;
};

/**
 * Soft backdrop + narrow column. Parent layout handles viewport height and vertical centering.
 */
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
        "relative isolate min-h-dvh w-full overflow-hidden",
        offWhite
          ? "bg-[#fbf8f2] dark:bg-[#181613]"
          : "bg-linear-to-b from-mietaaf-cream/75 via-background to-background dark:from-mietaaf-cream/10",
        className,
      )}
    >
      <div className="pointer-events-none absolute -left-28 top-10 -z-10 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 size-96 rounded-full bg-mietaaf-gold/10 blur-3xl" />
      <AuthUtilityBar />
      <div
        className={cn(
          "relative mx-auto grid min-h-[calc(100dvh-3.5rem)] w-full max-w-md items-center gap-6 px-4 py-3 sm:max-w-xl sm:px-6 sm:py-4 lg:max-w-6xl lg:px-8 lg:py-5",
          showPromoPanel && "lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 xl:gap-10",
        )}
      >
        {showPromoPanel ? (
          <aside className="relative hidden h-[min(38rem,calc(100dvh-6rem))] min-h-[31rem] overflow-hidden rounded-[2rem] border border-white/15 bg-[#292724] p-9 text-[#f7f1e8] shadow-[0_32px_90px_rgba(38,32,26,0.2)] lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full border border-white/10" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#cbb89f]">
                The Mietaaf experience
              </p>
              <h2 className="mt-5 max-w-lg font-heading text-5xl leading-[0.98] tracking-[0.01em] xl:text-[3.5rem]">
                Thoughtful style, made personal.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-[#d8d0c5] xl:text-base">
                Create your account to keep every favorite, order, and detail together in one elegant place.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {benefits.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex min-h-17 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 text-sm text-[#eee7dc] backdrop-blur-sm"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#cbb89f]/15 text-[#d8c5aa]">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </aside>
        ) : null}
        <div className="min-w-0">
          <div className="mx-auto w-full max-w-[34rem]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
