"use client";

/**
 * Simple wrapper — scroll-based motion removed for faster paint and smaller JS.
 */
export function Reveal({
  children,
  className,
  delay: _delay,
}: {
  children: React.ReactNode;
  className?: string;
  /** Unused — kept so existing call sites stay unchanged. */
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}
