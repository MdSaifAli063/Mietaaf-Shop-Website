# Mietaaf Couture: search and AI discovery launch

16 October 2026. These changes are in the local project. Deploy this build before expecting production or Google to change.

## Intended search appearance

- Site name: **Mietaaf Couture**.
- Homepage title: **Mietaaf Couture | Custom-Tailored Menswear in Bangalore**.
- Canonical homepage: `https://www.mietaaf.com/`.
- Business: the existing Mietaaf Couture LLP listing supplied by the owner, [Google Business Profile](https://share.google/IAhviumKntqp7Cz68).

The small name beside the favicon and the clickable page title are separate Google features. `WebSite.name`, `og:site_name`, visible brand text, the page title and consistent business identity now express the preferred name. Google makes the final display decision after recrawling; a first position or an exact title cannot be guaranteed.

## Included in this build

- Brand-first homepage title and page-specific public titles, descriptions, Open Graph and Twitter metadata.
- A production-domain fallback that does not publish a Vercel deployment or localhost URL when the canonical environment variable is missing.
- A permanent, visible homepage brand heading, Bangalore/Bengaluru context, appointment information and ordering answers rendered on the server.
- Connected `WebSite`, `WebPage`, `OnlineStore`, `ClothingStore`, `AboutPage`, `ContactPage`, collection, breadcrumb, FAQ and product structured data where relevant.
- The owner's Google listing and existing social profiles connected to the business identity. No invented coordinates, postcode, awards, customer reviews or ratings.
- Product image, price, currency, stock availability, material, size and colour structured data based on the catalogue. Private/placeholder-only products are excluded from indexing or sitemap entries as appropriate.
- Shared server-side catalogue resolution so admin edits and removals are respected by product/category metadata, server content and sitemap. Catalogue data revalidates every 60 seconds; sitemap revalidates every five minutes. A failed public data fetch falls back to the bundled catalogue.
- Server-rendered shop links and category products, including requests without JavaScript. Filtered shop and product image URLs canonicalize to the underlying public page.
- Public catalogue routes validate existence before streaming a response. The previous global loading boundary was moved to checkout so missing products and collections can return HTTP 404. Metadata is delivered in the initial head; this waits for metadata resolution on dynamic pages rather than streaming the head later.
- The first-visit splash is a browser-only enhancement. It does not cover the server-rendered storefront when JavaScript is disabled.
- A single image-aware sitemap, crawlable public routes, private/auth page `noindex` rules, and preview/staging indexing safeguards.
- The owner-selected `public/branding/mietaaf-social-card.png` logo card is the default Open Graph and Twitter image. The `/opengraph-image` and `/twitter-image` endpoints serve that same PNG unchanged. Existing favicon/Apple icons are retained.
- `/llms.txt` and `/llms-full.txt`, sharing the public brand facts and FAQ answers. These optional text references remain fetchable but are marked `noindex` to keep them out of ordinary search results.

## Local verification completed

- Production build passed, including ESLint and TypeScript checks; 138 static pages generated.
- Raw-HTML crawl passed for all 70 indexable sitemap URLs: branded titles and descriptions, canonical URLs, OG/Twitter metadata, robots directives and parseable structured data.
- Eleven private/auth/utility URLs were checked for `noindex`; both missing product and collection routes returned HTTP 404 with `noindex`.
- Both LLM reference routes, robots.txt and five brand/social image endpoints passed HTTP/content checks. The sitemap passed strict XML parsing with 70 page URLs and 59 image entries, including image URLs with query-string ampersands. FAQ structured answers matched the visible answers.
- Unit checks passed for canonical normalization, production/preview robots, catalogue edits/removals, placeholder image eligibility, JSON-LD escaping and product price/stock schema.
- Browser checks passed for responsive layouts, collection filters, selected size/quantity in WhatsApp inquiries, cart and comparison. Brand and FAQ sections were reviewed on mobile/desktop. The shop's product links remained visible with JavaScript disabled. No browser errors were recorded.
- Existing checkout validation and unchanged submission-handler checks passed. No order or message was sent.

Results and screenshots are saved under `tmp/responsive-review/seo-*` and `tmp/responsive-review/production*`. These are local validation results, not Google Search Console reports or a live ranking measurement.

## Production settings

Set or confirm the following in the production hosting environment:

| Variable | Value / purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.mietaaf.com` (also the safe default) |
| `NEXT_PUBLIC_INDEXING_DISABLED` | Unset or `false` in production; `true` only when intentionally blocking indexing |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional Search Console HTML verification token; only the token, never a full tag |
| `NEXT_PUBLIC_GA_ID` | Optional real GA4 measurement ID for analytics; it is not required for crawling or ranking |
| `NEXT_PUBLIC_SOCIAL_*` | Optional official profile overrides; otherwise the existing repository defaults are used |

Vercel Preview deployments are noindexed. The apex domain currently redirects to `www` on the live host; preserve that single-domain redirect. Do not point the production canonical at a preview deployment.

## After deployment

1. Open the homepage source and confirm the title above, `og:site_name=Mietaaf Couture`, one canonical on `https://www.mietaaf.com/`, and `WebSite.name=Mietaaf Couture`. Production public pages must not contain `noindex` or return a blocking `X-Robots-Tag` header.
2. Confirm `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, `/opengraph-image` and `/twitter-image` return HTTP 200. Open a product and a category to check their titles, canonical URLs, visible data and images.
3. Use the existing Search Console property (Domain verification with DNS or URL-prefix verification both work). Submit `https://www.mietaaf.com/sitemap.xml`. Inspect the homepage and request indexing/recrawling. Also inspect `/about`, `/contact`, a collection and a representative product. Site verification and sitemap submission help you manage discovery; they are not prerequisites for Google to crawl a public website.
4. Test homepage identity in [Schema Markup Validator](https://validator.schema.org/). Test product and breadcrumb markup in [Google Rich Results Test](https://search.google.com/test/rich-results). A valid test does not guarantee a rich result. Google does not generally show ecommerce FAQ rich results.
5. In the existing Google Business Profile, confirm ownership/verification, the real-world business name, website `https://www.mietaaf.com/`, accurate category, address, hours and phone. Confirm the public site information agrees. Keep genuine photos and reviews current. Website code does not verify or edit the profile itself.
6. Monitor Search Console indexing and queries such as “mietaaf couture”, “mietaaf couture bangalore” and “mietaaf couture bengaluru”. Compare impressions, clicks and average position over time. Check Core Web Vitals and PageSpeed Insights against the deployed site and real customer traffic.

No fixed crawl, indexing, title-change or ranking date is promised. Request a recrawl after deployment and allow Google to process the new signals.

## AEO / GEO limits

The useful work is accurate, accessible content and consistent entities. Google says its AI search features use the same SEO foundations; they do not require a special AI schema or text file. `llms.txt` is an optional convenience, not a Google ranking factor or an inclusion guarantee. Meta keywords are included as descriptive metadata at the owner's request; Google does not use them for web ranking. No obsolete sitelinks search-box markup, keyword-stuffed hidden content or fabricated review schema was added.

## Authoritative references

- [Google: site names](https://developers.google.com/search/docs/appearance/site-names)
- [Google: title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google: AI features and websites](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Google: improving local ranking](https://support.google.com/business/answer/7091)
- [Google: supported and unsupported metadata](https://developers.google.com/search/docs/crawling-indexing/special-tags)

Search Console, Google Business Profile account settings, DNS, hosting settings and deployment were not changed by this local implementation. No customer order or message was sent.
