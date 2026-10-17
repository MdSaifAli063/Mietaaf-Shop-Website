"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Layers3, LoaderCircle, Lock, Mail, PanelsTopLeft, ShieldCheck, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth-context";
import { getFirebaseAuth } from "@/firebase/client";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthErrorMessage } from "@/lib/auth-error-message";
import { sanitizeReturnUrl } from "@/lib/auth-public-paths";
import { authFieldClass, authLabelClass, authToggleClass } from "@/components/auth/auth-form-presentation";

const workspaceFeatures = [
  { icon: Layers3, label: "Catalogue & collections" },
  { icon: ShoppingBag, label: "Orders & customers" },
  { icon: PanelsTopLeft, label: "Storefront & settings" },
];

function AdminLoginLoading() {
  return (
    <div role="status" className="flex min-h-dvh items-center justify-center bg-surface-paper text-primary">
      <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading admin sign-in…</span>
    </div>
  );
}

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
    return <AdminLoginLoading />;
  }

  return (
    <main className="min-h-dvh bg-surface-paper px-4 sm:px-6 lg:px-8">
      <nav aria-label="Admin sign-in navigation" className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4">
        <Button asChild variant="ghost" className="gap-2 px-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground">
          <Link href="/"><ArrowLeft className="size-4" aria-hidden="true" /> Back to store</Link>
        </Button>
        <span className="hidden items-center gap-2 text-[11px] text-muted-foreground sm:inline-flex">
          <Lock className="size-3.5" aria-hidden="true" /> Private workspace
        </span>
      </nav>

      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md items-center pb-8 pt-3 sm:pb-10 lg:max-w-6xl lg:pt-4">
        <div className="grid w-full min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_16px_60px_rgba(48,42,36,0.07)] lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="relative isolate hidden min-h-[35rem] flex-col justify-between overflow-hidden bg-mietaaf-charcoal p-9 text-mietaaf-cream lg:flex xl:p-11">
            <Image src="/about/about-hand-embroidery.webp" alt="" fill sizes="(min-width: 1024px) 520px, 1px" className="-z-20 object-cover object-[58%_center]" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-[#211b15]/95 via-[#211b15]/65 to-[#211b15]/25" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-5 rounded-lg border border-mietaaf-cream/20" />
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-mietaaf-cream/90">Mietaaf Couture</p>
            <div className="mt-32">
              <span className="mb-5 block h-px w-10 bg-[#d4b18a]" aria-hidden="true" />
              <h2 className="max-w-sm font-heading text-5xl leading-[1.02] tracking-[-0.02em] xl:text-[3.5rem]">The Mietaaf<br />workspace.</h2>
              <p className="mt-4 max-w-[32ch] text-sm leading-6 text-mietaaf-cream/80">Your collections, orders and storefront details, all in one considered space.</p>
              <ul className="mt-7 space-y-3 border-t border-mietaaf-cream/25 pt-6">
                {workspaceFeatures.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-xs text-mietaaf-cream/90">
                    <Icon className="size-4 shrink-0 text-[#d4b18a]" strokeWidth={1.5} aria-hidden="true" />{label}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section aria-labelledby="admin-login-heading" className="min-w-0 px-5 py-7 sm:px-8 sm:py-9 lg:px-10 xl:px-12">
            <div className="flex items-center justify-between gap-4">
              <Logo href="/" variant="auth" priority className="-ml-3 rounded-md dark:bg-[#faf6ee] dark:ring-1 dark:ring-[#d9cdbd]" />
              <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-surface-silver text-primary"><ShieldCheck className="size-4" strokeWidth={1.5} /></span>
            </div>
            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Owner access</p>
            <h1 id="admin-login-heading" className="mt-2 font-heading text-[2.25rem] leading-[1.08] tracking-[-0.02em] sm:text-[2.75rem]">Admin sign in</h1>
            <p className="mt-3 max-w-[36ch] text-[13px] leading-6 text-muted-foreground">Welcome back. Sign in to manage your Mietaaf storefront.</p>

            {user && !isAdmin ? (
              <div role="status" className="mt-6 rounded-xl border border-border bg-surface-silver p-4 text-sm">
                <p className="font-medium text-foreground">A customer account is signed in.</p>
                <p className="mt-2 leading-6 text-muted-foreground">Sign out to continue with your Mietaaf admin account.</p>
                <Button variant="outline" className="mt-4 bg-card" onClick={() => void logout()}>Sign out</Button>
              </div>
            ) : (
              <form className="mt-6 space-y-4" aria-busy={submitting} onSubmit={submit}>
                <div className="space-y-1.5">
                  <Label htmlFor="admin-email" className={authLabelClass}>Admin email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="admin-email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="Your admin email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className={authFieldClass}
                      disabled={submitting}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <Label htmlFor="admin-password" className={authLabelClass}>Password</Label>
                    <Link href="/forgot-password" className="inline-flex min-h-6 items-center text-xs text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="admin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className={`${authFieldClass} pr-12`}
                      disabled={submitting}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className={authToggleClass}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      aria-controls="admin-password"
                    >
                      {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="h-12 w-full gap-2 rounded-lg text-[13px]" disabled={submitting}>
                  {submitting ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
                  {submitting ? "Checking access…" : "Sign in to dashboard"}
                  {!submitting ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
                </Button>
              </form>
            )}

            <p className="mt-6 flex items-center gap-2 border-t border-border/70 pt-5 text-[11px] leading-5 text-muted-foreground"><ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />For authorised Mietaaf administrators.</p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<AdminLoginLoading />}>
      <AdminLoginForm />
    </Suspense>
  );
}
