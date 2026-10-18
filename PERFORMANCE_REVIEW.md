# Performance and connection review — 18 October 2026

The supplied mobile/desktop reports were reviewed against a local production build. Changes are local and require deployment before PageSpeed Insights can measure them on mietaaf.com.

## Local Lighthouse results

Lighthouse 13.5.0, Chrome, default simulated mobile throttling and desktop preset, production server on port 3101. These are individual lab runs, not Google field data or a promised production score. Hardware load, network conditions, and third-party responses affect results. The earlier local baseline differs from the supplied production report.

| Metric | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | ---: | ---: | ---: | ---: |
| Performance | 36 | 64 | 82 | 99 |
| Accessibility | 95 | 100 | 95 | 100 |
| Best practices | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 |
| First contentful paint | 1.8 s | 1.3 s | 0.5 s | 0.4 s |
| Largest contentful paint | 7.2 s | 3.7 s | 1.8 s | 1.0 s |
| Speed index | 20.2 s | 2.7 s | 3.5 s | 0.9 s |
| Total blocking time | 2,770 ms | 1,260 ms | 120 ms | 40 ms |
| Cumulative layout shift | 0.002 | 0.009 | 0.001 | 0 |
| Transferred resources | 1,767 KiB | 973 KiB | 1,872 KiB | 1,000 KiB |
| Requests | 92 | 54 | 99 | 57 |

Homepage first-load application JavaScript fell from approximately 359 KB to 192 KB. Raw local reports are in the ignored `tmp/performance-before-*.json` and `tmp/performance-final-*.json` files.

## Changes

- Render the first hero image in the initial HTML with high fetch priority. Serve precompressed responsive AVIF/WebP files and mobile crops. Preserve original photos, CMS custom image support, and the selected OG artwork.
- Resize the display logo and existing avatar artwork. Correct image sizes and add caching for the generated hero and portrait assets. Regenerate display assets with `npm run assets:storefront` when replacing stock hero originals.
- Remove the first-visit splash that covered rendered content. Fetch search and quick-view code when needed; preserve search after its first opening and return keyboard focus to the search button when it closes.
- Disable automatic route prefetching on the initial storefront links. Keep analytics using lazy loading, retain tracked page views, and initialize anonymous Firebase authentication when interaction or a protected route needs it. Remembered sessions still restore at startup.
- Start automatic carousel/announcement changes after interaction. Pause hero rotation offscreen and retain manual controls, the pause button, and reduced-motion support. Defer testimonial layout measurements until the section approaches the viewport.
- Fix testimonial star ARIA semantics and footer heading levels.
- Replace public Firestore streams with shared, bounded, cached JSON reads for catalogue data and published fabric/lookbook settings. Retain last-good browser data during failures and retry on reconnection/focus. Visible pages poll every 60 seconds; public data can take a few minutes to propagate through caches. Admin editing retains direct real-time subscriptions.
- Deduplicate server REST reads, distinguish missing documents from outages, and restrict the new endpoints to public catalogue fields and the two named settings documents. No user, order, authentication token, or private server settings endpoint was added.
- Use Firestore long polling with a 25-second timeout for networks that buffer streaming connections. Keep admin saves blocked until saved settings are confirmed by the server, including after remounting an editor.

## Validation

- Production build, ESLint, and TypeScript checks pass.
- 38 automated checks cover category assignment, catalogue visibility, fabric/lookbook publishing, shared reads, offline recovery, admin settings confirmation, and Firebase initialization.
- Browser checks at 320, 390, 768, 1024, and 1440 pixels: no horizontal overflow, clipped buttons, or header collisions on the homepage. Fabric, lookbook, cart, and quick-view layouts also pass at 390 pixels.
- Verified search, quick view/add to cart, carousel manual controls/autoplay/pause, fabric zoom, and WhatsApp enquiry links. Guest admin and checkout visits still redirect to login with the return URL.
- Loaded products remain visible offline; reconnection returns a successful catalogue response. All three public endpoints return 200; arbitrary settings document names return 404.
- An isolated read-only probe using the actual Firebase client successfully retrieved `settings/site` from the server (`fromCache: false`). Public landing-page loading opens no Firestore Listen connection or Firebase OAuth iframe. Browser checks recorded no console errors.
- No live orders, accounts, emails, admin publications, or deployment were created during validation. Authenticated admin writes and Google account sign-in require a signed-in verification session.

## Remaining limits and release check

Mobile performance still needs attention: the measured run has 1,260 ms blocking time. Google Analytics accounts for about 838 ms of script evaluation in that run and is the largest remaining script cost. Tracking remains enabled. Next.js compatibility code and essential CSS also remain; removing these just to clear audit suggestions would risk functionality or styling. The supplied Agentic Browsing score is separate from the standard Lighthouse categories and was not remeasured.

No website change can restore a physically unavailable network. The connection changes reduce streaming sensitivity and preserve usable content through temporary outages; they do not suppress SDK errors or claim offline writes succeeded.

Deploy this revision, then rerun PageSpeed Insights on `https://www.mietaaf.com/` for both mobile and desktop. Verify an authenticated admin read/save and Google sign-in on the deployed domain. Search indexing and ranking are unaffected by a local audit score and still depend on Google crawling the deployed site.
