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
  link: { text: string; url: string };
  images: ImageData[];
  reverse?: boolean;
}

export default function CollectionDetailSection({ title, description, link, images, reverse = false }: SectionProps) {
  return (
    <section>
      <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-48">
        <div
          className={`flex ${
            reverse ? "xl:flex-row-reverse" : "xl:flex-row"
          } xl:justify-between flex-col-reverse gap-5`}
        >
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
            <div className="max-w-[520px] w-full max-h-[520px] h-full">
              {images.length > 0 && (
                <Image src={images[0].src || "/img/fallback-image.png"} alt={images[0].alt} width={520} height={518} />
              )}
            </div>
            <div className="flex flex-col gap-5">
              {images.slice(1, 3).map((image, index) => (
                <div key={index} className="max-w-[250px] w-full max-h-[250px] h-full">
                  <Image src={image.src || "/img/fallback-image.png"} alt={image.alt} width={250} height={250} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
