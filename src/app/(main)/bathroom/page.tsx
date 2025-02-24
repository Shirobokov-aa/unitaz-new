import { Suspense } from "react";
import BathroomContent from "./BathroomContent";
export const dynamic = 'force-dynamic';


export default function Bathroom() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BathroomContent />
    </Suspense>
  );
}
