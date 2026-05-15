import { cn } from "@/lib/utils";

type AuthPageShellProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Soft backdrop + narrow column. Parent layout handles viewport height and vertical centering.
 */
export function AuthPageShell({ className, children }: AuthPageShellProps) {
  return (
    <div
      className={cn(
        "w-full bg-linear-to-b from-mietaaf-cream/50 from-0% via-background via-35% to-background dark:from-mietaaf-cream/12",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-md px-4 sm:max-w-104 sm:px-6 lg:max-w-110 lg:px-8">
        {children}
      </div>
    </div>
  );
}
