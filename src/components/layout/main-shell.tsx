import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { MainShellOverlays } from "@/components/layout/main-shell-overlays";
import { RequireAuth } from "@/components/auth/require-auth";

export function MainShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="storefront flex min-h-dvh w-full min-w-0 flex-col overflow-x-clip bg-background">
        <RequireAuth>
          <SiteHeader />
          <MainShellOverlays />
          <main className="flex-1 min-w-0 w-full pb-[env(safe-area-inset-bottom,0px)]">
            {children}
          </main>
          <SiteFooter />
          <FloatingWhatsApp />
        </RequireAuth>
      </div>
    </>
  );
}
