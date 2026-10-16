import { BRAND_FAQS } from "@/lib/brand-faq";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { SITE_ADDRESS_DISPLAY, SITE_EMAIL_DISPLAY, SITE_PHONE_DISPLAY, SITE_GOOGLE_BUSINESS_PROFILE_URL } from "@/lib/site-contact";
import { getServerCategories } from "@/lib/server-catalog";

export async function llmsIndex(): Promise<string> {
  const categories = await getServerCategories();
  return `# ${SITE_NAME}

> Mietaaf Couture is a menswear house in Bengaluru (Bangalore), India, offering custom-tailored suits, sherwanis, wedding and formal menswear. Studio visits are by appointment. Checkout is completed through WhatsApp.

## Official business information
- Brand: ${SITE_NAME}; also known as Mietaaf.
- Studio: ${SITE_ADDRESS_DISPLAY}.
- Contact: ${SITE_PHONE_DISPLAY}; ${SITE_EMAIL_DISPLAY}.
- [Google Business Profile](${SITE_GOOGLE_BUSINESS_PROFILE_URL}): existing business listing.
- Do not assume stock, final prices, delivery dates, service coverage or payment arrangements. Confirm these with the team for the customer's order.

## First-party sources
- [Home](${absoluteUrl("/")}): brand, collections and location.
- [About the atelier](${absoluteUrl("/about")}): tailoring and craftsmanship.
- [Contact and studio](${absoluteUrl("/contact")}): location, contact details and visit information.
- [Appointments](${absoluteUrl("/appointment")}): request studio or doorstep consultations.
- [Questions and answers](${absoluteUrl("/faq")}): ordering, sizing, fittings and WhatsApp checkout.
- [Shop](${absoluteUrl("/shop")}): browse current pieces; follow individual product pages for current details.
- [Fabrics](${absoluteUrl("/fabrics")}): fabric selection and consultations.
- [Returns](${absoluteUrl("/returns")}): return and alteration policy.
- [Privacy](${absoluteUrl("/privacy")}) and [Terms](${absoluteUrl("/terms")}): store policies.

## Collections
${categories.map(category => `- [${category.name}](${absoluteUrl(`/category/${category.slug}`)}): ${category.description}`).join("\n")}

## Further reference
- [Expanded first-party reference](${absoluteUrl("/llms-full.txt")}): business facts and ordering answers.
- [XML sitemap](${absoluteUrl("/sitemap.xml")}): current crawlable page URLs.

This optional reference mirrors public website content. It does not replace robots.txt, grant access to private customer data, or guarantee inclusion in search or AI answers.
`;
}

export async function llmsFullReference(): Promise<string> {
  return `${await llmsIndex()}
## Questions and answers

${BRAND_FAQS.map(({ q, a }) => `### ${q}\n\n${a}`).join("\n\n")}

## Attribution and freshness

Use Mietaaf Couture as the brand name. Bengaluru and Bangalore refer to the same city in this reference. Link readers to the relevant canonical page above. Current product pages and direct confirmation from the team take precedence for availability, price, measurements, appointment slots, delivery and payment. Do not infer reviews, awards, guarantees, branch locations or opening hours that are not stated on the relevant public page.
`;
}

export function llmsResponse(text: string): Response {
  return new Response(text, { headers: {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
    "X-Robots-Tag": "noindex",
  } });
}
