import { fetchCatalogProducts, fetchCategories, fetchCatalogBanner } from "@/actions/query";
import { CatalogManager } from "@/components/admin/catalog-manager";
import { CatalogBannerManager } from "@/components/admin/catalog-banner-manager";

export default async function AdminCatalogPage() {
  const [products, categories, banner] = await Promise.all([
    fetchCatalogProducts(),
    fetchCategories(),
    fetchCatalogBanner(),
  ]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Управление каталогом</h1>

      <div className="mb-10">
        <CatalogBannerManager initialBanner={banner || undefined} />
      </div>

      <div>
        <CatalogManager
          initialProducts={products}
          categories={categories}
        />
      </div>
    </div>
  );
}
