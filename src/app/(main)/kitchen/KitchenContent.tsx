import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

import KitchenCollection from "@/components/kitchen/KitchenCollection";
import KitchenBanner from "@/components/kitchen/KitchenBanner";
import KitchenShower from "@/components/kitchen/KitchenShower";
import { fetchKitchenPage } from "@/actions/query";
// export const dynamic = 'force-dynamic';


export default async function KitchenPage() {
  const kitchen = await fetchKitchenPage();
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
                <BreadcrumbLink href="/kitchen">Кухня</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>
      <section>
        <KitchenBanner
          name={kitchen.banner?.name ?? ""}
          image={kitchen.banner?.image ?? ""}
          title={kitchen.banner?.title ?? ""}
          description={kitchen.banner?.description ?? ""}
          link={{
            text: kitchen.banner?.linkText ?? "",
            url: kitchen.banner?.linkUrl ?? "",
          }}
        />
      </section>
      {kitchen.sections.map((section, index) => (
        <section key={index}>
          <KitchenShower
            title={section.title ?? ""}
            description={section.description ?? ""}
            link={{
              text: section.linkText ?? "",
              url: section.linkUrl ?? "",
            }}
            images={section.images ?? []}
          />
        </section>
      ))}
      {kitchen.collections.map((collection, index) => (
        <section key={index}>
          <KitchenCollection
            title={collection.title ?? ""}
            description={collection.description ?? ""}
            link={{
              text: collection.linkText ?? "",
              url: collection.linkUrl ?? "",
            }}
            images={collection.images ?? []}
          />
        </section>
      ))}
    </>
  );
}
