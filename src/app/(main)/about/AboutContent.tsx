import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import AboutBanner from "@/components/about/AboutBanner";
import AboutShower from "@/components/about/AboutShower";
import { fetchAboutPage } from "@/actions/query";

export default async function AboutPage() {
  const about = await fetchAboutPage();
  return (
    <>
      <section>
        <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-28">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/kitchen">О компании</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>
      <section>
        {about && (
          <AboutBanner
            name={about.bannerName}
            image={about.bannerImage}
            title={about.bannerTitle}
            description={about.bannerDescription}
            link={about.bannerLink}
          />
        )}
      </section>
      <section>
        {about &&
          about.sections.map((section, index) => (
            <section key={index}>
              <AboutShower {...section} />
            </section>
          ))}
      </section>
    </>
  );
}
