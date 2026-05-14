"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import toast from "react-hot-toast";
import { loginSchema } from "@/lib/validations/auth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PageEnter } from "@/components/motion/page-enter";

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signInEmail, signInGoogle, firebaseReady } = useAuth();
  const router = useRouter();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    if (!firebaseReady) {
      toast.error("Add Firebase keys in .env to enable login.");
      return;
    }
    try {
      await signInEmail(values.email, values.password);
      toast.success("Welcome back");
      router.push("/profile");
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
      router.push("/profile");
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
            <h1 className="mt-2 font-heading text-3xl">Sign in</h1>
          </div>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={form.formState.isSubmitting}
            >
              Continue
            </Button>
          </form>
          <Button type="button" variant="outline" className="w-full rounded-full" onClick={google}>
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
      </div>
    </PageEnter>
  );
}
