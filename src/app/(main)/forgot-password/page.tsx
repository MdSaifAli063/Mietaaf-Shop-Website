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
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
        <Card className="w-full space-y-6 border-border/60 p-8">
          <div className="text-center">
            <h1 className="font-heading text-3xl">Reset password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We will email you a secure link to choose a new password.
            </p>
          </div>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} className="rounded-xl" />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>
            <Button
              type="submit"
              className="w-full rounded-full"
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
