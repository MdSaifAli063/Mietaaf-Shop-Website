# Mietaaf — Luxury Men’s Fashion (Next.js 15)

Production-ready men’s ethnic and formal e-commerce experience: **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Firebase Auth + Firestore + Storage**, **Framer Motion**, **Shadcn UI (Base UI primitives)**, **Zustand**, **React Hook Form + Zod**, **Swiper**, **React Hot Toast**, **next-themes**.

Orders are completed **without a payment gateway**: checkout builds a structured message and redirects to **`https://wa.me/<YOUR_NUMBER>?text=...`**, optionally persisting an `orders` document in Firestore.

## Authentication gate

When **Firebase env vars are set** (`firebaseReady`), the storefront (header, search, cart, shop, etc.) is only available **after sign-in**. Visiting any other route sends you to `/login?returnUrl=…`; after login you return to that path (same-origin paths only — see `sanitizeReturnUrl` in `src/lib/auth-public-paths.ts`).

If Firebase is **not** configured, the gate is **off** so you can still preview layouts while wiring `.env.local`.

Auth pages (`/login`, `/signup`, `/forgot-password`) use a compact card layout with the gold wordmark inside the form. Logo path: `src/lib/auth-wordmark-src.ts` (default `/branding/mietaaf-auth-wordmark.png`).

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill .env.local (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata / Open Graph |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Business WhatsApp in **digits only** (e.g. `917411025321`) |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Comma-separated emails that may access `/admin` in the UI |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Web SDK config from the Firebase console |
| `NEXT_PUBLIC_SOCIAL_*` | Optional LinkedIn / Instagram / Facebook URLs for the footer |

## Site contact & branding

Customer-facing phone, email, address, and Maps links live in **`src/lib/site-contact.ts`** (footer, Contact page, JSON-LD). Update that file when business details change.

Default WhatsApp number in `.env.example` matches `SITE_WHATSAPP_E164_DIGITS` in `site-contact.ts`.

## Catalog suits (PDF → shop)

Ten suit products from the Mietaaf catalog PDF are seeded in **`src/lib/data/catalog-suits.ts`** and merged into the shop via **`src/lib/data/products.ts`**.

| What | Where |
|------|--------|
| Page images (full PDF spreads) | `public/catalog/catalog-page-01.png` … `catalog-page-10.png` |
| Product copy, slugs, tags | `CATALOG_SUIT_PRODUCTS` in `catalog-suits.ts` |
| **Selling price / MRP** | Edit `price` and `compareAtPrice` on each product in `catalog-suits.ts` |
| Category listing | `/category/suits` — photo left (cropped), catalogue copy right |
| Product detail | `/product/<slug>` — same layout + size picker, cart, WhatsApp |

**Image crop:** Catalog PNGs include embedded text on the right. The UI crops to the **model photo only** (left ~46% of the image) everywhere it matters — category panels, cart, checkout, and thumbnails — via **`ProductThumbnailImage`** / **`CatalogProductPhoto`** in `src/components/product/catalog-product-photo.tsx`. Do not set `style.width` on a Next.js `Image` with `fill`; apply crop width on a positioned wrapper `div` instead.

To add or replace catalog looks, drop new PNGs under `public/catalog/`, add a row in `catalog-suits.ts`, and rebuild.

## WhatsApp checkout

- **Cart → Checkout** collects name, phone, full address, and notes (Zod validated).  
- **Place order** writes to Firestore `orders` (if configured), clears the cart, then redirects to WhatsApp with the full order text (items, sizes, colors, quantities, prices, total).  
- **Product page** includes **Buy via WhatsApp** for a single-line inquiry.

## Admin dashboard

Routes under `/admin` (protected in the UI when Firebase is configured):

- Dashboard (sample analytics + chart)  
- Products (Firestore CRUD by slug; image URLs comma-separated)  
- Categories / Banners (guidance + seed previews)  
- Orders (lists recent `orders` documents)  
- Users (policy notes)

## Deployment (e.g. Vercel)

1. Push the repo and import the project in Vercel.  
2. Set the same `NEXT_PUBLIC_*` environment variables in the Vercel dashboard.  
3. Add your production domain to `NEXT_PUBLIC_SITE_URL`.  
4. In Firebase console → Authentication → **Authorized domains**, add your Vercel domain.

Build locally:

```bash
npm run build
npm start
```

## Project structure (high level)

- `src/app` — App Router: `(main)` shop, `(auth)` login/signup, `admin`, static pages (About, Contact, FAQ), `not-found`  
- `src/components` — UI, layout, home, product (including catalog panels & cropped thumbnails), admin, motion  
- `src/lib` — `site-contact.ts`, `data/catalog-suits.ts`, `data/products.ts`, WhatsApp helpers, validations, SEO  
- `src/store` — Zustand (cart, wishlist, compare, recent, UI)  
- `src/context` — Firebase auth provider  
- `src/firebase` — client SDK bootstrap  
- `src/services` — optional helpers (e.g. Storage upload)  
- `public/catalog/` — catalog suit page images  
- `public/branding/` — auth wordmark and brand assets  
- `firebase/` — Firestore and Storage rules templates  

## Security notes

- Firestore rules in-repo are a **starting point**; tighten `orders` create/read and admin checks before public launch.  
- Prefer **Firebase Admin SDK** or **Custom Claims** for authoritative admin checks in production.  
- Never commit real `.env.local` files.

## Licence

Private / proprietary — Mietaaf.
