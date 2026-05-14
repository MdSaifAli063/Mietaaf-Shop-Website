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
      <div className="mx-auto flex w-full min-w-0 max-w-md items-center px-4 py-10 sm:px-5 sm:py-16 md:min-h-[60vh] md:py-20">
        <Card className="w-full min-w-0 space-y-5 border-border/60 p-5 sm:space-y-6 sm:p-8">
          <div className="text-center">
            <h1 className="font-heading text-2xl sm:text-3xl">Reset password</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We will email you a secure link to choose a new password.
            </p>
          </div>
          <form className="touch-manipulation space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
            <Button
              type="submit"
              className="h-11 w-full rounded-full touch-manipulation"
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
      </div>
    </PageEnter>
  );
}
