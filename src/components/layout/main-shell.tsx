import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { MainShellOverlays } from "@/components/layout/main-shell-overlays";
import { LuxuryLoader } from "@/components/luxury/luxury-loader";
import { RequireAuth } from "@/components/auth/require-auth";

export function MainShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LuxuryLoader />
      <div className="mietaaf-noise flex min-h-dvh w-full min-w-0 flex-col overflow-x-clip">
        <RequireAuth>
          <SiteHeader />
          <MainShellOverlays />
          <main className="flex-1 min-w-0 w-full">{children}</main>
          <SiteFooter />
          <FloatingWhatsApp />
        </RequireAuth>
      </div>
    </>
  );
}
