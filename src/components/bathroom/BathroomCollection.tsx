import Link from "next/link";
import ImageBlock from "../blocks/image-block";

interface ImageData {
  src: string;
  alt: string;
  desc?: string;
}

interface BathSectionCollectionProps {
  title: string;
  description: string;
  link: { text: string; url: string };
  images: ImageData[];
}

export default function BathroomCollection({ title, description, link, images }: BathSectionCollectionProps) {
  return (
    <section>
      <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-24">
        <div className="flex xl:flex-row flex-col-reverse gap-5">
          <ImageBlock images={images} />
          <div className="xl:max-w-[400px] w-full flex flex-col justify-between">
            <div>
              <h2 className="lg:text-h2 text-h2Lg">{title}</h2>
              <p className="lg:text-desc pt-[45px]">{description}</p>
            </div>
            <div className="xl:pt-0 pt-11">
              <Link href={link?.url} className="text-desc border-b">
                {link?.text}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
