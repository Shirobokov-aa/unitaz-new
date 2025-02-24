import { CollectionPreviewManager } from "@/components/admin/collection-managers/collection-preview-manager";

interface CollectionPreview {
  id: number;
  link: string;
  title: string;
  image: string;
  desc: string;
  flexDirection: "xl:flex-row" | "xl:flex-row-reverse";
}

interface CollectionPreviewsContentProps {
  collections?: CollectionPreview[];
}

export function CollectionPreviewsContent({ collections }: CollectionPreviewsContentProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление превью коллекций</h1>
      </div>
      <CollectionPreviewManager initialData={collections ?? []} />
    </div>
  );
}
