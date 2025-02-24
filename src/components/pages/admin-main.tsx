import { MainSectionsManager } from "@/components/admin/main-sections-manager";
import type { MainSection } from "@/lib/db/schema";

interface MainPageContentProps {
  mainPageData: {
    intro?: MainSection | null;
    banner?: MainSection | null;
    feature?: MainSection | null;
    collections?: MainSection | null;
    showcase?: MainSection | null;
  };
}

export function MainPageContent({ mainPageData }: MainPageContentProps) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Main Page Management</h1>
      <MainSectionsManager initialSections={{
        intro: mainPageData.intro ?? null,
        banner: mainPageData.banner ?? null,
        feature: mainPageData.feature ?? null,
        collections: mainPageData.collections ?? null,
        showcase: mainPageData.showcase ?? null
      }} />
    </div>
  );
}
