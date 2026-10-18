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
          "group grid h-full min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card transition-colors duration-300 hover:border-primary/35 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
          className,
        )}
      >
        <CatalogProductPhoto
          src={product.images[0]!}
          alt={product.name}
          href={href}
          priority={priority}
          className="rounded-none bg-surface-paper ring-0 sm:h-full"
          frameClassName="aspect-[4/5] sm:aspect-auto sm:h-full sm:min-h-[23rem]"
          fit="contain"
          sizes="(min-width:1280px) 280px, (min-width:640px) 45vw, calc(100vw - 32px)"
          imageClassName="transition-transform duration-700 motion-safe:group-hover:scale-[1.015]"
        />

        <div className="flex min-w-0 flex-col p-5 sm:justify-center sm:p-6 xl:p-5 2xl:p-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-primary">
            Mietaaf catalog
          </p>
          <Link prefetch={false} href={href} className="mt-2 block">
            <h3 className="font-heading text-[1.625rem] leading-[1.1] tracking-[-0.015em] text-foreground transition-colors group-hover:text-primary sm:text-3xl xl:text-[1.625rem]">
              {product.name}
            </h3>
          </Link>
          <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-muted-foreground sm:line-clamp-3">
            {product.description}
          </p>

          <div className="mt-4 border-y border-border/70 py-3 text-sm">
            <p className="line-clamp-2 text-xs leading-5 text-foreground/80">{product.fabric}</p>
            <p className="mt-2 text-[10px] font-medium leading-5 tracking-[0.06em] text-muted-foreground">
              Sizes&nbsp; {product.sizes.join(" · ")}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-lg font-semibold text-foreground">{formatInr(product.price)}</span>
              {product.compareAtPrice ? (
                <span className="text-sm text-muted-foreground line-through">
                  {formatInr(product.compareAtPrice)}
                </span>
              ) : null}
            </div>
            <Link prefetch={false}
              href={href}
              className="inline-flex min-h-11 w-fit items-center gap-2 text-xs font-semibold text-primary underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
            >
              View product <span aria-hidden="true">&nbsp;→</span>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "grid min-w-0 gap-6 sm:gap-8 md:grid-cols-2 md:items-center lg:gap-12",
        variant === "detail" && "md:items-start",
        className,
      )}
    >
      <CatalogProductPhoto
        src={product.images[0]!}
        alt={product.name}
        href={isLinked ? href : undefined}
        priority={priority}
      />

        <div className={cn("flex min-w-0 flex-col justify-center text-foreground", variant === "detail" && "rounded-xl border border-border/70 bg-card p-5 sm:p-7 lg:p-8")}>
        {isListing ? (
          <Link prefetch={false} href={href} className="group">
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
            <h1 className="font-heading text-3xl font-medium leading-[1.08] tracking-[-0.025em] sm:text-4xl">
              {product.name}
            </h1>
          </>
        )}

        <div className="mt-5 border-b border-border/80 pb-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Selling Price</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="text-2xl font-semibold tracking-[-0.02em] text-foreground">{formatInr(product.price)}</span>
            <span className="text-xs text-muted-foreground">
              MRP {product.compareAtPrice != null ? <s>{formatInr(product.compareAtPrice)}</s> : "—"}
            </span>
          </div>
        </div>

        {bullets.length > 0 ? (
          <div className="mt-4 sm:mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Description
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
              {bullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground sm:mt-5">
          Size- {product.sizes.join(", ")}
        </p>

        {isListing ? (
          <Link prefetch={false}
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
