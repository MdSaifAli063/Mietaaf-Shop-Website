import type { Category, Product } from "@/types";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { SITE_NAME } from "@/lib/seo";

type BreadcrumbItem = {
  name: string;
  url: string;
};

export function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: absoluteUrl(item.url),
        })),
      }}
    />
  );
}

export function CategoryJsonLd({ category }: { category: Category }) {
  const base = getSiteUrl();
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${base}/category/${category.slug}#collection`,
        url: `${base}/category/${category.slug}`,
        name: `${category.name} | ${SITE_NAME}`,
        description: category.description,
        image: category.image ? absoluteUrl(category.image) : undefined,
        isPartOf: { "@id": `${base}/#website` },
      }}
    />
  );
}

export function PageJsonLd({ title, description, path, type = "WebPage" }: {
  title: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
}) {
  return <JsonLdScript data={{
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    name: title,
    description,
    url: absoluteUrl(path),
    inLanguage: "en-IN",
    isPartOf: { "@id": `${getSiteUrl()}/#website` },
    about: { "@id": `${getSiteUrl()}/#organization` },
    publisher: { "@id": `${getSiteUrl()}/#organization` },
  }} />;
}

export function FaqJsonLd({ items }: { items: readonly { q: string; a: string }[] }) {
  return <JsonLdScript data={{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl("/faq")}#webpage`,
    url: absoluteUrl("/faq"),
    name: `Questions & Answers | ${SITE_NAME}`,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${getSiteUrl()}/#website` },
    mainEntity: items.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  }} />;
}

export function ProductJsonLd({ product }: { product: Product }) {
  const base = getSiteUrl();
  const productUrl = `${base}/product/${product.slug}`;
  const images = product.images.filter(image => image.trim() && !image.includes("/placeholders/product-coming-soon.svg"));
  if (!images.length || product.hidden || product.deleted) return null;

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        description: product.description,
        image: images.map(absoluteUrl),
        sku: product.id,
        url: productUrl,
        brand: {
          "@type": "Brand",
          name: SITE_NAME,
        },
        category: product.category,
        material: product.fabric,
        color: product.colors.map(color => color.name).join(", "),
        size: product.sizes,
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "INR",
          price: product.price,
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${base}/#organization` },
        },
      }}
    />
  );
}
