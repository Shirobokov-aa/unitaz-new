import { useMemo } from "react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Collections from "./blocks/collections";
import { Button } from "@/components/ui/button";
import ImageBlock from "./blocks/image-block";
import { MainSection } from "@/lib/db/schema";

const IntroSection = ({ data }: { data: MainSection }) => (
  <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-10">
    <div className="flex xl:flex-row flex-col lg:gap-20 gap-10">
      <div className="flex flex-col justify-between">
        <div className="max-w-[520px] flex flex-col gap-14">
          <h2 className="lg:text-h2 text-h2Lg">{data.title}</h2>
          <p className="text-desc">{data.description}</p>
        </div>
        <div className="flex xl:flex-col flex-col pt-5 gap-10">
          {data.linkUrl && (
            <div>
              <Link href={data.linkUrl} className="text-desc border-b border-black">
                {data.linkName}
              </Link>
            </div>
          )}
          <div className="flex justify-between xl:gap-20 gap-5">
            {data.imageBlockSrcs?.map((src, index) => (
              <div key={index} className="xl:max-w-[270px] w-full xl:max-h-[270px] h-full">
                <Image
                  src={src || "/img/fallback-image.png"}
                  alt={data.imageBlockAlts?.[index] || "Fallback image"}
                  width={350}
                  height={350}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-full flex justify-center items-center">
        <Image
          src={data.mainImage || "/img/fallback-image.png"}
          alt=""
          width={570}
          height={500}
          className="object-contain"
        />
      </div>
    </div>
  </div>
);

const BannerSection = ({ data }: { data: MainSection }) => (
  <div className="lg:block hidden max-w-1440 mx-auto lg:px-24 px-5 pt-24">
    <div className="relative w-full xl:h-[780px]">
      <Image
        src={data.mainImage || "/img/fallback-image.png"}
        alt=""
        width={1240}
        height={780}
        className="object-contain"
      />
      {data.linkUrl && (
        <Link href={data.linkUrl}>
          <div className="absolute top-24 left-0 lg:py-9 py-7 lg:px-[150px] px-24 bg-[#1E1E1E] text-white">
            <h2 className="lg:text-xl font-light border-b border-b-white">{data.linkName}</h2>
          </div>
        </Link>
      )}
    </div>
  </div>
);

const FeatureSection = ({ data }: { data: MainSection }) => (
  <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-24">
    <div className="flex xl:flex-row flex-col-reverse xl:gap-24 gap-5">
      <div className="xl:max-w-[526px] w-full">
        <Image
          src={data.mainImage || "/img/fallback-image.png"}
          alt=""
          width={526}
          height={526}
          className="object-contain"
        />
      </div>
      <div className="xl:max-w-[614px] w-full flex flex-col justify-between">
        <div className="flex flex-col gap-11">
          <h2 className="lg:text-h2 text-h2Lg">{data.title}</h2>
          <p className="lg:text-desc">{data.description}</p>
        </div>
        {data.linkUrl && (
          <div className="xl:pt-0 pt-10">
            <Link href={data.linkUrl} className="text-desc border-b border-black">
              {data.linkName}
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
);

const CollectionsSection = ({ data }: { data: MainSection }) => {
  const images = useMemo(() => {
    return (
      data.imageBlockSrcs?.map((src, index) => ({
        src,
        alt: data.imageBlockAlts?.[index] || "",
        desc: data.imageBlockDescs?.[index] || "",
        url: data.linkUrl || "/",
      })) || []
    );
  }, [data]);

  return (
    <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-24">
      <div>
        <h2 className="lg:text-h2 text-h2Lg">{data.title}</h2>
        <p className="lg:text-desc py-7">{data.description}</p>
      </div>
      <div>
        <Collections images={images} />
      </div>
      {data.linkUrl && (
        <div className="flex justify-center items-center pt-16">
          <Link href={data.linkUrl} className="lg:max-w-[466px] max-w-[325px] w-full lg:h-[89px] h-[55px]">
            <Button className="max-w-[466px] w-full lg:h-[89px] h-[55px] flex justify-center items-center rounded-none bg-[#3E3E3E] text-xl underline">
              {data.linkName}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

const ShowcaseSection = ({ data }: { data: MainSection }) => (
  <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-24">
    <div className="flex xl:flex-row flex-col-reverse gap-5">
      <ImageBlock
        images={
          data.imageBlockSrcs?.map((src, index) => ({
            src,
            alt: data.imageBlockAlts?.[index] || "",
            desc: data.imageBlockDescs?.[index] || "",
          })) || []
        }
      />
      <div className="xl:max-w-[400px] w-full flex flex-col justify-between">
        <div>
          <h2 className="lg:text-h2 text-h2Lg">{data.title}</h2>
          <p className="lg:text-desc pt-[45px]">{data.description}</p>
        </div>
        {data.linkUrl && (
          <div className="xl:pt-0 pt-11">
            <Link href={data.linkUrl} className="text-desc border-b">
              {data.linkName}
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
);

const SECTION_COMPONENTS: Record<string, React.ComponentType<{ data: MainSection }>> = {
  intro: IntroSection,
  banner: BannerSection,
  feature: FeatureSection,
  collections: CollectionsSection,
  showcase: ShowcaseSection,
};

export default function Main({ ...mainPage }: Record<string, MainSection[]>) {
  return (
    <main>
      {Object.entries(mainPage).map(([key, sections]) => {
        const SectionComponent = SECTION_COMPONENTS[key];
        const sectionData = sections[0];

        return SectionComponent && sectionData ? (
          <section key={key}>
            <SectionComponent data={sectionData} />
          </section>
        ) : null;
      })}
    </main>
  );
}
