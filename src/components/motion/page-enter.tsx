"use client";

/**
 * Lightweight page chrome — avoids Framer Motion on every navigation for snappier route changes.
 */
export function PageEnter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-300 ${className}`.trim()}>{children}</div>;
}
