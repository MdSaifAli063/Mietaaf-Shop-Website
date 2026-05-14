import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HomeSections } from "@/components/home/home-sections";
import { homePageMetadata } from "@/lib/seo";

const HeroCarousel = dynamic(
  () =>
    import("@/components/home/hero-carousel").then((m) => ({
      default: m.HeroCarousel,
    })),
  {
    ssr: true,
    loading: () => (
      <div
        className="flex h-[min(100dvh,900px)] w-full flex-col items-center justify-center bg-black text-center text-muted-foreground"
        aria-busy="true"
      >
        <span className="sr-only">Loading hero</span>
        <span className="text-xs uppercase tracking-[0.35em] text-white/60" aria-hidden>
          Mietaaf — luxury men’s ethnic and formal wear
        </span>
      </div>
    ),
  },
);

export const metadata: Metadata = homePageMetadata();

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <HomeSections />
    </>
  );
}
