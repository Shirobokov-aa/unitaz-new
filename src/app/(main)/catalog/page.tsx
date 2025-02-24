import { Suspense } from "react";
import CatalogContent from "./CatalogContent";
export const dynamic = 'force-dynamic';


export default function Catalog() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
