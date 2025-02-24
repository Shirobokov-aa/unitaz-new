import { Suspense } from "react";
import { fetchCategories } from "@/actions/query";
import { AdminCatalogContent } from "@/components/pages/admin-catalog";

export const dynamic = 'force-dynamic';

export default async function AdminCatalogPage() {
  const categories = await fetchCategories();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminCatalogContent initialCategories={categories} />
    </Suspense>
  );
}
