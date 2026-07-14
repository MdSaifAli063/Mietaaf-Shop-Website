"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import toast from "react-hot-toast";
import { Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";
import { loginSchema } from "@/lib/validations/auth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { Card } from "@/components/ui/card";
import { PageEnter } from "@/components/motion/page-enter";
import { sanitizeReturnUrl } from "@/lib/auth-public-paths";
import { GoogleBrandIcon } from "@/components/auth/google-icon";
import { AuthWordmarkLink } from "@/components/auth/auth-wordmark";
import { getAuthErrorMessage } from "@/lib/auth-error-message";

type LoginValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const { signInEmail, signInGoogle, firebaseReady, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = sanitizeReturnUrl(searchParams.get("returnUrl"));
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const signupHref = returnUrl === "/" ? "/signup" : `/signup?returnUrl=${encodeURIComponent(returnUrl)}`;

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (!firebaseReady || loading) return;
    if (user) router.replace(returnUrl);
  }, [firebaseReady, loading, user, router, returnUrl]);

  async function onSubmit(values: LoginValues) {
    if (!firebaseReady) {
      toast.error("Add Firebase keys in .env to enable login.");
      return;
    }
    try {
      await signInEmail(values.email, values.password);
      toast.success("Welcome back");
      router.replace(sanitizeReturnUrl(searchParams.get("returnUrl")));
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "We could not sign you in. Please try again."));
    }
  }

  async function google() {
    if (!firebaseReady) {
      toast.error("Firebase not configured");
      return;
    }
    setGoogleLoading(true);
    try {
      await signInGoogle();
      toast.success("Signed in");
      router.replace(sanitizeReturnUrl(searchParams.get("returnUrl")));
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Google sign-in failed. Please try again."));
    } finally {
      setGoogleLoading(false);
    }
  }

  const emailErrorId = form.formState.errors.email ? "login-email-error" : undefined;
  const passwordErrorId = form.formState.errors.password ? "login-password-error" : undefined;

  return (
    <PageEnter className="min-h-dvh motion-reduce:animate-none">
      <AuthPageShell>
        <Card className="w-full min-w-0 space-y-3.5 rounded-[1.5rem] border-border/70 bg-card/96 px-5 py-5 shadow-[0_18px_45px_rgba(58,48,38,0.08)] ring-1 ring-black/5 backdrop-blur-md sm:px-7 sm:py-6 lg:px-8 dark:bg-card/92 dark:shadow-black/25 dark:ring-white/8">
          <div className="flex flex-col items-center text-center *:max-w-full">
            <AuthWordmarkLink className="max-w-[min(100%,165px)] sm:max-w-[min(100%,185px)]" />
            <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.34em] text-muted-foreground">
              Returning customer
            </p>
            <h1 className="mt-1.5 font-heading text-[1.8rem] leading-none tracking-[0.03em] text-foreground sm:text-[2rem]">
              Sign in
            </h1>
            <p className="mx-auto mt-1.5 max-w-[38ch] text-sm leading-5 text-muted-foreground">
              Sign in to browse collections, save pieces, and place orders.
            </p>
          </div>

          <form className="touch-manipulation space-y-3" noValidate onSubmit={form.handleSubmit(onSubmit)}>
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
                  aria-describedby={emailErrorId}
                  {...form.register("email")}
                  className="h-11.5 min-h-11.5 rounded-2xl border-border/70 bg-background/90 pl-11 pr-4 text-[15px] shadow-sm focus-visible:border-[#8A7864] focus-visible:ring-[#8A7864]/20 dark:bg-input/20"
                />
              </div>
              {form.formState.errors.email ? (
                <p id={emailErrorId} className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={Boolean(form.formState.errors.password)}
                  aria-describedby={passwordErrorId}
                  {...form.register("password")}
                  className="h-11.5 min-h-11.5 rounded-2xl border-border/70 bg-background/90 pl-11 pr-12 text-[15px] shadow-sm focus-visible:border-[#8A7864] focus-visible:ring-[#8A7864]/20 dark:bg-input/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password ? (
                <p id={passwordErrorId} className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="h-11.5 w-full rounded-2xl bg-[#2b2a28] text-[#F5F1EA] shadow-[0_14px_32px_rgba(43,42,40,0.18)] transition-all duration-200 hover:scale-[1.01] hover:bg-[#1e1d1b] disabled:scale-100 disabled:bg-[#2b2a28]/70"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Signing in
                </span>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          <div className="relative py-1">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border/80" />
            <span className="relative mx-auto block w-fit bg-card px-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              or
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11.5 w-full rounded-2xl border-[#dadce0] bg-white text-[#3C4043] shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md"
            onClick={google}
            disabled={googleLoading || form.formState.isSubmitting}
          >
            {googleLoading ? (
              <LoaderCircle className="mr-3 size-4 animate-spin" />
            ) : (
              <span className="mr-3 flex h-5 w-5 items-center justify-center">
                <GoogleBrandIcon className="h-5 w-5" />
              </span>
            )}
            {googleLoading ? "Opening Google" : "Continue with Google"}
          </Button>

          <div className="flex flex-col items-center gap-4 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:gap-6 sm:text-left">
            <Link
              href="/forgot-password"
              className="group relative inline-flex items-center font-medium text-foreground transition-colors hover:text-primary"
            >
              Forgot password?
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
            <p>
              New here?{" "}
              <Link
                href={signupHref}
                className="group relative inline-flex items-center font-medium text-primary transition-colors hover:text-foreground"
              >
                Create account
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            </p>
          </div>
        </Card>
      </AuthPageShell>
    </PageEnter>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[30vh] items-center justify-center px-4 py-8 text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
