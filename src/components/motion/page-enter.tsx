"use client";

/**
 * Lightweight page chrome — avoids Framer Motion on every navigation for snappier route changes.
 */
export function PageEnter({ children }: { children: React.ReactNode }) {
  return <div className="min-w-0 animate-in fade-in duration-150">{children}</div>;
}
