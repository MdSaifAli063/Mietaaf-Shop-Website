"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthUtilityBar() {
  // This lightweight bar keeps account pages focused and preserves viewport height.
  return (
    <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" className="h-10 gap-2 px-3 text-muted-foreground hover:text-foreground">
        <Link href="/">
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Back to store</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </Button>
    </div>
  );
}
