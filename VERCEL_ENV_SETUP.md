# Production search configuration

See [SEO_LAUNCH_CHECKLIST.md](SEO_LAUNCH_CHECKLIST.md) for the current rollout steps.

Set `NEXT_PUBLIC_SITE_URL=https://www.mietaaf.com` for production. The application now also uses this domain as its safe default. Do not set a Vercel deployment hostname as the production canonical.

Leave `NEXT_PUBLIC_INDEXING_DISABLED` unset or false in production. Preview deployments are noindexed automatically. Keep the existing apex-to-www redirect.

`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is optional: use the HTML-tag content token from the owner's Search Console property if that verification method is chosen. A DNS-verified Domain property does not need this token.

`NEXT_PUBLIC_GA_ID` is an optional real GA4 measurement ID for analytics. It is not a requirement for crawling, indexing, or ranking.

Official social links may be overridden with `NEXT_PUBLIC_SOCIAL_INSTAGRAM`, `NEXT_PUBLIC_SOCIAL_FACEBOOK` and `NEXT_PUBLIC_SOCIAL_LINKEDIN`. The repository's existing official links are the defaults.

Change hosting environment values through the owner's normal deployment process and rebuild before checking production metadata. Keep credentials out of committed environment files; use [.env.example](.env.example) only as a template. Hosting and account settings were not modified by this local implementation.

## Server-side email configuration

In Vercel Project Settings -> Environment Variables, use these names without a
`NEXT_PUBLIC_` prefix. Copy their values from the existing EmailJS account:

```text
EMAILJS_SERVICE_ID
EMAILJS_PUBLIC_KEY
EMAILJS_CONTACT_TEMPLATE_ID
EMAILJS_APPOINTMENT_TEMPLATE_ID
EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID
EMAILJS_PRIVATE_KEY
```

The private key is recommended and is required if private-key authorization is
enabled in EmailJS. Enable non-browser API requests in EmailJS **Account ->
Security**, as described in the [official Node integration](https://github.com/emailjs-com/emailjs-nodejs#usage).
Use the existing [order confirmation HTML template](EMAILJS_ORDER_CONFIRMATION_TEMPLATE.html)
and set its To Email, Reply To and Subject to `{{to_email}}`, `{{reply_to}}` and
`{{subject}}`. Keep separate templates for Contact and Appointments.

For migration, add the new server-only variables, remove the old
`NEXT_PUBLIC_EMAILJS_*` variables and redeploy. Old names are temporarily accepted
by server code only. Credentials and provider errors are never returned by the
email APIs. No configuration banner is shown in the administration interface.

An order can be confirmed even when email delivery is unavailable. Its email
status becomes Failed and the administrator can use Resend email after setup is
complete. Missing EmailJS templates cannot be created or verified by a local
build; production delivery must be checked with an authorized test order.

### EmailJS returns 403

`[email] Provider rejected delivery` with status 403 means EmailJS refused the
server request. The subsequent public API status 502 reports that upstream
failure; it is not a Firebase authorization error.

1. Open [EmailJS Account -> Security](https://dashboard.emailjs.com/admin/account/security).
   Enable **Allow EmailJS API for non-browser applications** and save. This is
   required because emails now originate from the backend.
2. If private-key authorization is enabled, copy the matching private key into
   `EMAILJS_PRIVATE_KEY` in the local environment and Vercel. Never add a
   `NEXT_PUBLIC_` prefix. An empty key cannot authorize an account that requires it.
3. Ensure the service ID, public key and template IDs belong to the same EmailJS
   account. Review any origin restrictions for compatibility with server requests.
4. Restart the local development server after environment changes; redeploy
   after Vercel environment changes, then retry once.

Backend logs now include a fixed diagnostic reason and setup hint, such as
`NON_BROWSER_API_DISABLED` or `PRIVATE_KEY_REJECTED`. Raw provider messages and
credentials are never logged or returned to the browser. Account permissions
must be changed by the owner in EmailJS; website code cannot enable them.
