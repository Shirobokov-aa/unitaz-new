import { Suspense } from "react";
import KitchenContent from "./KitchenContent";

export default function Kitchen() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KitchenContent />
    </Suspense>
  );
}
