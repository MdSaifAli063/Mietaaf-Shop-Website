import { CatalogProductPanel } from "@/components/product/catalog-product-panel";
import type { Product } from "@/types";

export function CatalogSuitsCategory({ products }: { products: Product[] }) {
  return (
    <div className="mt-10 space-y-12 sm:mt-12 sm:space-y-14 md:space-y-16">
      {products.map((product) => (
        <article key={product.id} id={product.slug} className="scroll-mt-24">
          <CatalogProductPanel product={product} variant="listing" />
        </article>
      ))}
    </div>
  );
}
