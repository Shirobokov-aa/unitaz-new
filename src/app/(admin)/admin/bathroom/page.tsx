import BathroomPageManagementPageContent from "@/components/pages/admin-bathroom";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default function BathroomPage() {
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <BathroomPageManagementPageContent />
    </Suspense>
  )
}
