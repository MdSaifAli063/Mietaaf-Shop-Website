import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Search",
  ...noIndexMetadata,
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
