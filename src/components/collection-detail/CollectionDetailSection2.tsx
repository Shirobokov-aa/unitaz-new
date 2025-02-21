import Link from "next/link";
import Image from "next/image";

interface ImageData {
  src: string;
  alt: string;
  desc?: string;
}

interface SectionProps {
  title: string;
  description: string;
  titleDesc: string;
  descriptionDesc: string;
  link: { text: string; url: string };
  images: ImageData[];
  reverse?: boolean;
}

export default function CollectionDetailSection({
  title,
  description,
  link,
  images,
  titleDesc,
  descriptionDesc,
}: SectionProps) {
  return (
    <section>
      <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-48">
        <div className="flex xl:flex-row xl:justify-between flex-col-reverse gap-5">
          <div className="xl:max-w-[400px] w-full flex flex-col justify-between">
            <div>
              <h2 className="lg:text-h2 text-h2Lg">{title}</h2>
              <p className="lg:text-desc pt-[45px]">{description}</p>
            </div>
            <div className="xl:pt-0 pt-11">
              <Link href={link.url} className="text-desc border-b">
                {link.text}
              </Link>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="max-w-[520px] w-full max-h-[700px] h-full">
              {images.length > 0 && (
                <Image src={images[0].src || "/img/fallback-image.png"} alt={images[0].alt} width={520} height={518} />
              )}
              <div className="pt-5">
                <h2 className="lg:text-2xl text-lg font-semibold">{titleDesc}</h2>
                <p className="lg:text-desc text-gray-600 pt-5">{descriptionDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
