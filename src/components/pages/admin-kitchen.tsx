import { KitchenPageManager } from "@/components/admin/kitchen-page-manager";
import type { KitchenSection } from "@/lib/db/schema";

interface KitchenPageContentProps {
  kitchenPageData: {
    banner?: KitchenSection;
    sections?: KitchenSection[];
    collections?: KitchenSection[];
  };
}

export function KitchenPageContent({ kitchenPageData }: KitchenPageContentProps) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Kitchen Page Management</h1>
      <KitchenPageManager initialData={{
        banner: kitchenPageData.banner ?? {} as KitchenSection,
        sections: kitchenPageData.sections ?? [],
        collections: kitchenPageData.collections ?? []
      }} />
    </div>
  );
}
