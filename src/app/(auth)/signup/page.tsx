"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import toast from "react-hot-toast";
import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { signupSchema } from "@/lib/validations/auth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import {
  AuthDivider,
  AuthFormHeading,
  AuthFormPanel,
  AuthGoogleButton,
  authFieldClass,
  authLabelClass,
  authToggleClass,
} from "@/components/auth/auth-form-presentation";
import { PageEnter } from "@/components/motion/page-enter";
import { sanitizeReturnUrl } from "@/lib/auth-public-paths";
import { getAuthErrorMessage } from "@/lib/auth-error-message";

type SignupValues = z.infer<typeof signupSchema>;

function SignupForm() {
  const { signUpEmail, signInGoogle, firebaseReady, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnAfterAuth = sanitizeReturnUrl(searchParams.get("returnUrl"));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
  const passwordErrorId = form.formState.errors.password ? "signup-password-error" : "signup-password-hint";
  const confirmErrorId = form.formState.errors.confirm ? "signup-confirm-error" : undefined;

  return (
    <PageEnter className="min-h-dvh motion-reduce:animate-none">
      <AuthPageShell offWhite>
        <AuthFormPanel>
          <AuthFormHeading eyebrow="Make yourself at home" title="Create your account" description="Save your favourites, keep track of orders, and make your next visit effortless." />

          <form
            className="grid touch-manipulation gap-x-3 gap-y-3 sm:grid-cols-2"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-1.5 sm:col-span-2">
              <Label
                htmlFor="displayName"
                className={authLabelClass}
              >
                Full name
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="displayName"
                  autoComplete="name"
                  placeholder="Your full name"
                  aria-invalid={Boolean(form.formState.errors.displayName)}
                  aria-describedby={nameErrorId}
                  {...form.register("displayName")}
                  className={authFieldClass}
                />
              </div>
              {form.formState.errors.displayName ? (
                <p id={nameErrorId} className="text-sm text-destructive">
                  {form.formState.errors.displayName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label
                htmlFor="email"
                className={authLabelClass}
              >
                Email address
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-invalid={Boolean(form.formState.errors.email)}
                  aria-describedby={emailErrorId}
                  {...form.register("email")}
                  className={authFieldClass}
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
                className={authLabelClass}
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="New password"
                  aria-invalid={Boolean(form.formState.errors.password)}
                  aria-describedby={passwordErrorId}
                  {...form.register("password")}
                  className={`${authFieldClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  aria-controls="password"
                  className={authToggleClass}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password ? (
                <p id={passwordErrorId} className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              ) : (
                <p id="signup-password-hint" className="text-[11px] leading-4 text-muted-foreground">At least 6 characters.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirm"
                className={authLabelClass}
              >
                Confirm password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter"
                  aria-invalid={Boolean(form.formState.errors.confirm)}
                  aria-describedby={confirmErrorId}
                  {...form.register("confirm")}
                  className={`${authFieldClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}
                  aria-pressed={showConfirm}
                  aria-controls="confirm"
                  className={authToggleClass}
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {form.formState.errors.confirm ? (
                <p id={confirmErrorId} className="text-sm text-destructive">
                  {form.formState.errors.confirm.message}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-lg shadow-none sm:col-span-2"
              disabled={form.formState.isSubmitting || googleLoading}
              aria-busy={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Creating account
                </span>
              ) : (
                <>Create account <ArrowRight className="size-4" aria-hidden="true" /></>
              )}
            </Button>
          </form>

          <AuthDivider />
          <AuthGoogleButton pending={googleLoading} onClick={google} disabled={googleLoading || form.formState.isSubmitting} />

          <p className="text-center text-xs leading-5 text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={loginHref}
              className="inline-flex min-h-8 items-center font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
            >
              Sign in
            </Link>
          </p>
        </AuthFormPanel>
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
