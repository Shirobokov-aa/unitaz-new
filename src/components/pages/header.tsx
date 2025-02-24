import { CategoryManager } from "@/components/admin/category-manager";
import type { Category, SubCategory } from "@/lib/db/schema";

interface CategoryWithSubCategories extends Category {
  subCategories: SubCategory[];
}

interface CategoriesContentProps {
  initialCategories?: CategoryWithSubCategories[];
}

export function CategoriesContent({ initialCategories }: CategoriesContentProps) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>
      <CategoryManager initialCategories={initialCategories ?? []} />
    </div>
  );
}
