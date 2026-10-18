"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useUiStore } from "@/store/ui-store";

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
  const searchOpen = useUiStore(state => state.searchOpen);
  const quickViewSlug = useUiStore(state => state.quickViewSlug);
  const [searchLoaded, setSearchLoaded] = useState(false);
  useEffect(() => { if (searchOpen) setSearchLoaded(true); }, [searchOpen]);
  return (
    <>
      {searchOpen || searchLoaded ? <SearchOverlay /> : null}
      {quickViewSlug ? <QuickViewDialog /> : null}
    </>
  );
}
