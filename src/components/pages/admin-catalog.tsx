'use client';

import { CategoryManager } from "@/components/admin/category-manager";
import type { Category, SubCategory } from "@/lib/db/schema";

// export const dynamic = 'force-dynamic';

interface CategoryWithSubCategories extends Category {
  subCategories: SubCategory[];
}

interface AdminCatalogContentProps {
  initialCategories?: CategoryWithSubCategories[];
}

export function AdminCatalogContent({ initialCategories }: AdminCatalogContentProps) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Управление каталогом</h1>
      <CategoryManager initialCategories={initialCategories ?? []} />
    </div>
  );
}
