import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { QuickViewDialog } from "@/components/product/quick-view-dialog";
import { LuxuryLoader } from "@/components/luxury/luxury-loader";

export function MainShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LuxuryLoader />
      <div className="mietaaf-noise flex min-h-dvh flex-col">
        <SiteHeader />
        <SearchOverlay />
        <QuickViewDialog />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <FloatingWhatsApp />
      </div>
    </>
  );
}
