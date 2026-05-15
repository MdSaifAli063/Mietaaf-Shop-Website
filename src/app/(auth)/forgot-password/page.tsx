"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import toast from "react-hot-toast";
import { forgotSchema } from "@/lib/validations/auth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PageEnter } from "@/components/motion/page-enter";
import { AuthPageShell } from "@/components/auth/auth-page-shell";

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
    } catch {
      toast.error("Could not send reset email");
    }
  }

  return (
    <PageEnter>
      <AuthPageShell>
        <Card className="w-full min-w-0 space-y-3 rounded-2xl border-border/55 bg-card px-5 pb-5 pt-2 shadow-md shadow-black/6 ring-1 ring-black/5 sm:space-y-4 sm:px-6 sm:pb-6 sm:pt-2 md:pb-7 md:pt-2.5 md:shadow-lg md:shadow-black/5 md:ring-black/4 dark:bg-card dark:shadow-black/30 dark:ring-white/6">
          <div className="text-center">
            <h1 className="font-heading text-2xl tracking-tight sm:text-[1.65rem] md:text-[1.75rem]">
              Reset password
            </h1>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">
              We will email you a secure link to choose a new password.
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
            <Button
              type="submit"
              className="h-10 w-full rounded-full touch-manipulation sm:h-11"
              disabled={form.formState.isSubmitting}
            >
              Send link
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </Card>
      </AuthPageShell>
    </PageEnter>
  );
}
