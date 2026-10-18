import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WebsiteJsonLd } from "@/components/seo/site-json-ld";
import { homePageMetadata } from "@/lib/seo";
import { ShoppingAssurance } from "@/components/shop/shopping-assurance";
import { BrandIntroduction } from "@/components/home/brand-introduction";
import { BrandQuestions } from "@/components/home/brand-questions";
import { HeroCarousel } from "@/components/home/hero-carousel";

// The first hero image is rendered directly in the initial HTML.
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
