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
    <div className="mietaaf-noise min-h-dvh w-full min-w-0 overflow-x-hidden bg-background">
      {children}
    </div>
  );
}

