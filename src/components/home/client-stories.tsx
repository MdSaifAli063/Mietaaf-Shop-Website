"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TESTIMONIALS } from "@/lib/data/testimonials";

export function ClientStories() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [navigation, setNavigation] = useState({ previous: false, next: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateNavigation = () => {
      const next = {
        previous: track.scrollLeft > 2,
        next: track.scrollLeft < track.scrollWidth - track.clientWidth - 2,
      };
      setNavigation(current => current.previous === next.previous && current.next === next.next ? current : next);
    };
    const observer = new ResizeObserver(updateNavigation);
    // Measure after this below-the-fold section approaches the viewport, rather
    // than forcing a document-wide layout during the first hydration.
    const visibility = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.observe(track);
      track.addEventListener("scroll", updateNavigation, { passive: true });
      updateNavigation();
      visibility.disconnect();
    }, { rootMargin: "200px" });
    visibility.observe(track);

    return () => {
      observer.disconnect();
      visibility.disconnect();
      track.removeEventListener("scroll", updateNavigation);
    };
  }, []);

  const slide = (direction: -1 | 1, edge = false) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.children;
    const step = cards.length > 1
      ? (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft
      : track.clientWidth;
    track.scrollTo({
      left: edge
        ? direction === -1 ? 0 : track.scrollWidth - track.clientWidth
        : track.scrollLeft + step * direction,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <section aria-labelledby="client-stories-heading" className="atelier-section overflow-hidden border-y border-border/60 bg-surface-paper">
      <div className="page-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="atelier-eyebrow">Worn with confidence</p>
          <h2 id="client-stories-heading" className="atelier-heading mt-3">Client stories</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            Personal experiences from clients who chose Mietaaf for their most memorable moments.
          </p>
        </div>

        <ul
          ref={trackRef}
          id="client-stories-track"
          aria-label="Client stories. Use the arrow keys or swipe to explore."
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            slide(event.key === "ArrowLeft" || event.key === "Home" ? -1 : 1, event.key === "Home" || event.key === "End");
          }}
          className="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain rounded-xl pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:mt-10 sm:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          {TESTIMONIALS.map((testimonial) => (
            <li key={testimonial.name} className="group flex min-w-0 shrink-0 basis-[88%] snap-start flex-col rounded-xl border border-border/70 bg-card p-5 shadow-[0_3px_12px_rgba(48,42,36,0.035)] transition-colors hover:border-primary/40 sm:basis-[calc((100%-1.5rem)/2)] sm:p-6 lg:basis-[calc((100%-3rem)/3)] lg:p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Quote className="size-4" aria-hidden="true" />
                </span>
                <div role="img" className="flex gap-0.5 text-primary" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="size-3 fill-current sm:size-3.5" aria-hidden="true" />
                  ))}
                </div>
              </div>
              <blockquote className="mt-5 flex-1 font-heading text-xl leading-7 text-foreground sm:text-[1.35rem] sm:leading-8">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-border/70 pt-5">
                <Avatar className="size-10 ring-2 ring-background sm:size-12">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} loading="lazy" />
                  <AvatarFallback className="bg-surface-silver text-xs font-medium text-primary">
                    {testimonial.name.split(" ").map((part) => part[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {navigation.previous || navigation.next ? (
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">More client stories</p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="icon" className="size-11 bg-card" aria-label="Previous client story" aria-controls="client-stories-track" disabled={!navigation.previous} onClick={() => slide(-1)}>
                <ChevronLeft className="size-4" aria-hidden="true" />
              </Button>
              <Button type="button" variant="outline" size="icon" className="size-11 bg-card" aria-label="Next client story" aria-controls="client-stories-track" disabled={!navigation.next} onClick={() => slide(1)}>
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
