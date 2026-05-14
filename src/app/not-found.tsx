import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.45em] text-primary">404</p>
      <h1 className="mt-4 font-heading text-4xl md:text-5xl">This chapter is missing</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you requested is not in our current collection. Return to the atelier home or
        explore the shop.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full px-8">
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full px-8">
          <Link href="/shop">Shop</Link>
        </Button>
      </div>
    </div>
  );
}
