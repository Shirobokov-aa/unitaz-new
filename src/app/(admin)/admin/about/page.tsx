import { fetchAboutPage } from "@/actions/query";
import { AboutPageManager } from "@/components/admin/about-page-manager";

export default async function AboutPageManagementPage() {
  const aboutPageData = await fetchAboutPage();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Редактирования о Компании</h1>
      <AboutPageManager initialData={aboutPageData} />
    </div>
  );
}
