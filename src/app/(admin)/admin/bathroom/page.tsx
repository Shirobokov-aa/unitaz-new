import { fetchBathroomPage } from "@/actions/query";
import { BathroomPageManager } from "@/components/admin/bathroom-page-manager";

export default async function BathroomPageManagementPage() {
  const bathroomPageData = await fetchBathroomPage();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Bathroom Page Management</h1>
      <BathroomPageManager initialData={bathroomPageData} />
    </div>
  );
}
