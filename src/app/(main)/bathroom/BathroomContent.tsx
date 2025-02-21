import BathroomBanner from "@/components/bathroom/BathroomBanner";
import BathShower from "@/components/bathroom/BathShower";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import BathroomCollection from "@/components/bathroom/BathroomCollection";
import { fetchBathroomPage } from "@/actions/query";

export default async function BathroomPage() {
  const bathroom = await fetchBathroomPage();
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
                <BreadcrumbLink href="/bathroom">Ванная</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>
      <section>
        <BathroomBanner
          name={bathroom.banner?.name ?? ""}
          image={bathroom.banner?.image ?? ""}
          title={bathroom.banner?.title ?? ""}
          description={bathroom.banner?.description ?? ""}
          link={{
            text: bathroom.banner?.linkText ?? "",
            url: bathroom.banner?.linkUrl ?? "",
          }}
        />
      </section>
      {bathroom.sections.map((section, index) => (
        <section key={index}>
          <BathShower
            title={section.title ?? ""}
            description={section.description ?? ""}
            link={{
              text: section.linkText ?? "",
              url: section.linkUrl ?? "",
            }}
            images={section.images}
          />
        </section>
      ))}
      {bathroom.collections.map((collection, index) => (
        <section key={index}>
          <BathroomCollection
            title={collection.title ?? ""}
            description={collection.description ?? ""}
            link={{
              text: collection.linkText ?? "",
              url: collection.linkUrl ?? "",
            }}
            images={collection.images}
          />
        </section>
      ))}
    </>
  );
}
