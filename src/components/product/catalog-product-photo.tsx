import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CatalogProductPhotoProps = {
  src: string;
  alt: string;
  /** Link wraps the image when set */
  href?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

/** Visible width of the catalog page image (photo column only — hides embedded PDF text). */
export const CATALOG_PHOTO_VISIBLE_FRACTION = 0.46;

export const catalogPhotoCropWidth = `${(100 / CATALOG_PHOTO_VISIBLE_FRACTION).toFixed(1)}%`;

export function isCatalogImageSrc(src: string): boolean {
  return /\/catalog\/catalog-page-\d+\.png/.test(src);
}

type CatalogCroppedFillImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Cropped catalog photo — parent must be `relative overflow-hidden` with a set size. */
export function CatalogCroppedFillImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: CatalogCroppedFillImageProps) {
  return (
    <div
      className="absolute inset-y-0 left-0 h-full"
      style={{ width: catalogPhotoCropWidth }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={cn("object-cover object-left", className)}
        sizes={sizes}
      />
    </div>
  );
}

type ProductThumbnailImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  fit?: "cover" | "contain";
};

/** Product image for cart, checkout, cards — crops catalog PNGs to the model photo only. */
export function ProductThumbnailImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
  fit = "cover",
}: ProductThumbnailImageProps) {
  if (isCatalogImageSrc(src)) {
    return (
      <CatalogCroppedFillImage
        src={src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={cn(
        fit === "contain" ? "object-contain object-center" : "object-cover",
        className,
      )}
      sizes={sizes}
    />
  );
}

/**
 * Shows only the model photo from a catalog PDF page (left crop — hides embedded PDF text).
 */
export function CatalogProductPhoto({
  src,
  alt,
  href,
  priority = false,
  className,
  imageClassName,
}: CatalogProductPhotoProps) {
  const frame = (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-white ring-1 ring-black/5",
        className,
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[4/5]">
        <ProductThumbnailImage
          src={src}
          alt={alt}
          priority={priority}
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 600px"
          className={imageClassName}
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block transition-opacity hover:opacity-95">
        {frame}
      </Link>
    );
  }

  return frame;
}
