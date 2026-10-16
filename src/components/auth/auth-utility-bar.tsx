"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthUtilityBar() {
  // This lightweight bar keeps account pages focused and preserves viewport height.
  return (
    <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" className="h-11 gap-2 px-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground">
        <Link href="/">
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Back to store</span>
        </Link>
      </Button>
      <span className="hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:inline-flex">
        <ShieldCheck className="size-3.5" strokeWidth={1.5} aria-hidden="true" /> Your Mietaaf account
      </span>
    </div>
  );
}
