import { LuxuryLoader } from "@/components/luxury/luxury-loader";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { MainShellOverlays } from "@/components/layout/main-shell-overlays";
import { RequireAuth } from "@/components/auth/require-auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LuxuryLoader />
      <div className="mietaaf-noise flex min-h-dvh w-full min-w-0 flex-col overflow-x-clip">
        <RequireAuth>
          <SiteHeader />
          <MainShellOverlays />
          <main className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto pb-[env(safe-area-inset-bottom,0px)]">
            <div className="flex min-h-full flex-1 flex-col justify-center py-4 sm:py-5 md:py-8">
              {children}
            </div>
          </main>
          <SiteFooter />
          <FloatingWhatsApp />
        </RequireAuth>
      </div>
    </>
  );
}
