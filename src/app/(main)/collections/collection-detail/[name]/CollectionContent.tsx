import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import CollectionDetailBanner from "@/components/collection-detail/CollectionDetailBanner";
import CollectionDetailSection from "@/components/collection-detail/CollectionDetailSection";
import CollectionDetailSection2 from "@/components/collection-detail/CollectionDetailSection2";
import CollectionDetailSection3 from "@/components/collection-detail/CollectionDetailSection3";
import CollectionDetailSection4 from "@/components/collection-detail/CollectionDetailSection4";
import { fetchCollectionByName } from "@/actions/query";
import { notFound } from "next/navigation";

export async function CollectionContent({ params }: { params: { name: string } }) {
  const collection = await fetchCollectionByName(params.name);

  if (!collection) {
    return notFound();
  }

  const SECTION_COMPONENTS = {
    section: CollectionDetailSection,
    section2: CollectionDetailSection2,
    section3: CollectionDetailSection3,
    section4: CollectionDetailSection4,
  } as const;

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
                <BreadcrumbLink href="/collections">Коллекции</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/collections/collection-detail/${params.name.toLowerCase()}`}>
                  {collection.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>
      <CollectionDetailBanner
        name={collection.name}
        image={collection.bannerImage ?? ""}
        title={collection.bannerTitle ?? ""}
        description={collection.bannerDescription ?? ""}
        link={{
          text: collection.bannerLinkText ?? "",
          url: collection.bannerLinkUrl ?? "",
        }}
      />
      {Object.entries(SECTION_COMPONENTS).map(([type, Component]) =>
        collection.sections
          .filter((section) => section.type === type)
          .map((section, index) => (
            <Component
              key={section.id}
              title={section.title}
              description={section.description}
              images={section.images ?? []}
              link={section.linkText ? { text: section.linkText, url: section.linkUrl || "/" } : { text: "", url: "" }}
              {...(type === "section2"
                ? {
                    titleDesc: section.titleDesc ?? "",
                    descriptionDesc: section.descriptionDesc ?? "",
                  }
                : {
                    titleDesc: "",
                    descriptionDesc: "",
                  })}
              reverse={index % 2 !== 0}
            />
          ))
      )}
    </>
  );
}
