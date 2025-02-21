import { Suspense } from "react";
import { CollectionContent } from "./CollectionContent";

export default function CollectionDetail({ params }: { params: { name: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollectionContent params={params} />
    </Suspense>
  );
}
