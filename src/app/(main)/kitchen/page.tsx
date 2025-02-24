import { Suspense } from "react";
import KitchenContent from "./KitchenContent";
export const dynamic = 'force-dynamic';


export default function Kitchen() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KitchenContent />
    </Suspense>
  );
}
