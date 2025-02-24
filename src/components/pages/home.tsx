import { fetchCategories, fetchMainPage, fetchSlides } from "@/actions/query";
import { BannerSlider } from "@/components/blocks/banner-slider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Main from "@/components/Main";
// export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const categories = await fetchCategories();
  const slides = await fetchSlides();
  const mainPage = await fetchMainPage();
  return (
    <div>
      <Header categories={categories} />
      <BannerSlider slides={slides} />
      <Main
        intro={mainPage.intro ? [mainPage.intro] : []}
        banner={mainPage.banner ? [mainPage.banner] : []}
        feature={mainPage.feature ? [mainPage.feature] : []}
        collections={mainPage.collections ? [mainPage.collections] : []}
      />
      <Footer />
    </div>
  );
}
