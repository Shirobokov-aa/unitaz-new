// import { CollectionPreviewManager } from "@/components/admin/collection-managers/collection-preview-manager";
// import { fetchCollections } from "@/actions/query";

// export default async function CollectionPreviewsPage() {
//   const collections = await fetchCollections();

//   return (
//     <div className="container mx-auto py-10">
//       <h1 className="text-3xl font-bold mb-6">Управление превью коллекций</h1>
//       <CollectionPreviewManager initialData={collections} />
//     </div>
//   );
// }


import { CollectionPreviewManager } from "@/components/admin/collection-managers/collection-preview-manager";
import { fetchCollections } from "@/actions/query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Управление коллекциями | Админ панель",
  description: "Управление превью коллекций в административной панели",
};

// Отключаем кеширование для динамического контента
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CollectionPreviewsPage() {
  try {
    const collections = await fetchCollections();

    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Управление превью коллекций</h1>
          <div className="flex gap-4">
            {/* Здесь можно добавить дополнительные действия */}
          </div>
        </div>
        <CollectionPreviewManager initialData={collections} />
      </div>
    );
  } catch (error) {
    console.error('Ошибка загрузки коллекций:', error);
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <h2 className="text-red-700 font-semibold">Ошибка загрузки данных</h2>
          <p className="text-red-600">Не удалось загрузить список коллекций. Пожалуйста, попробуйте позже.</p>
        </div>
      </div>
    );
  }
}
