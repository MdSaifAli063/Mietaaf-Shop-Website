import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WebsiteJsonLd } from "@/components/seo/site-json-ld";
import { homePageMetadata } from "@/lib/seo";
import { ShoppingAssurance } from "@/components/shop/shopping-assurance";
import { BrandIntroduction } from "@/components/home/brand-introduction";
import { BrandQuestions } from "@/components/home/brand-questions";

const HeroCarousel = dynamic(
  () =>
    import("@/components/home/hero-carousel").then((m) => ({
      default: m.HeroCarousel,
    })),
  {
    ssr: true,
    loading: () => (
      <div
          className="storefront-hero-height flex w-full flex-col items-center justify-center bg-surface-silver text-center text-muted-foreground"
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
    loading: () => <div className="min-h-96 bg-surface-cream dark:bg-[#201d19]" aria-busy="true" />,
  },
);

export const metadata: Metadata = homePageMetadata();

export default function HomePage() {
  return (
    <>
      <WebsiteJsonLd />
      <HeroCarousel />
      <ShoppingAssurance />
      <BrandIntroduction />
      <HomeSections />
      <BrandQuestions />
    </>
  );
}
