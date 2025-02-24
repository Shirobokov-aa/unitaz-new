import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CollectionDetailManager } from "@/components/admin/collection-managers/collection-detail-manager";
import type { Collection, CollectionSection } from "@/lib/db/schema";

interface CollectionDetailContentProps {
  collection: Collection & {
    sections: CollectionSection[];
  };
}

export function CollectionDetailContent({ collection }: CollectionDetailContentProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Редактирование коллекции</h1>
        <Button asChild variant="outline">
          <Link href="/admin/collections/previews">Назад к списку</Link>
        </Button>
      </div>
      <CollectionDetailManager initialData={collection} />
    </div>
  );
}
