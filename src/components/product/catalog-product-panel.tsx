import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/types";
import { CatalogProductPhoto } from "@/components/product/catalog-product-photo";
import { formatInr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { buildProductHref } from "@/lib/product-links";

type CatalogProductPanelProps = {
  product: Product;
  variant?: "listing" | "detail" | "showcase";
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
  const href = buildProductHref(product.slug, product.images[0]);
  const isListing = variant === "listing";
  const isShowcase = variant === "showcase";
  const isLinked = variant !== "detail";

  if (isShowcase) {
    return (
      <article
        className={cn(
          "group grid min-w-0 overflow-hidden rounded-[1.5rem] border border-border/70 bg-card/80 shadow-[0_14px_38px_rgba(58,48,38,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_20px_48px_rgba(58,48,38,0.1)] sm:grid-cols-[0.82fr_1.18fr]",
          className,
        )}
      >
        <CatalogProductPhoto
          src={product.images[0]!}
          alt={product.name}
          href={href}
          priority={priority}
          className="h-full rounded-none ring-0 [&>div]:h-full [&>div]:min-h-72 [&>div]:aspect-auto sm:[&>div]:min-h-[23rem]"
          imageClassName="transition-transform duration-700 group-hover:scale-[1.025]"
        />

        <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6 lg:p-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary">
            Mietaaf catalog
          </p>
          <Link href={href} className="mt-2 block">
            <h3 className="font-heading text-2xl leading-tight tracking-[0.02em] text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-4 border-y border-border/70 py-3 text-sm">
            <p className="line-clamp-1 text-foreground/80">{product.fabric}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Sizes&nbsp; {product.sizes.join(" · ")}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-lg font-semibold text-foreground">{formatInr(product.price)}</span>
            {product.compareAtPrice ? (
              <span className="text-sm text-muted-foreground line-through">
                {formatInr(product.compareAtPrice)}
              </span>
            ) : null}
          </div>

          <Link
            href={href}
            className="mt-4 inline-flex w-fit items-center text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            View product <span aria-hidden="true">&nbsp;→</span>
          </Link>
        </div>
      </article>
    );
  }

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
        href={isLinked ? href : undefined}
        priority={priority}
      />

        <div className="flex min-w-0 flex-col justify-center text-foreground">
        {isListing ? (
          <Link href={href} className="group">
            <h2 className="font-heading text-lg font-medium tracking-[0.06em] group-hover:text-primary sm:text-xl">
              {title}
            </h2>
          </Link>
        ) : (
          <>
            {product.catalogTitle ? (
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary sm:text-xs">
                {product.catalogTitle}
              </p>
            ) : null}
            <h1 className="font-heading text-xl font-medium tracking-[0.06em] sm:text-2xl">
              {product.name}
            </h1>
          </>
        )}

        {bullets.length > 0 ? (
          <div className="mt-4 sm:mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:text-sm">
              Description
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
              {bullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:mt-5 sm:text-base">
          Size- {product.sizes.join(", ")}
        </p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-base">
          MRP-{" "}
          {product.compareAtPrice != null ? (
            <span className="font-normal text-foreground">{formatInr(product.compareAtPrice)}</span>
          ) : (
            "—"
          )}
        </p>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-base">
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
