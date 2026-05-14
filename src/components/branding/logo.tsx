import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2 text-foreground",
        className,
      )}
    >
      <span className="font-heading text-2xl font-semibold tracking-[0.35em] md:text-3xl">
        MIETAAF
      </span>
      <span className="hidden h-6 w-px bg-gradient-to-b from-transparent via-primary to-transparent sm:block" />
      <span className="hidden text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground sm:block">
        Atelier
      </span>
    </Link>
  );
}
