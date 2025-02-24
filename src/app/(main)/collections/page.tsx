import CollectionsPage from "@/components/pages/collections";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default function Collections () {
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <CollectionsPage />
    </Suspense>
  )
}
