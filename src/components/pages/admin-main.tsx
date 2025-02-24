import { MainSectionsManager } from "@/components/admin/main-sections-manager";
import type { MainSection } from "@/lib/db/schema";

type SectionType = "intro" | "banner" | "feature" | "collections" | "showcase";

interface MainPageContentProps {
  mainPageData: Record<SectionType, MainSection | null>;
}

export function MainPageContent({ mainPageData }: MainPageContentProps) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Main Page Management</h1>
      <MainSectionsManager initialSections={mainPageData} />
    </div>
  );
}
