# Vercel deployment checklist

This repository is ready for Vercel's standard Next.js deployment. Keep Framework Preset on **Next.js**, Root Directory on the repository root, and leave Output Directory empty. Vercel will run `npm install` and `npm run build` automatically using Node.js 22.

No `vercel.json` is required.

## 1. Import the repository

1. Push this project to your Git provider.
2. In Vercel, choose **Add New -> Project** and import the repository.
3. Confirm these detected settings:
   - Framework Preset: `Next.js`
   - Root Directory: `.`
   - Build Command: `npm run build`
   - Output Directory: leave blank
   - Install Command: leave at the npm default
   - Node.js: `22.x` (also pinned in `package.json`)

## 2. Add Vercel environment variables

In **Project Settings -> Environment Variables**, copy the real values from your local `.env` without committing that file. Apply integration variables to **Production** and **Preview** if preview deployments must support login and forms.

Required for the complete live experience:

```text
NEXT_PUBLIC_WHATSAPP_NUMBER

NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

NEXT_PUBLIC_EMAILJS_SERVICE_ID
NEXT_PUBLIC_EMAILJS_APPOINTMENT_TEMPLATE_ID
NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
```

Production URL and optional branding/social variables:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SITE_LOGO_URL
NEXT_PUBLIC_SOCIAL_LINKEDIN
NEXT_PUBLIC_SOCIAL_INSTAGRAM
NEXT_PUBLIC_SOCIAL_FACEBOOK
```

Rules for the values:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: country code and phone number, digits only; no `+`, spaces, or dashes.
- `NEXT_PUBLIC_SITE_URL`: the final HTTPS origin with no path, for example `https://mietaaf.com`.
- `NEXT_PUBLIC_SITE_LOGO_URL`: optional. Leave it unset/blank to use the existing logo. A remote override must use an image host allowed in `next.config.ts`.
- Do not surround values with quotes.
- Environment variables changed after a deployment take effect only after a new deployment.

For the first Vercel deployment, `NEXT_PUBLIC_SITE_URL` may be left unset. The app uses Vercel's deployment URL. Once the final `*.vercel.app` or custom domain is known, set its exact HTTPS origin for **Production** and redeploy so canonical links, sitemap, Open Graph, and JSON-LD all use it.

## 3. Complete Firebase setup

In Firebase Console:

1. Open **Authentication -> Sign-in method** and enable Email/Password and Google.
2. Open **Authentication -> Settings -> Authorized domains**.
3. Add the stable Vercel production hostname (for example `your-project.vercel.app`) and the custom domain, if used. Add any preview hostname that must support Google sign-in.
4. If the Google Cloud API key has HTTP-referrer restrictions, add the same HTTPS domains there.
5. Publish both repository rules before public launch:

```bash
npx firebase-tools login
npx firebase-tools use --add
npx firebase-tools deploy --only firestore:rules,storage
```

Select the same Firebase project whose public values were placed in Vercel. As an alternative, paste `firebase/firestore.rules` and `firebase/storage.rules` into their matching Firebase Console Rules tabs and publish them.

The current website has no browser-based admin dashboard. If one is added later, assign `admin: true` only from a trusted Firebase Admin SDK environment; never restore email-list or profile-field authorization.

## 4. Complete EmailJS setup

In EmailJS:

1. Keep separate Appointment and Contact templates; their IDs go in the two separate Vercel variables.
2. Confirm each template delivers to the intended Mietaaf inbox. The forms provide `{{to_email}}` and `{{reply_to}}`.
3. In **Domains / Allowed Origins**, add the exact production origin and any preview origin used for testing, including `https://`.

EmailJS and Firebase Web SDK run in the browser, so their public IDs are visible by design. Security comes from EmailJS origin controls and Firebase Rules, not from hiding these identifiers.

## 5. Deploy and smoke-test

Click **Deploy**, then verify on the deployed HTTPS URL:

1. Home, Shop, Categories, Wedding, Premium, Lookbook, Fabrics, About, and Contact render without image errors.
2. Product quick view and product detail show the same image and data.
3. Cart and wishlist survive a refresh.
4. Checkout asks a signed-out customer to sign in, returns to checkout, saves the order, and opens WhatsApp.
5. Email/password login, Google login, and password reset work.
6. Contact and Appointment each reach the correct EmailJS template/inbox.
7. `/robots.txt` and `/sitemap.xml` contain the production domain.
8. Test at least one mobile viewport and one desktop viewport.

If Vercel reports a stale `.next` manifest locally, stop every running Next.js process and remove `.next`/`.next-dev` before rebuilding. These generated folders are ignored and are never uploaded to Vercel.
