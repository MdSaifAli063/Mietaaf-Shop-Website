import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mietaaf-noise min-h-dvh w-full min-w-0 overflow-x-hidden">
      <RequireAuth>
        <main className="min-h-dvh w-full">{children}</main>
      </RequireAuth>
    </div>
  );
}
