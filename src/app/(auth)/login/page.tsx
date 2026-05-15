"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import toast from "react-hot-toast";
import { loginSchema } from "@/lib/validations/auth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthWordmarkLink } from "@/components/auth/auth-wordmark";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { Card } from "@/components/ui/card";
import { PageEnter } from "@/components/motion/page-enter";
import { sanitizeReturnUrl } from "@/lib/auth-public-paths";

type LoginValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const { signInEmail, signInGoogle, firebaseReady, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = sanitizeReturnUrl(searchParams.get("returnUrl"));

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
    } catch {
      toast.error("Invalid email or password");
    }
  }

  async function google() {
    if (!firebaseReady) {
      toast.error("Firebase not configured");
      return;
    }
    try {
      await signInGoogle();
      toast.success("Signed in");
      router.replace(sanitizeReturnUrl(searchParams.get("returnUrl")));
    } catch {
      toast.error("Google sign-in failed");
    }
  }

  return (
    <PageEnter>
      <AuthPageShell>
        <Card className="w-full min-w-0 space-y-3 rounded-2xl border-border/55 bg-card px-5 pb-5 pt-2 shadow-md shadow-black/6 ring-1 ring-black/5 sm:space-y-4 sm:px-6 sm:pb-6 sm:pt-2 md:pb-7 md:pt-2.5 md:shadow-lg md:shadow-black/5 md:ring-black/4 dark:bg-card dark:shadow-black/30 dark:ring-white/6">
          <div className="flex flex-col items-center text-center *:max-w-full">
            <div className="flex w-full justify-center">
              <AuthWordmarkLink />
            </div>
            <h1 className="mt-0 font-heading text-2xl leading-tight tracking-tight sm:text-[1.65rem] md:text-[1.75rem]">
              Sign in
            </h1>
            <p className="mx-auto mt-0.5 max-w-[28ch] text-sm leading-snug text-muted-foreground sm:max-w-none">
              Sign in to browse collections, save pieces, and place orders.
            </p>
          </div>
          <form className="touch-manipulation space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...form.register("email")}
                className="h-10 min-h-10 rounded-xl sm:h-11 sm:min-h-11"
              />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...form.register("password")}
                className="h-10 min-h-10 rounded-xl sm:h-11 sm:min-h-11"
              />
              {form.formState.errors.password ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              className="h-10 w-full rounded-full touch-manipulation sm:h-11"
              disabled={form.formState.isSubmitting}
            >
              Continue
            </Button>
          </form>
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full rounded-full touch-manipulation sm:h-11"
            onClick={google}
          >
            Continue with Google
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/forgot-password" className="underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          </p>
          <p className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Create account
            </Link>
          </p>
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
