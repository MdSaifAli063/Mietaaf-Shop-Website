"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import toast from "react-hot-toast";
import { signupSchema } from "@/lib/validations/auth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PageEnter } from "@/components/motion/page-enter";
import { sanitizeReturnUrl } from "@/lib/auth-public-paths";

type SignupValues = z.infer<typeof signupSchema>;

function SignupForm() {
  const { signUpEmail, signInGoogle, firebaseReady, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnAfterAuth = sanitizeReturnUrl(searchParams.get("returnUrl"));

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
    } catch {
      toast.error("Could not create account");
    }
  }

  async function google() {
    if (!firebaseReady) {
      toast.error("Firebase not configured");
      return;
    }
    try {
      await signInGoogle();
      router.replace(sanitizeReturnUrl(searchParams.get("returnUrl")));
    } catch {
      toast.error("Google sign-in failed");
    }
  }

  return (
    <PageEnter>
      <div className="mx-auto flex w-full min-w-0 max-w-md items-center px-4 py-10 sm:px-5 sm:py-16 md:min-h-[70vh] md:py-20">
        <Card className="w-full min-w-0 space-y-5 border-border/60 p-5 sm:space-y-6 sm:p-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Mietaaf
            </p>
            <h1 className="mt-2 font-heading text-2xl sm:text-3xl">Create account</h1>
          </div>
          <form
            className="touch-manipulation space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label htmlFor="displayName">Full name</Label>
              <Input
                id="displayName"
                autoComplete="name"
                {...form.register("displayName")}
                className="h-11 min-h-11 rounded-xl"
              />
              {form.formState.errors.displayName ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.displayName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...form.register("email")}
                className="h-11 min-h-11 rounded-xl"
              />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...form.register("password")}
                className="h-11 min-h-11 rounded-xl"
              />
              {form.formState.errors.password ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                {...form.register("confirm")}
                className="h-11 min-h-11 rounded-xl"
              />
              {form.formState.errors.confirm ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.confirm.message}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              className="h-11 w-full rounded-full touch-manipulation"
              disabled={form.formState.isSubmitting}
            >
              Create account
            </Button>
          </form>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-full touch-manipulation"
            onClick={google}
          >
            Continue with Google
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </PageEnter>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center px-4 py-12 text-sm text-muted-foreground sm:min-h-[50vh]">
          Loading…
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
