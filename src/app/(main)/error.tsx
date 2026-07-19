"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page-container flex min-h-[60dvh] items-center justify-center py-12 sm:py-16">
      <section className="w-full max-w-2xl rounded-3xl border border-border/80 bg-card/90 px-6 py-12 text-center shadow-xl shadow-black/5 sm:px-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
          Mietaaf atelier
        </p>
        <h1 className="mt-4 font-heading text-4xl leading-tight sm:text-5xl">
          We could not finish loading this page
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
          Please try again. If the issue continues, return home and continue browsing the
          collection.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset} className="min-h-11 rounded-full px-8">
            Try again
          </Button>
          <Button asChild variant="outline" className="min-h-11 rounded-full px-8">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
