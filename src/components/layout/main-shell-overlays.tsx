"use client";

import dynamic from "next/dynamic";

const SearchOverlay = dynamic(
  () =>
    import("@/components/layout/search-overlay").then((m) => ({
      default: m.SearchOverlay,
    })),
  { ssr: false },
);

const QuickViewDialog = dynamic(
  () =>
    import("@/components/product/quick-view-dialog").then((m) => ({
      default: m.QuickViewDialog,
    })),
  { ssr: false },
);

/** Client-only: `next/dynamic` with `ssr: false` cannot run in Server Components. */
export function MainShellOverlays() {
  return (
    <>
      <SearchOverlay />
      <QuickViewDialog />
    </>
  );
}
