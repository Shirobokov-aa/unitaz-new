import { Suspense } from "react";
import { fetchKitchenPage } from "@/actions/query";
import { KitchenPageContent } from "@/components/pages/admin-kitchen";

export const dynamic = 'force-dynamic';

export default async function KitchenPageManagementPage() {
  const kitchenPageData = await fetchKitchenPage();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KitchenPageContent kitchenPageData={kitchenPageData} />
    </Suspense>
  );
}
