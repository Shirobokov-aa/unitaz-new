import { Suspense } from "react";
import { fetchCategories } from "@/actions/query";
import { CategoriesContent } from "@/components/pages/header";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesContent initialCategories={categories} />
    </Suspense>
  );
}
