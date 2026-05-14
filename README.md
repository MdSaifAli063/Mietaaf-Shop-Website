# Mietaaf — Luxury Men’s Fashion (Next.js 15)

Production-ready men’s ethnic and formal e-commerce experience: **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Firebase Auth + Firestore + Storage**, **Framer Motion**, **Shadcn UI (Base UI primitives)**, **Zustand**, **React Hook Form + Zod**, **Swiper**, **React Hot Toast**, **next-themes**.

Orders are completed **without a payment gateway**: checkout builds a structured message and redirects to **`https://wa.me/<YOUR_NUMBER>?text=...`**, optionally persisting an `orders` document in Firestore.

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
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Business WhatsApp in **digits only** (e.g. `9198xxxxxxxx`) |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Comma-separated emails that may access `/admin` in the UI |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Web SDK config from the Firebase console |

## Firebase setup

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** → Email/Password and **Google**.
3. Create a **Firestore** database (production mode), then deploy rules from `firebase/firestore.rules` (adjust for production — see comments in the file).
4. Enable **Storage** and deploy `firebase/storage.rules`.
5. Add a **Web app** in Project settings and paste keys into `.env.local`.
6. **Admin access**
   - Add your email to `NEXT_PUBLIC_ADMIN_EMAILS`, **or**
   - After first sign-in, in Firestore document `users/<uid>` set `role` to `"admin"` so rules allow product writes.
7. **Sample admin (dev)**  
   - Create an Auth user e.g. `admin@mietaaf.com` / your password.  
   - Add that email to `NEXT_PUBLIC_ADMIN_EMAILS` and add `role: "admin"` on the `users/<uid>` document for Firestore rule alignment.

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

- `src/app` — App Router pages (shop group `(main)`, `admin`, `not-found`)  
- `src/components` — UI, layout, home, product, admin, motion, luxury  
- `src/lib` — constants, data seeds, formatting, WhatsApp helpers, validations, SEO  
- `src/store` — Zustand (cart, wishlist, compare, recent, UI)  
- `src/context` — Firebase auth provider  
- `src/firebase` — client SDK bootstrap  
- `src/services` — optional helpers (e.g. Storage upload)  
- `firebase/` — Firestore and Storage rules templates  

## Security notes

- Firestore rules in-repo are a **starting point**; tighten `orders` create/read and admin checks before public launch.  
- Prefer **Firebase Admin SDK** or **Custom Claims** for authoritative admin checks in production.  
- Never commit real `.env.local` files.

## Licence

Private / proprietary — Mietaaf.
