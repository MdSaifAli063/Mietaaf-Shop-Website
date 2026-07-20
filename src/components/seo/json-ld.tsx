import type { Category, Product } from "@/types";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { SITE_NAME } from "@/lib/seo";

type BreadcrumbItem = {
  name: string;
  url: string;
};

function JsonLdScript({ data }: { data: unknown }) {
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
        image: absoluteUrl(category.image),
        isPartOf: { "@id": `${base}/#website` },
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const base = getSiteUrl();
  const productUrl = `${base}/product/${product.slug}`;
  const image = product.images[0] ?? "/placeholders/product-coming-soon.svg";
  if (image.includes("/placeholders/product-coming-soon.svg")) return null;

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        description: product.description,
        image: [absoluteUrl(image)],
        sku: product.id,
        url: productUrl,
        brand: {
          "@type": "Brand",
          name: SITE_NAME,
        },
        category: product.category,
        material: product.fabric,
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "INR",
          price: product.price,
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${base}/#organization` },
        },
      }}
    />
  );
}
