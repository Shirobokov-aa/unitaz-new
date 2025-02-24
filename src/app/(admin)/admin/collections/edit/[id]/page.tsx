import { Suspense } from "react";
import { fetchCollectionById } from "@/actions/query";
import { notFound } from "next/navigation";
import { CollectionDetailContent } from "@/components/pages/admin-collectionDetail";
import type { Collection, CollectionSection } from "@/lib/db/schema";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CollectionDetailPage({ params }: PageProps) {
  try {
    const collection = await fetchCollectionById(parseInt(params.id, 10)) as Collection & {
      sections: CollectionSection[];
    };

    if (!collection) {
      return notFound();
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <CollectionDetailContent collection={collection} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in CollectionDetailPage:', error);
    return notFound();
  }
}
