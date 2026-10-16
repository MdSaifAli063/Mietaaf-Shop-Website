import { MainShell } from "@/components/layout/main-shell";
import { SiteJsonLd } from "@/components/seo/site-json-ld";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <MainShell><SiteJsonLd />{children}</MainShell>;
}
