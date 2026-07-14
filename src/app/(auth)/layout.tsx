import { RequireAuth } from "@/components/auth/require-auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mietaaf-noise min-h-dvh w-full min-w-0 overflow-x-hidden">
      <RequireAuth>
        <main className="min-h-dvh w-full">{children}</main>
      </RequireAuth>
    </div>
  );
}
