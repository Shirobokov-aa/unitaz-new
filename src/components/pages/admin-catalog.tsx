'use client';

import { CatalogManager } from "@/components/admin/catalog-manager";
import { CatalogBannerManager } from "@/components/admin/catalog-banner-manager";
import type { Category, SubCategory, CatalogProduct, CatalogBanner } from "@/lib/db/schema";

// export const dynamic = 'force-dynamic';

interface CategoryWithSubCategories extends Category {
  subCategories: SubCategory[];
}

interface AdminCatalogContentProps {
  initialCategories: CategoryWithSubCategories[];
  initialProducts: CatalogProduct[];
  initialBanner?: CatalogBanner;
}

export function AdminCatalogContent({ initialCategories, initialProducts, initialBanner }: AdminCatalogContentProps) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Управление каталогом</h1>
      <div className="space-y-8">
        <CatalogBannerManager initialBanner={initialBanner} />
        <CatalogManager
          initialProducts={initialProducts}
          categories={initialCategories}
        />
      </div>
    </div>
  );
}
