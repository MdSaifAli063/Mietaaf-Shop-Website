import type { Metadata } from "next";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { HomeSections } from "@/components/home/home-sections";

export const metadata: Metadata = {
  title: "Luxury Men’s Ethnic & Formal",
  description:
    "Sherwani, suits, indo-western, wedding and premium menswear — Mietaaf atelier experience.",
};

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <HomeSections />
    </>
  );
}
