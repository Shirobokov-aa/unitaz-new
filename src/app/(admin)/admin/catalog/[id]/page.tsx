import { fetchProductById, fetchCategories } from "@/actions/query";
import { ProductEditor } from "@/components/admin/product-editor";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminProductPage({ params }: ProductPageProps) {
  // Дожидаемся получения params
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);

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
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Детальное редактирование товара</h1>
        <ProductEditor
          initialProduct={product}
          categories={categories}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
