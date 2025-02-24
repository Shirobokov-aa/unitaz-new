import { Suspense } from "react";
import { fetchProductById, fetchCategories } from "@/actions/query";
import { notFound } from "next/navigation";
import { AdminProductContent } from "@/components/pages/admin-product";

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function AdminProductPage({ params }: ProductPageProps) {
  const productId = parseInt(params.id);

  if (isNaN(productId)) {
    notFound();
  }

  try {
    const [product, categories] = await Promise.all([
      fetchProductById(productId),
      fetchCategories(),
    ]);

    if (!product) {
      notFound();
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminProductContent
          initialProduct={product}
          categories={categories}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
