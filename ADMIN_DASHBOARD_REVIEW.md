# Admin dashboard refinement

17 October 2026 — local project changes, ready for deployment.

## Workspace

The private administration area now uses the desktop viewport with a 224px sidebar, a compact top bar and an independently scrolling content area. Navigation stays available while working through long lists. Phones and tablets use a keyboard-accessible navigation drawer with focus restoration. The existing admin sign-in design is retained.

Cream remains the background, with off-white panels, silver accents and restrained bronze details. Admin styles are scoped to the workspace and its editor dialogs.

## Screens

| Screen | Changes |
| --- | --- |
| Overview | Compact linked counters, the five most recent orders, actual low-stock products and settings shortcuts. Unavailable order data has a separate state rather than displaying a false zero. |
| Products | Compact tabular rows on desktop, mobile rows with grouped actions, search, visibility filters, ten-item pagination and a clear empty state. |
| Categories | Searchable collection rows with thumbnails, descriptions, visibility and consistent editing actions. |
| Banners | Compact slide previews with visibility, copy, destinations and editing actions. |
| Orders | Customer/order search, status filters, eight-item pagination and expandable details. Existing confirmation, fulfilment, cancellation, deletion and email actions remain available in the expanded panel. |
| Settings | Grouped brand, announcement and contact panels; unsaved-change state; save and reset controls; and a visible action bar. |

Product, category and banner editors share a scrollable form with persistent headers and save/cancel controls. Fields have associated labels, including the image URL and upload sections.

## Verification

- ESLint, TypeScript and the production build passed; 140 static pages generated.
- 51 browser layout/dialog checks passed: six screens at seven viewport sizes from 320px to 1920px, and three editors at phone, short landscape and desktop sizes. No page-wide overflow, clipped action controls or browser errors were recorded.
- Isolated interaction checks passed for search, filters, pagination, edit prefill, cancel, required-value validation, product/category/banner save payloads, settings reset/save, expandable order details, mobile navigation, keyboard focus and access states.
- The populated preview compiled the actual admin components with sample data and mocked authentication/services in the ignored `tmp/responsive-review/admin-preview/` directory. It is separate from the application and is not included in production bundles.
- During the dashboard redesign, a source comparison verified all 22 original save, upload, visibility, deletion and order-email handlers were preserved. The subsequent server-side email change below intentionally replaces the confirmation and resend handlers.
- A real production-server smoke check verified private-page `noindex`, the sidebar monogram image and the guest redirect to `/admin/login?returnUrl=%2Fadmin%2Fproducts`. Private workspace content was not rendered for the guest. No production browser errors were recorded.
- Light and dark screens were reviewed. Screenshots, measurements and local preview scripts are in `tmp/responsive-review/`.

## Limits

No live Firebase writes, uploads, order changes, sign-ins or external emails were submitted. Populated screen and save-payload tests used isolated sample data; authenticated cloud integration was not exercised with owner credentials. Browser testing used local Chrome emulation rather than physical devices or Safari/Firefox.

## Server-side email update

The Orders configuration warning has been removed. Confirm order and Resend
email now call an authenticated server route with only the saved order ID and
action. The server verifies the Firebase ID token and admin claim, reads the
saved customer/items/total, and uses Firestore REST with the caller's ID token so
the existing database rules still apply. No service-account private key or admin
bypass was added. Shipping, cancellation and deletion retain their existing
Firebase operations.

An atomic document-version precondition prevents concurrent requests from
confirming/sending the same operation twice. Repeated Confirm requests do not
send again. Explicit Resend supports retrying delivery; a short sending lease
blocks simultaneous retries. Email failure, missing customer email or an
unavailable profile lookup does not roll back order confirmation. Email state
is persisted as Sending, Sent or Failed.

Contact and Appointment delivery also moved behind server routes. Their inputs
are validated and size limited; destinations, templates and provider credentials
are selected only on the server. Routes check the origin, apply per-instance
request limits and return generic errors without provider details. The public
form request limit is an in-process safeguard, not a distributed quota.

