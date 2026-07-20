import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Lookbook",
  description:
    "Explore the Mietaaf lookbook: sherwanis, suits, tuxedos, waistcoats, and indo-western styling for modern ceremonies.",
  path: "/lookbook",
});

export default function LookbookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
