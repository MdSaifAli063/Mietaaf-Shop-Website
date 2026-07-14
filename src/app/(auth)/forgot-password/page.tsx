"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import toast from "react-hot-toast";
import { LoaderCircle, Mail } from "lucide-react";
import { forgotSchema } from "@/lib/validations/auth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PageEnter } from "@/components/motion/page-enter";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { AuthWordmarkLink } from "@/components/auth/auth-wordmark";
import { getAuthErrorMessage } from "@/lib/auth-error-message";

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const { resetPassword, firebaseReady, user, loading } = useAuth();
  const router = useRouter();
  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (!firebaseReady || loading) return;
    if (user) router.replace("/");
  }, [firebaseReady, loading, user, router]);

  async function onSubmit(values: ForgotValues) {
    if (!firebaseReady) {
      toast.error("Firebase not configured");
      return;
    }
    try {
      await resetPassword(values.email);
      toast.success("Reset link sent if the email exists.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Could not send the reset email. Please try again."));
    }
  }

  return (
    <PageEnter className="motion-reduce:animate-none">
      <AuthPageShell showPromoPanel={false}>
        <Card className="w-full min-w-0 space-y-6 rounded-[1.75rem] border-border/70 bg-card/95 px-6 pb-7 pt-6 shadow-[0_24px_60px_rgba(58,48,38,0.08)] ring-1 ring-black/5 backdrop-blur-md sm:px-8 sm:pb-8 sm:pt-7 lg:px-9 lg:pb-9 lg:pt-8 dark:bg-card/92 dark:shadow-black/25 dark:ring-white/8">
          <div className="flex flex-col items-center text-center *:max-w-full">
            <AuthWordmarkLink className="max-w-[min(100%,210px)] sm:max-w-[min(100%,230px)]" />
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.38em] text-muted-foreground">
              Account access
            </p>
            <h1 className="mt-3 font-heading text-[2rem] leading-[0.96] tracking-[0.03em] text-foreground sm:text-[2.2rem] lg:text-[2.35rem]">
              Reset password
            </h1>
            <p className="mx-auto mt-3 max-w-[30ch] text-sm leading-6 text-muted-foreground sm:max-w-none">
              Enter your email and we’ll send a secure link to choose a new password.
            </p>
          </div>
          <form className="touch-manipulation space-y-5" noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(form.formState.errors.email)}
                  aria-describedby={form.formState.errors.email ? "forgot-email-error" : undefined}
                  {...form.register("email")}
                  className="h-12 min-h-12 rounded-2xl border-border/70 bg-background/90 pl-11 pr-4 text-[15px] shadow-sm focus-visible:border-[#8A7864] focus-visible:ring-[#8A7864]/20 dark:bg-input/20"
                />
              </div>
              {form.formState.errors.email ? (
                <p id="forgot-email-error" className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-2xl bg-[#2b2a28] text-[#F5F1EA] shadow-[0_14px_32px_rgba(43,42,40,0.18)] transition-all duration-200 hover:scale-[1.01] hover:bg-[#1e1d1b] disabled:scale-100 disabled:bg-[#2b2a28]/70"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Sending link
                </span>
              ) : (
                "Send link"
              )}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="group relative inline-flex items-center font-medium text-primary transition-colors hover:text-foreground"
            >
              Back to login
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          </p>
        </Card>
      </AuthPageShell>
    </PageEnter>
  );
}
