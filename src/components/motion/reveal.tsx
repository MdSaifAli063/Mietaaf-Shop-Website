"use client";

/**
 * Simple wrapper — scroll-based motion removed for faster paint and smaller JS.
 */
export function Reveal(props: {
  children: React.ReactNode;
  className?: string;
  /** Accepted for API compatibility with existing call sites (no effect). */
  delay?: number;
}) {
  const { children, className } = props;
  return <div className={className}>{children}</div>;
}
