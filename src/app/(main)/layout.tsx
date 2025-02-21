import { fetchCategories } from "@/actions/query";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const categories = await fetchCategories();

  return (
    <div>
      <Header categories={categories} defaultTextColor="text-black" activeTextColor="text-black" />
      {children}
      <Footer />
    </div>
  );
}
