import { LoaderCircle } from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { GoogleBrandIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SITE_LOGO_URL } from "@/lib/site-logo";

export const authFieldClass = "auth-field h-12 min-h-12 rounded-lg border-input/80 bg-surface-silver pl-11 pr-4 text-base shadow-none focus-visible:border-primary focus-visible:ring-primary/15 md:text-base dark:bg-input/20";
export const authLabelClass = "text-xs font-medium leading-5 text-foreground";
export const authToggleClass = "absolute right-0.5 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function AuthFormPanel({ children }: { children: React.ReactNode }) {
  return (
    <Card className="w-full min-w-0 gap-4 rounded-none border-0 bg-transparent px-5 py-6 shadow-none sm:px-8 sm:py-7 lg:px-9 xl:px-10">
      {children}
    </Card>
  );
}

export function AuthFormHeading({ eyebrow, title, description }: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center text-center *:max-w-full">
      <Logo href="/" src={SITE_LOGO_URL} variant="auth" priority className="mx-auto" />
      <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
      <h1 className="mt-2 font-heading text-[2.25rem] leading-[1.06] tracking-[-0.02em] text-foreground sm:text-[2.5rem]">{title}</h1>
      <p className="mt-2 max-w-[35ch] text-[13px] leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
      <span className="h-px flex-1 bg-border/80" />
      <span>or continue with</span>
      <span className="h-px flex-1 bg-border/80" />
    </div>
  );
}

export function AuthGoogleButton({ pending, disabled, onClick }: {
  pending: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button type="button" variant="outline" className="h-12 w-full gap-3 rounded-lg border-input/80 bg-card text-foreground hover:bg-surface-silver dark:hover:bg-accent" onClick={onClick} disabled={disabled} aria-busy={pending}>
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <GoogleBrandIcon className="size-4" />}
      {pending ? "Opening Google" : "Continue with Google"}
    </Button>
  );
}
