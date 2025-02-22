import { fetchMainPage } from "@/actions/query";
import { MainSectionsManager } from "@/components/admin/main-sections-manager";

export default async function MainPageManagementPage() {
  const mainPageData = await fetchMainPage();

  console.log('Main page management data:', {
    hasIntro: !!mainPageData.intro,
    hasBanner: !!mainPageData.banner,
    hasFeature: !!mainPageData.feature,
    hasCollections: !!mainPageData.collections,
    hasShowcase: !!mainPageData.showcase,
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Main Page Management</h1>
      <MainSectionsManager initialSections={{
        intro: mainPageData.intro || null,
        banner: mainPageData.banner || null,
        feature: mainPageData.feature || null,
        collections: mainPageData.collections || null,
        showcase: mainPageData.showcase || null
      }} />
    </div>
  );
}
