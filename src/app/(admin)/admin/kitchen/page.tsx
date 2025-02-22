import { fetchKitchenPage } from "@/actions/query";
import { KitchenPageManager } from "@/components/admin/kitchen-page-manager";

export default async function KitchenPageManagementPage() {
  const kitchenPageData = await fetchKitchenPage();

  console.log('Kitchen page management data:', {
    bannerExists: !!kitchenPageData.banner,
    sectionsCount: kitchenPageData.sections.length,
    collectionsCount: kitchenPageData.collections.length
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Kitchen Page Management</h1>
      <KitchenPageManager initialData={kitchenPageData} />
    </div>
  );
}
