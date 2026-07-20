import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Checkout",
  ...noIndexMetadata,
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
