# Mietaaf storefront

Luxury men's ethnic and formal storefront built with Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Firebase, EmailJS, Zustand, React Hook Form, Zod, and next-themes.

Customers can browse as guests. Sign-in is requested only when checkout needs a Firebase-backed customer session. Orders are saved to Firestore when Firebase is configured and then confirmed through WhatsApp; the site does not collect card payments.

## Local development

Requirements: Node.js 22 and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Before committing a change, run:

```bash
npm run check
npm run build
```

## Configuration

Copy [.env.example](./.env.example) and fill the services you use. All supported variables begin with `NEXT_PUBLIC_` because Firebase Web SDK configuration and EmailJS's browser key are designed to run in the browser. Never add a Firebase service-account private key or any other server secret to a `NEXT_PUBLIC_` variable.

- Site contact details and Maps links: `src/lib/site-contact.ts`
- Sitewide logo URL: `src/lib/site-logo.ts` or `NEXT_PUBLIC_SITE_LOGO_URL`
- Hero, category, story, and home-section image links: `src/lib/data/image-links/`
- Category product records: `src/lib/data/category-products.ts` and `src/lib/data/category-products/`
- Catalog suit products: `src/lib/data/catalog-suits.ts`

## Authentication and checkout

- `/login`, `/signup`, and `/forgot-password` are public.
- Storefront and product pages are public.
- `/checkout` redirects signed-out customers to login when Firebase is configured, preserving the return URL.
- If Firebase is intentionally not configured, the catalog still renders and checkout continues through WhatsApp without a Firestore write.

## Firebase security

Repository rules are in `firebase/firestore.rules` and `firebase/storage.rules`. They use the Firebase custom claim `admin: true` for privileged catalog/storage writes. A public environment variable or editable user document is never trusted for authorization.

Vercel does not publish Firebase rules. Publish them separately before launch, as described in [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).

## Private administration

The standalone protected workspace starts at `/admin/login` and includes:

- customer order confirmation, status changes, and confirmation emails;
- product creation, pricing, stock, images, collection flags, viewing, editing,
  hiding, restoring, and deletion;
- category creation, names, descriptions, imagery, viewing, hiding, restoring,
  and deletion;
- homepage hero slide creation, imagery, links, visibility, and deletion;
- announcement-bar, branding, social links, and public contact settings.

Storefront content remains available from the local catalogue when Firestore is empty.
Admin-saved Firestore records override matching local records by product/category slug or
banner ID and update connected browser sessions in real time.

Admin access is enforced by the Firebase Auth custom claim `admin: true`, not by a
route password or a browser-visible environment variable. To activate the one owner
account, follow the service-account command in
[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md#grant-the-owner-account-secure-admin-access).

## Deploying

The project is prepared for Vercel with a pinned Node.js version and the standard stable Next.js production build. No `vercel.json` is needed.

Follow the complete checklist in [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).

## Main structure

- `src/app` - App Router pages, metadata, sitemap, robots, loading/error states
- `src/components` - layout, auth, storefront, product, form, and UI components
- `src/lib/data` - editable local catalog and content
- `src/context` - Firebase authentication state
- `src/firebase` and `src/services` - optional Firebase integrations
- `src/store` - persistent cart, wishlist, compare, recent, settings, and UI state
- `public` - optimized local images and placeholders
- `firebase` - production Firestore and Storage rules

## License

Private and proprietary - Mietaaf.
