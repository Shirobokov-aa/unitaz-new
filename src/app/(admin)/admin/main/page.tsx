import { Suspense } from "react";
import { fetchMainPage } from "@/actions/query";
import { MainPageContent } from "@/components/pages/admin-main";

export const dynamic = 'force-dynamic';

export default async function MainPageManagementPage() {
  const mainPageData = await fetchMainPage();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainPageContent mainPageData={mainPageData} />
    </Suspense>
  );
}
