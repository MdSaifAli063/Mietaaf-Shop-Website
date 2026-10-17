import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";
import { AdminShell } from "@/components/admin/admin-shell";
import "@/components/admin/admin.css";

export const metadata: Metadata = {
  title: "Administration",
  ...noIndexMetadata,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