Local EmailJS environment names were migrated to server-only names without
printing their values. Deployment instructions are in
[VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md#server-side-email-configuration).
The current local configuration is missing the order-confirmation template ID;
production email delivery requires that template plus non-browser API access
enabled in the owner's EmailJS account. The optional private key is supported
and recommended. Hosting/account configuration was not changed.

Verification includes 21 regression tests covering authorization, payload
validation, proxy origins, delivery failures, retries and concurrent
confirmations. External HTTP is mocked in those tests; the real Firebase SDK
also rejects a malformed token. Local Chrome checks exercise Contact and
Appointment failure/success, retained/reset fields, server-only request payloads,
and the Orders confirmation/resend controls at desktop and phone widths. No
live email or order writes are used by these checks.

EmailJS 403 responses now produce a fixed backend-only diagnostic code and
account setup hint. Non-browser access, private-key and origin rejection cases
are covered without logging provider response bodies or credentials. The browser
continues to receive a generic delivery error. Enabling non-browser access and
any required private-key authorization remains an owner action in EmailJS.

Final checks passed: ESLint, TypeScript, the 141-page production build, six real
local HTTP rejection checks, and scans of 110 generated browser JavaScript files
plus prerendered HTML. No EmailJS configuration names, provider endpoint or
configured email credential values were found in those browser outputs.

## Products separated by category

Each Categories row now shows its item/visible counts and a **Manage items**
link. `/admin/categories/[slug]` opens only products with that saved category
slug. This supports the eleven existing categories and admin-created categories.
The Products screen groups its rows by category and includes a category picker
for switching between the full catalogue and one category. Search, visibility
filters and pagination operate within the selected category.

Adding a product from a category view preselects that category. Changing the
Collection field in the product editor moves the saved item to that category;
the saved category label comes from the category record. Editing preserves
existing hidden/deleted state. Categories that have no items show an Add product
empty state. Products assigned to removed categories and unassigned products
remain accessible for reassignment. Deleted categories cannot receive new items.

Product writes now omit undefined optional fields on creation and explicitly
delete optional original-price/discount fields when cleared during editing.
This avoids Firestore rejecting otherwise valid product/category saves.

Verification: five grouping/save-payload regression tests; all eleven category
lists checked against their exact assigned products; isolated add, move, hidden
edit, empty/custom/removed/unassigned category, search, reset, picker and pagination
checks; and fifteen layout checks at 320, 390, 768, 1024 and 1440 pixels. The
browser preview uses mocked services and sample data, and reported no browser
errors, page overflow or clipped controls. No live Firebase products or categories
were changed. Artifacts are under `tmp/responsive-review/admin-category-items-*`.

ESLint, TypeScript and the production build passed (142 static pages plus the
dynamic category route). Real local production checks confirmed the new routes
render, retain noindex metadata, and redirect guests to admin login with the
nested category return URL while withholding the private workspace content.

## Separate Wedding, Premium and Lookbook sections

The sidebar now includes Wedding (`/admin/wedding`), Premium (`/admin/premium`)
and Lookbook (`/admin/lookbook`). Wedding and Premium reuse the category product
manager with their exact saved collection slugs, including search, visibility,
pagination, add, edit, restore and removal. New products default to the correct
collection. Category links and the category picker lead to these dedicated
screens; the former special-category admin URLs redirect to them. Editor state
resets when switching between collection screens.

Lookbook is a separate curation workspace. Administrators choose existing visible
catalogue products, filter the picker by category/name, arrange order, remove
looks, reset unsaved edits and save the gallery. Selection is limited to 48 unique
products, with search and eight-row pagination in the manager. Save failures keep
the draft available for retry. A failed settings read disables editing rather
than overwriting an unknown published gallery.

The saved selection lives in `settings/lookbook`, under the existing public-read,
admin-claim-write rules. The public `/lookbook` listens to that document and
renders the same order. Hidden, deleted and unavailable products are excluded.
Without a saved selection, the original first-eight-visible-products behaviour
remains. An explicitly empty published selection stays empty and shows a customer
empty state. No additional Firebase collection or Storage rules are required.

Verification includes nine Lookbook unit/integration tests (selection, ordering,
visibility, empty state, validation, save destination, live snapshot errors and
subscription cleanup), plus the five category/save tests. Isolated browser checks
cover both collection lists/defaults, sidebar selection, Lookbook ordering/reset,
failed-save retry, picker filtering/cancel, adding products, public order, hidden
product exclusion, explicit empty publication and pagination. Nineteen layout
checks span 320–1440px, including the picker and public gallery. The sidebar also
remains scrollable on short desktop windows. No browser errors were recorded.

Browser saves used mocked services and sample catalogue data. No live gallery,
product, category or Firebase account was changed. Artifacts are under
`tmp/responsive-review/admin-collections-lookbook-*`, `admin-new-*`, and
`lookbook-curated-*`.

Final validation passed: ESLint, TypeScript, 14 Lookbook/category regression
tests and the production build (145 static pages). Real local production checks
verified all three new admin routes retain noindex metadata and redirect guests
to admin login with the correct return URLs. Legacy special-category paths carry
the expected Next.js redirect instructions. The public Lookbook rendered without
browser errors. These production checks were read-only.
