import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Order Submitted",
  ...noIndexMetadata,
};

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
