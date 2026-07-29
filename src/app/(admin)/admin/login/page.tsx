"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, Lock, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth-context";
import { getFirebaseAuth } from "@/firebase/client";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthErrorMessage } from "@/lib/auth-error-message";
import { sanitizeReturnUrl } from "@/lib/auth-public-paths";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin, loading, firebaseReady, signInEmail, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const requestedReturnUrl = sanitizeReturnUrl(searchParams.get("returnUrl"), "/admin");
  const returnUrl = requestedReturnUrl.startsWith("/admin/login")
    ? "/admin"
    : requestedReturnUrl;

  useEffect(() => {
    if (!loading && user && isAdmin) router.replace(returnUrl);
  }, [isAdmin, loading, returnUrl, router, user]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!firebaseReady) {
      toast.error("Firebase is not configured.");
      return;
    }
    if (!email.trim() || !password) {
      toast.error("Enter the admin email and password.");
      return;
    }

    setSubmitting(true);
    try {
      if (user) await logout();
      await signInEmail(email.trim(), password);
      const token = await getFirebaseAuth()?.currentUser?.getIdTokenResult(true);
      if (token?.claims.admin !== true) {
        await logout();
        toast.error("This account does not have Mietaaf administrator access.");
        return;
      }
      toast.success("Welcome to Mietaaf administration.");
      window.location.assign(returnUrl);
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Admin sign-in failed."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <LoaderCircle className="size-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute -left-28 top-10 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-[#c89c66]/12 blur-3xl" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/60 bg-card/95 shadow-[0_35px_100px_rgba(48,37,27,0.18)] lg:grid-cols-[1fr_0.82fr]">
        <section className="hidden min-h-[620px] flex-col justify-between bg-[#292621] p-10 text-[#fffaf1] lg:flex">
          <div>
            <Logo href="/" variant="footer" priority />
            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.38em] text-[#d4b18a]">
              Private administration
            </p>
            <h1 className="mt-5 max-w-lg font-heading text-5xl leading-[0.98]">
              One secure place to run the Mietaaf storefront.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#fffaf1]/68">
              Manage products, pricing, imagery, collections, homepage content, customer orders, and global website settings.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Catalogue control", "Order management", "Live website updates", "Secure owner access"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/78">
                <ShieldCheck className="mb-3 size-4 text-[#d4b18a]" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-[min(620px,calc(100dvh-2rem))] items-center p-5 sm:p-9 lg:p-10">
          <Card className="w-full border-0 bg-transparent p-0 shadow-none">
            <div className="text-center lg:text-left">
              <Logo href="/" variant="auth" priority className="mx-auto lg:hidden" />
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.34em] text-primary lg:mt-0">
                Authorized owner only
              </p>
              <h2 className="mt-2 font-heading text-3xl">Admin sign in</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Use the Firebase account with the secure admin claim.
              </p>
            </div>

            {user && !isAdmin ? (
              <div className="mt-7 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm">
                <p className="font-semibold">A customer account is currently signed in.</p>
                <p className="mt-1 text-muted-foreground">Sign out, then continue with the Mietaaf admin account.</p>
                <Button variant="outline" className="mt-4 rounded-full" onClick={() => void logout()}>
                  Sign out customer account
                </Button>
              </div>
            ) : (
              <form className="mt-7 space-y-4" onSubmit={submit}>
                <div className="space-y-1.5">
                  <Label htmlFor="admin-email">Admin email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="admin-email"
                      type="email"
                      autoComplete="username"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-12 rounded-2xl bg-background pl-11"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-12 rounded-2xl bg-background pl-11 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="h-12 w-full rounded-2xl bg-[#292621] text-[#fffaf1]" disabled={submitting}>
                  {submitting ? <LoaderCircle className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                  {submitting ? "Checking access…" : "Enter admin dashboard"}
                </Button>
              </form>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
              <Link href="/forgot-password" className="text-muted-foreground hover:text-primary">Forgot password?</Link>
              <Link href="/" className="font-medium text-primary hover:underline">Return to website</Link>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <LoaderCircle className="size-7 animate-spin text-primary" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
