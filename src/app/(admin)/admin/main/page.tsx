import { Suspense } from "react";
import { fetchMainPage } from "@/actions/query";
import { MainPageContent } from "@/components/pages/admin-main";

export const dynamic = 'force-dynamic';

export default async function MainPageManagementPage() {
  const rawData = await fetchMainPage();

  const mainPageData = {
    intro: rawData.intro || null,
    banner: rawData.banner || null,
    feature: rawData.feature || null,
    collections: rawData.collections || null,
    showcase: rawData.showcase || null
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainPageContent mainPageData={mainPageData} />
    </Suspense>
  );
}
