# Production search configuration

See [SEO_LAUNCH_CHECKLIST.md](SEO_LAUNCH_CHECKLIST.md) for the current rollout steps.

Set `NEXT_PUBLIC_SITE_URL=https://www.mietaaf.com` for production. The application now also uses this domain as its safe default. Do not set a Vercel deployment hostname as the production canonical.

Leave `NEXT_PUBLIC_INDEXING_DISABLED` unset or false in production. Preview deployments are noindexed automatically. Keep the existing apex-to-www redirect.

`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is optional: use the HTML-tag content token from the owner's Search Console property if that verification method is chosen. A DNS-verified Domain property does not need this token.

`NEXT_PUBLIC_GA_ID` is an optional real GA4 measurement ID for analytics. It is not a requirement for crawling, indexing, or ranking.

Official social links may be overridden with `NEXT_PUBLIC_SOCIAL_INSTAGRAM`, `NEXT_PUBLIC_SOCIAL_FACEBOOK` and `NEXT_PUBLIC_SOCIAL_LINKEDIN`. The repository's existing official links are the defaults.

Change hosting environment values through the owner's normal deployment process and rebuild before checking production metadata. Keep credentials out of committed environment files; use [.env.example](.env.example) only as a template. Hosting and account settings were not modified by this local implementation.
