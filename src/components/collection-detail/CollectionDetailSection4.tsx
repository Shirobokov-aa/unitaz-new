// import Link from "next/link";
import Image from "next/image";

interface ImageData {
  src: string;
  alt: string;
  desc?: string;
}

interface SectionProps {
  title: string;
  description: string;
  images: ImageData[];
  reverse?: boolean;
}

export default function CollectionDetailSection({ title, description, images }: SectionProps) {
  return (
    <section>
      <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-48">
        <div className="flex xl:justify-between flex-col gap-5">
          <div className="xl:max-w-[400px] w-full flex flex-col justify-between">
            <div>
              <h2 className="lg:text-h2 text-h2Lg">{title}</h2>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="flex gap-5">
              {images.slice(0, 3).map((image, index) => (
                <div key={index} className="max-w-[434px] w-full max-h-[434px] h-full gap-5">
                  <Image src={image.src || "/img/fallback-image.png"} alt={image.alt} width={434} height={434} />
                  <p className="lg:text-desc pt-5">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
