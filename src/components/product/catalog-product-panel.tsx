import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/types";
import { CatalogProductPhoto } from "@/components/product/catalog-product-photo";
import { formatInr } from "@/lib/format";
import { cn } from "@/lib/utils";

type CatalogProductPanelProps = {
  product: Product;
  variant?: "listing" | "detail";
  priority?: boolean;
  className?: string;
  /** Cart / WhatsApp — detail layout only */
  footer?: ReactNode;
};

export function CatalogProductPanel({
  product,
  variant = "listing",
  priority = false,
  className,
  footer,
}: CatalogProductPanelProps) {
  const title = product.catalogTitle ?? product.name;
  const bullets = product.catalogBullets ?? [];
  const href = `/product/${product.slug}`;
  const isListing = variant === "listing";

  return (
    <article
      className={cn(
        "grid min-w-0 gap-6 sm:gap-8 md:grid-cols-2 md:items-center lg:gap-12",
        className,
      )}
    >
      <CatalogProductPhoto
        src={product.images[0]!}
        alt={product.name}
        href={isListing ? href : undefined}
        priority={priority}
      />

      <div className="flex min-w-0 flex-col justify-center text-foreground">
        {isListing ? (
          <Link href={href} className="group">
            <h2 className="font-sans text-lg font-bold uppercase tracking-wide group-hover:text-primary sm:text-xl">
              {title}
            </h2>
          </Link>
        ) : (
          <h1 className="font-sans text-xl font-bold uppercase tracking-wide sm:text-2xl">{title}</h1>
        )}

        {bullets.length > 0 ? (
          <div className="mt-4 sm:mt-5">
            <p className="font-sans text-sm font-bold sm:text-base">Description</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 font-sans text-sm leading-relaxed sm:text-[15px]">
              {bullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-4 font-sans text-sm font-bold sm:mt-5 sm:text-base">
          Size- {product.sizes.join(", ")}
        </p>
        <p className="mt-2 font-sans text-sm font-bold sm:text-base">
          MRP-{" "}
          {product.compareAtPrice != null ? (
            <span className="font-normal">{formatInr(product.compareAtPrice)}</span>
          ) : (
            "—"
          )}
        </p>
        <p className="mt-1 font-sans text-sm font-bold sm:text-base">
          Selling Price- <span className="font-normal">{formatInr(product.price)}</span>
        </p>

        {isListing ? (
          <Link
            href={href}
            className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
          >
            View product →
          </Link>
        ) : null}

        {footer ? <div className="mt-6 sm:mt-8">{footer}</div> : null}
      </div>
    </article>
  );
}
