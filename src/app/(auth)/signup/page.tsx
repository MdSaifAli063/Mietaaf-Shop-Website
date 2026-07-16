"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import toast from "react-hot-toast";
import { Eye, EyeOff, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { signupSchema } from "@/lib/validations/auth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { Card } from "@/components/ui/card";
import { PageEnter } from "@/components/motion/page-enter";
import { sanitizeReturnUrl } from "@/lib/auth-public-paths";
import { GoogleBrandIcon } from "@/components/auth/google-icon";
import { Logo } from "@/components/branding/logo";
import { getAuthErrorMessage } from "@/lib/auth-error-message";
import { SITE_LOGO_URL } from "@/lib/site-logo";

type SignupValues = z.infer<typeof signupSchema>;

function SignupForm() {
  const { signUpEmail, signInGoogle, firebaseReady, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnAfterAuth = sanitizeReturnUrl(searchParams.get("returnUrl"));
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const loginHref = returnAfterAuth === "/" ? "/login" : `/login?returnUrl=${encodeURIComponent(returnAfterAuth)}`;

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  useEffect(() => {
    if (!firebaseReady || loading) return;
    if (user) router.replace(returnAfterAuth);
  }, [firebaseReady, loading, user, router, returnAfterAuth]);

  async function onSubmit(values: SignupValues) {
    if (!firebaseReady) {
      toast.error("Add Firebase keys in .env to enable signup.");
      return;
    }
    try {
      await signUpEmail(values.email, values.password, values.displayName);
      toast.success("Account created");
      router.replace(sanitizeReturnUrl(searchParams.get("returnUrl")));
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "We could not create your account. Please try again."));
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
      toast.success("Account ready");
      router.replace(sanitizeReturnUrl(searchParams.get("returnUrl")));
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Google sign-in failed. Please try again."));
    } finally {
      setGoogleLoading(false);
    }
  }

  const nameErrorId = form.formState.errors.displayName ? "signup-name-error" : undefined;
  const emailErrorId = form.formState.errors.email ? "signup-email-error" : undefined;
  const passwordErrorId = form.formState.errors.password ? "signup-password-error" : undefined;
  const confirmErrorId = form.formState.errors.confirm ? "signup-confirm-error" : undefined;

  return (
    <PageEnter className="min-h-dvh motion-reduce:animate-none">
      <AuthPageShell offWhite>
        <Card className="w-full min-w-0 space-y-3 rounded-[1.5rem] border-border/70 bg-card/96 px-5 py-5 shadow-[0_18px_45px_rgba(58,48,38,0.08)] ring-1 ring-black/5 backdrop-blur-md sm:px-7 sm:py-6 lg:px-8 dark:bg-card/92 dark:shadow-black/25 dark:ring-white/8">
          <div className="flex flex-col items-center text-center *:max-w-full">
            <Logo
              href="/"
              src={SITE_LOGO_URL}
              variant="auth"
              priority
              className="mx-auto"
            />
            <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.34em] text-muted-foreground">
              Create your profile
            </p>
            <h1 className="mt-1.5 font-heading text-[1.8rem] leading-none tracking-[0.03em] text-foreground sm:text-[2rem]">
              Create account
            </h1>
            <p className="mx-auto mt-1.5 max-w-[38ch] text-sm leading-5 text-muted-foreground">
              Create an account to complete checkout, track orders, and manage delivery details.
            </p>
          </div>

          <form
            className="grid touch-manipulation gap-x-3 gap-y-3 sm:grid-cols-2"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-1.5">
              <Label
                htmlFor="displayName"
                className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground"
              >
                Full name
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="displayName"
                  autoComplete="name"
                  aria-invalid={Boolean(form.formState.errors.displayName)}
                  aria-describedby={nameErrorId}
                  {...form.register("displayName")}
                  className="h-11.5 min-h-11.5 rounded-2xl border-border/70 bg-background/90 pl-11 pr-4 text-[15px] shadow-sm focus-visible:border-[#8A7864] focus-visible:ring-[#8A7864]/20 dark:bg-input/20"
                />
              </div>
              {form.formState.errors.displayName ? (
                <p id={nameErrorId} className="text-sm text-destructive">
                  {form.formState.errors.displayName.message}
                </p>
              ) : null}
            </div>

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
                  autoComplete="new-password"
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

            <div className="space-y-1.5">
              <Label
                htmlFor="confirm"
                className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground"
              >
                Confirm password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={Boolean(form.formState.errors.confirm)}
                  aria-describedby={confirmErrorId}
                  {...form.register("confirm")}
                  className="h-11.5 min-h-11.5 rounded-2xl border-border/70 bg-background/90 pl-11 pr-4 text-[15px] shadow-sm focus-visible:border-[#8A7864] focus-visible:ring-[#8A7864]/20 dark:bg-input/20"
                />
              </div>
              {form.formState.errors.confirm ? (
                <p id={confirmErrorId} className="text-sm text-destructive">
                  {form.formState.errors.confirm.message}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="h-11.5 w-full rounded-2xl bg-[#2b2a28] text-[#F5F1EA] shadow-[0_14px_32px_rgba(43,42,40,0.18)] transition-all duration-200 hover:scale-[1.01] hover:bg-[#1e1d1b] disabled:scale-100 disabled:bg-[#2b2a28]/70 sm:col-span-2"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Creating account
                </span>
              ) : (
                "Create account"
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

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={loginHref}
              className="group relative inline-flex items-center font-medium text-primary transition-colors hover:text-foreground"
            >
              Sign in
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          </p>
        </Card>
      </AuthPageShell>
    </PageEnter>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[30vh] items-center justify-center px-4 py-8 text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
