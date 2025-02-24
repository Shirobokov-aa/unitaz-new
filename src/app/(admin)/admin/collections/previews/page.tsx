import { Suspense } from "react";
import { fetchCollections } from "@/actions/query";
import { CollectionPreviewsContent } from "@/components/pages/admin-collections-previews";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CollectionPreviewsPage() {
  const collections = await fetchCollections();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollectionPreviewsContent collections={collections} />
    </Suspense>
  );
}
