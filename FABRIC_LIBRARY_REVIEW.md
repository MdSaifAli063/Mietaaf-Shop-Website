# Fabric library

The existing `/fabrics` page now presents all 13 supplied images: 12 catalogue
sheets and one editorial header image. The catalogues contain 67 design or colour
references across Tailoring (2 catalogues), Jacquard (8), Shirting (1) and
Terri-Wool (1). References are local to each catalogue; they are not inventory SKUs.

## Customer experience

- Responsive collection cards with family filters and colour/design-reference search.
- A same-page catalogue viewer with individual design selection and 100–300% zoom.
- Original PNG sheets can be opened or downloaded without modifying the originals.
- WhatsApp enquiries include the collection, selected design, printed reference
  when present, and a link back to that selection.
- Cream remains the foundation, with off-white cards, silver viewing surfaces and
  the existing dark primary buttons.
- Accurate page metadata, collection schema, sitemap images and expanded public
  fabric references accompany the library. The selected logo social image is retained.

No fabric prices, composition, stock levels or purchase guarantees were inferred
from the supplied artwork. The team confirms those details during an enquiry.

## Updating catalogues

Use **Admin → Fabrics** (`/admin/fabrics`) for routine updates. Every catalogue has
its own design-management page. Administrators can add/edit catalogues and design
references, upload cover/sheet/design images, change their order, hide/restore
entries, or remove entries. Catalogue slugs and design IDs stay fixed after creation
to preserve shared links. Hiding a design removes its selectable preview; the
original uploaded sheet still contains whatever was printed on it.

The complete saved library lives in `settings/fabrics`, under the existing
public-read/admin-claim-write rules. Uploads use `products/fabrics`, covered by the
existing recursive products Storage rules. No additional Firebase rules or keys
are required. Removing an entry retains its stored image files. Supported uploads
are PNG, JPG, WebP and AVIF, up to 5 MB each. Image dimensions are read automatically.

The storefront listens to published updates. Server-rendered catalogue content,
schema, sitemap images and expanded LLM references read the same saved library
with 60-second revalidation. The supplied local catalogues remain the initial
fallback before a library is saved; an explicitly empty saved library stays empty.

The manifest workflow below is for maintaining those original fallback assets;
admin uploads do not require regenerating them.

Original images remain in `public/fabrics`. The typed catalogue manifest is
`src/lib/data/fabrics.ts`; it records each source image, design reference and crop.
After updating that manifest or a source image, run `npm run assets:fabrics` to
rebuild the 92 WebP assets in `public/fabrics/optimized`. Generated previews are
used for browsing, while the original images remain available for download.

Run `npm run test:fabrics` to verify coverage of all supplied sheets, crop bounds,
generated files, family separation, search, deep links and WhatsApp messages.

## Verification

Seven automated checks passed. ESLint, TypeScript and the production build passed
(145 generated pages). Local Chrome checks at 320, 390, 768, 1024 and 1440 pixels
found no page overflow, clipped controls or header overlap. The catalogue dialog
fits each viewport, zoom scrolls internally, and Escape returns focus to the
opening button. All 12 catalogues, family filters, search/reset, original file
links, design selection and valid/invalid reference links were exercised without
browser console errors. Supplied images and generated crops were visually reviewed.

The built production site also passed at 280px, 390px, 1440px and 844×390
landscape. Its initial HTML contains all 12 catalogue cards and collection schema;
the sitemap exposes 13 fabric images, and the expanded reference lists every
catalogue. Direct loading of a selected design, the existing logo social image
and all 12 cover-image responses were verified.

Browser measurements and screenshots are stored locally in
`tmp/responsive-review/fabrics-*`. No WhatsApp message or live order was submitted.

## Administration verification

Nine additional unit/integration checks cover settings validation, fallback and
empty publication, visibility, ordering, precise references, save destination,
upload namespace, live snapshot errors/cleanup and the existing access rules.
Browser tests use isolated sample data and mocked saves/uploads; they do not
modify production Firebase. They cover catalogue/design creation, editing,
duplicate IDs, failed-save recovery, hide/restore, removal, ordering, upload
dimensions, storefront publication and WhatsApp references. Twenty list/editor
layout checks span 320, 390, 768, 1024 and 1440 pixels, plus mobile navigation.
No page overflow, clipped controls or browser errors were recorded.

Run `npm run test:fabric-admin` for the administration regression checks. Browser
artifacts are under `tmp/responsive-review/admin-fabrics-*`.

Final validation passed: ESLint, TypeScript, 25 fabric/lookbook regression tests,
and the production build (146 generated pages). Both fabric editors return focus
to their opening controls after Escape. Read-only production checks confirm that
both new admin routes retain noindex metadata and send guests to admin login with
the correct return URL. The public viewer, 12 rendered catalogues, matching
collection schema, 13 sitemap images and published catalogue references passed
without browser errors. Live Firebase writes and uploads were not exercised.
