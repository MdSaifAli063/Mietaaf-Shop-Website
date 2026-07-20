import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Compare",
  ...noIndexMetadata,
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
