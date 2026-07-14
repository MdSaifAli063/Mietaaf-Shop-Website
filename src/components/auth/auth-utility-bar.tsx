"use client";

import Link from "next/link";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function AuthUtilityBar() {
  const { theme, setTheme } = useTheme();

  // This lightweight bar keeps account pages focused and preserves viewport height.
  return (
    <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" className="h-10 gap-2 px-3 text-muted-foreground hover:text-foreground">
        <Link href="/">
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Back to store</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative size-10"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle color theme"
      >
        <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
}
