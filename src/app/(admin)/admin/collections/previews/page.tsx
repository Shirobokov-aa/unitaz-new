import { CollectionPreviewManager } from "@/components/admin/collection-managers/collection-preview-manager";
import { fetchCollections } from "@/actions/query";

export default async function CollectionPreviewsPage() {
  const collections = await fetchCollections();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Управление превью коллекций</h1>
      <CollectionPreviewManager initialData={collections} />
    </div>
  );
}
