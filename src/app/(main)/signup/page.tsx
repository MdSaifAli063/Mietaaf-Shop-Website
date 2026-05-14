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
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
        <Card className="w-full space-y-6 border-border/60 p-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Mietaaf
            </p>
            <h1 className="mt-2 font-heading text-3xl">Create account</h1>
          </div>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="displayName">Full name</Label>
              <Input id="displayName" {...form.register("displayName")} className="rounded-xl" />
              {form.formState.errors.displayName ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.displayName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} className="rounded-xl" />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                className="rounded-xl"
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
                {...form.register("confirm")}
                className="rounded-xl"
              />
              {form.formState.errors.confirm ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.confirm.message}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={form.formState.isSubmitting}
            >
              Create account
            </Button>
          </form>
          <Button type="button" variant="outline" className="w-full rounded-full" onClick={google}>
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
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
