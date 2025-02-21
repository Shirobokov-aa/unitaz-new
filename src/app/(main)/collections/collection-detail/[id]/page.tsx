import { Suspense } from "react";
import { CollectionContent } from "./CollectionContent";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function CollectionDetail({ params }: PageParams) {
  const resolvedParams = await params;
  if (!resolvedParams?.id) return notFound();

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
      </div>
    }>
      <CollectionContent params={resolvedParams} />
    </Suspense>
  );
}
