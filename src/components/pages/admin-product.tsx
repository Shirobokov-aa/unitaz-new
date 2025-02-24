'use client';

import { ProductEditor } from "@/components/admin/product-editor";
import type { CatalogProduct, Category, SubCategory } from "@/lib/db/schema";

interface CategoryWithSubCategories extends Category {
  subCategories: SubCategory[];
}

interface AdminProductContentProps {
  initialProduct: CatalogProduct;
  categories: CategoryWithSubCategories[];
}

export function AdminProductContent({ initialProduct, categories }: AdminProductContentProps) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Детальное редактирование товара</h1>
      <ProductEditor
        initialProduct={initialProduct}
        categories={categories}
      />
    </div>
  );
}
