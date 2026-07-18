"use client";

import { Star } from "lucide-react";

export function StarRating({
  value,
  count,
  size = 14,
}: {
  value: number;
  count?: number;
  size?: number;
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex min-w-0 items-center gap-1 text-primary sm:gap-1.5">
      <div className="flex shrink-0 scale-[0.82] origin-left sm:scale-100">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              width={size}
              height={size}
              className={filled ? "fill-primary text-primary" : "text-muted-foreground/40"}
            />
          );
        })}
      </div>
      {count != null ? (
        <span className="-ml-2 text-[10px] text-muted-foreground sm:ml-0 sm:text-xs">({count})</span>
      ) : null}
    </div>
  );
}
