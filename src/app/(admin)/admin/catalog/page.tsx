import { Suspense } from "react";
import { fetchCategories, fetchCatalogProducts, fetchCatalogBanner } from "@/actions/query";
import { AdminCatalogContent } from "@/components/pages/admin-catalog";

export const dynamic = 'force-dynamic';

export default async function AdminCatalogPage() {
  const [categories, products, banner] = await Promise.all([
    fetchCategories(),
    fetchCatalogProducts(),
    fetchCatalogBanner()
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminCatalogContent
        initialCategories={categories}
        initialProducts={products}
        initialBanner={banner}
      />
    </Suspense>
  );
}
