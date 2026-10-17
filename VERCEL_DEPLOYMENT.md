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

EMAILJS_SERVICE_ID
EMAILJS_APPOINTMENT_TEMPLATE_ID
EMAILJS_CONTACT_TEMPLATE_ID
EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID
EMAILJS_PUBLIC_KEY
```

Production URL and optional branding/social variables:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_INDEXING_DISABLED
NEXT_PUBLIC_SITE_LOGO_URL
NEXT_PUBLIC_SOCIAL_LINKEDIN
NEXT_PUBLIC_SOCIAL_INSTAGRAM
NEXT_PUBLIC_SOCIAL_FACEBOOK
```

Rules for the values:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: country code and phone number, digits only; no `+`, spaces, or dashes.
- `NEXT_PUBLIC_SITE_URL`: the final HTTPS origin with no path. It must match the domain visitors land on after redirects; for this site use `https://www.mietaaf.com`.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: optional. Paste only the Google Search Console meta tag `content` value.
- `NEXT_PUBLIC_GA_ID`: optional. Add the Google Analytics 4 Measurement ID in `G-XXXXXXXXXX` format.
- `NEXT_PUBLIC_INDEXING_DISABLED`: optional. Set to `true` only for staging. Vercel Preview deployments are noindexed automatically.
- `NEXT_PUBLIC_SITE_LOGO_URL`: optional. Leave it unset/blank to use the existing logo. A remote override must use an image host allowed in `next.config.ts`.
- Do not surround values with quotes.
- Environment variables changed after a deployment take effect only after a new deployment.

The app now defaults to `https://www.mietaaf.com` when `NEXT_PUBLIC_SITE_URL` is unset. Keep that canonical origin for production; do not publish a Vercel deployment hostname as the canonical. Preview deployments remain noindexed. See [SEO_LAUNCH_CHECKLIST.md](SEO_LAUNCH_CHECKLIST.md) for the current search rollout.

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

### Grant the owner account secure admin access

The complete `/admin` workspace is protected by the Firebase custom claim
`admin: true`; changing a user profile field cannot grant access.

1. Create/sign in to the Firebase account that will manage Mietaaf orders.
2. In Firebase Console, open **Project settings -> Service accounts** and
   generate a private key for this one-time local operation. Never commit that
   JSON file or add it to Vercel.
3. In PowerShell, point Application Default Credentials to the downloaded file:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS='C:\secure\firebase-service-account.json'
npm run admin:grant -- your-admin-email@example.com
```

4. Sign out and open `/admin/login`. Use that Firebase email/password account
   to enter the standalone administration dashboard.
5. Delete or securely archive the downloaded service-account key after use.

The included script preserves existing custom claims while adding `admin: true`.
Only run it from a trusted machine. Run it for only the single private owner account
if Mietaaf should have exactly one administrator.

## 4. Complete EmailJS setup

In EmailJS:

1. Keep separate Appointment, Contact, and Order Confirmation templates; their
   IDs go in the three separate Vercel variables.
2. For the Order Confirmation template:
   - Set **To Email** to `{{to_email}}`.
   - Set **Reply To** to `{{reply_to}}`.
   - Set **Subject** to `{{subject}}`.
   - Paste the contents of `EMAILJS_ORDER_CONFIRMATION_TEMPLATE.html` into the
     template body.
3. Confirm Appointment and Contact deliver to the intended Mietaaf inbox. The
   forms provide `{{to_email}}` and `{{reply_to}}`.
4. In **Account -> Security**, enable API requests for non-browser applications,
   as required by the [official EmailJS Node integration](https://github.com/emailjs-com/emailjs-nodejs#usage).
5. Enable private-key authorization if available and set `EMAILJS_PRIVATE_KEY`
   in Vercel. Never use a `NEXT_PUBLIC_` prefix for a private key.
6. If migrating an existing deployment, copy the EmailJS values into the new
   server-only names above, remove the old `NEXT_PUBLIC_EMAILJS_*` variables,
   then redeploy. A temporary server-only fallback supports the old names.

All three email flows now run on the server. The browser sends validated form
fields or an order ID, never provider credentials or a recipient override.
The confirmation API verifies the Firebase ID token and the `admin: true` claim,
then reads the saved order and updates it using that token, subject to Firestore
Rules. Firebase Web SDK identifiers remain public because browser sign-in needs
them; no Firebase service-account key is required for this email flow.

## 5. Deploy and smoke-test

Click **Deploy**, then verify on the deployed HTTPS URL:

1. Home, Shop, Categories, Wedding, Premium, Lookbook, Fabrics, About, and Contact render without image errors.
2. Product quick view and product detail show the same image and data.
3. Cart and wishlist survive a refresh.
4. Checkout asks a signed-out customer to sign in, returns to checkout, saves the order, and opens WhatsApp.
5. Email/password login, Google login, and password reset work.
6. Contact and Appointment each reach the correct EmailJS template/inbox.
7. Open `/admin` as the owner and verify product, category, banner, and website
   settings can be saved and appear on the storefront.
   Wedding and Premium have separate admin screens for their collection items.
   In `/admin/lookbook`, choose products, arrange their order, click **Save
   lookbook**, then verify `/lookbook` displays that selection. It uses the
   existing admin-protected `settings/lookbook` document; until the first save,
   the original automatic gallery remains available.
8. Place a customer order, open `/admin/orders` as the admin, click
   **Confirm order**, and verify:
   - the admin order badge changes to Confirmed;
   - the customer profile changes to Confirmed without a refresh;
   - the customer receives the EmailJS confirmation;
   - if delivery fails, the order stays confirmed and **Resend email** can retry.
9. `/robots.txt` and `/sitemap.xml` contain the production domain.
10. The home page source includes Organization/WebSite JSON-LD, product pages include Product/Breadcrumb JSON-LD, and utility/admin pages include `noindex`.
11. Test at least one mobile viewport and one desktop viewport.

## 6. Publish to Google

After the production domain is live:

1. Open Google Search Console and add the final domain as a property.
2. Verify with either DNS verification or the HTML tag. For the HTML tag method, put the tag's `content` value into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, redeploy, then click **Verify**.
3. Submit `https://your-domain.com/sitemap.xml` in **Sitemaps**.
4. Use **URL Inspection** for the homepage and one real product page, then request indexing.
5. Test one product page with Google's Rich Results Test and the homepage with Schema Markup Validator.

If Vercel reports a stale `.next` manifest locally, stop every running Next.js process and remove `.next`/`.next-dev` before rebuilding. These generated folders are ignored and are never uploaded to Vercel.
