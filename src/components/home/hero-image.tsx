import Image from "next/image";
import { bypassImageOptimization } from "@/lib/image-source";

export function HeroImage({ src, alt, first }: { src: string; alt: string; first: boolean }) {
  const name = /^\/hero\/(wedding-edit|premium-suits|festive-gold)\.webp$/.exec(src)?.[1];
  const className = `absolute inset-0 h-full w-full object-cover object-[68%_18%] sm:object-[center_18%] ${first ? "" : "animate-in fade-in duration-500"}`;
  if (!name) return <Image src={src} alt={alt} fill priority={first} fetchPriority={first ? "high" : "auto"} quality={65} unoptimized={bypassImageOptimization(src)} sizes="100vw" className={className} />;
  const path = `/hero/optimized/${name}`;
  return <picture>
    <source media="(max-width: 639px)" type="image/avif" srcSet={`${path}-mobile-480.avif 480w, ${path}-mobile-768.avif 768w`} sizes="100vw" />
    <source media="(max-width: 639px)" type="image/webp" srcSet={`${path}-mobile-480.webp 480w, ${path}-mobile-768.webp 768w`} sizes="100vw" />
    <source media="(min-width: 640px)" type="image/avif" srcSet={`${path}-960.avif 960w, ${path}-1440.avif 1440w`} sizes="100vw" />
    {/* These responsive files are pre-compressed at build time; no runtime image transform. */}
    <img src={`${path}-1440.webp`} srcSet={`${path}-960.webp 960w, ${path}-1440.webp 1440w`} sizes="100vw" width={1547} height={941} alt={alt} fetchPriority={first ? "high" : "auto"} loading={first ? "eager" : "lazy"} decoding="async" className={className} />
  </picture>;
}
