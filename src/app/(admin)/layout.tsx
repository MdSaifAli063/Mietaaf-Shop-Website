import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Mietaaf Administration",
  ...noIndexMetadata,
};

export default function StandaloneAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mietaaf-noise min-h-dvh w-full min-w-0 overflow-x-hidden bg-[#f7f1e8] dark:bg-[#151310]">
      {children}
    </div>
  );
}

