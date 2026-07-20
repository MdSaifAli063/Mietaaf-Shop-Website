import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { SiteJsonLd } from "@/components/seo/site-json-ld";
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
          className="flex h-[min(100dvh,900px)] w-full flex-col items-center justify-center bg-background text-center text-muted-foreground"
        aria-busy="true"
      >
        <span className="sr-only">Loading hero</span>
        <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70" aria-hidden>
          Mietaaf — luxury men’s ethnic and formal wear
        </span>
      </div>
    ),
  },
);

const HomeSections = dynamic(
  () =>
    import("@/components/home/home-sections").then((m) => ({
      default: m.HomeSections,
    })),
  {
    ssr: true,
    loading: () => <div className="min-h-96 bg-[#eee4d6] dark:bg-[#201d19]" aria-busy="true" />,
  },
);

export const metadata: Metadata = homePageMetadata();

export default function HomePage() {
  return (
    <>
      <SiteJsonLd />
      <HeroCarousel />
      <HomeSections />
    </>
  );
}
