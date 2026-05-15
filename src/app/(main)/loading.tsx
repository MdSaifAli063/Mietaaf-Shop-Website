/** Instant feedback during client navigations — main segment only */
export default function MainLoading() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 px-4">
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent"
        role="progressbar"
        aria-label="Loading page"
      />
      <p className="sr-only">Loading…</p>
    </div>
  );
}
