import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Wedding & Formal Menswear Lookbook",
  description:
    "Explore Mietaaf Couture sherwanis, suits, tuxedos and Indo-Western styling. Discover wedding and formal menswear from our Bangalore atelier.",
  path: "/lookbook",
});

export default function LookbookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
