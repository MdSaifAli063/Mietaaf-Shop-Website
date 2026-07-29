"use client";

import Link from "next/link";
import { PackageX } from "lucide-react";
import type { Product } from "@/types";
import { useShopData } from "@/hooks/use-shop-data";
import { isCatalogProduct } from "@/lib/data/catalog-suits";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { CatalogProductDetailView } from "@/components/product/catalog-product-detail-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ManagedProductDetail({ fallbackProduct }: { fallbackProduct: Product }) {
  const { allProducts } = useShopData();
  const product =
    allProducts.find((item) => item.slug === fallbackProduct.slug) ?? fallbackProduct;

  if (product.hidden || product.deleted) {
    return (
      <div className="page-container py-16">
        <Card className="mx-auto max-w-xl rounded-[1.5rem] p-8 text-center">
          <PackageX className="mx-auto size-9 text-primary" />
          <h1 className="mt-4 font-heading text-3xl">This piece is unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            It has been removed from the current Mietaaf catalogue.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/shop">Browse available pieces</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return isCatalogProduct(product)
    ? <CatalogProductDetailView product={product} />
    : <ProductDetailView product={product} />;
}
