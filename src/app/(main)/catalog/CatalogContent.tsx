import { fetchCatalogProducts, fetchCategories, fetchCatalogFilters, fetchCatalogBanner } from "@/actions/query";
import { ProductGrid } from "@/components/cataog/product-grid"
import { FilterBar } from "@/components/cataog/filter-bar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import CatalogBanner from "@/components/cataog/CatalogBanner";


export default async function CatalogContent() {
  // Получаем все необходимые данные
  const [products, categories, filters, banner] = await Promise.all([
    fetchCatalogProducts(),
    fetchCategories(),
    fetchCatalogFilters(),
    fetchCatalogBanner(),
  ]);

  // Получаем общее количество товаров
  const totalProducts = products.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <section>
        <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-28">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/catalog">Каталог</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>
      <section>
        <CatalogBanner
          name={banner?.name ?? ""}
          image={banner?.image ?? ""}
          title={banner?.title ?? ""}
          description={banner?.description ?? ""}
          link={{
            text: banner?.linkText ?? "",
            url: banner?.linkUrl ?? "",
          }}
        />
      </section>
      <h1 className="text-4xl font-normal mb-4">Каталог</h1>
      <p className="text-gray-600 mb-8">
        Выберите интересующую вас категорию или воспользуйтесь фильтрами для поиска конкретных товаров
      </p>
      <div className="text-sm text-gray-500 mb-4">
        {totalProducts} {getTotalProductsText(totalProducts)}
      </div>
      <FilterBar
        filters={filters}
        categories={categories}
      />
      <ProductGrid products={products} />
      {totalProducts > 15 && (
        <div className="flex justify-center mt-8">
          <button className="border border-black px-8 py-3 flex items-center gap-2">
            Показать еще
            <span className="text-sm text-gray-500">15 из {totalProducts}</span>
          </button>
        </div>
      )}
    </div>
  )
}

// Вспомогательная функция для правильного склонения
function getTotalProductsText(total: number): string {
  const cases = [2, 0, 1, 1, 1, 2];
  const titles = ['товар', 'товара', 'товаров'];
  return titles[
    total % 100 > 4 && total % 100 < 20
      ? 2
      : cases[total % 10 < 5 ? total % 10 : 5]
  ];
}
