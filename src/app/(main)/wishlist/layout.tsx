import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Wishlist",
  ...noIndexMetadata,
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
