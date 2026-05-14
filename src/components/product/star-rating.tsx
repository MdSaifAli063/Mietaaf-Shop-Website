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
    <div className="flex items-center gap-1.5 text-primary">
      <div className="flex">
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
        <span className="text-xs text-muted-foreground">({count})</span>
      ) : null}
    </div>
  );
}
