import { fetchCategories } from "@/actions/query"
import { CategoryManager } from "@/components/admin/category-manager";

export default async function CategoriesPage() {
  const categories = await fetchCategories()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>
      <CategoryManager initialCategories={categories} />
    </div>
  )
}

