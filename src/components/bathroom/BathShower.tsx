import Link from "next/link";
import Image from "next/image";

interface ImageData {
  src: string;
  alt: string;
  desc?: string;
}

interface BathSectionProps {
  title: string;
  description: string;
  link: { text: string; url: string };
  images: ImageData[];
}

export default function BathShower({ title, description, link, images }: BathSectionProps) {
  // Добавим проверку данных
  console.log('BathShower props:', { title, description, link, imagesCount: images?.length });

  return (
    <section>
      <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-48">
        <div>
          <h2 className="lg:text-h2 text-h2Lg">{title}</h2>
          <p className="lg:text-desc pt-6">{description}</p>
        </div>
        <div>
          <div className="flex gap-5 pt-20">
            <div className="flex gap-5">
              {images?.slice(0, 3).map((image, index) => (
                <div key={index} className="max-w-[434px] w-full max-h-[434px] h-full gap-5">
                  <Image
                    src={image.src || "/img/fallback-image.png"}
                    alt={image.alt}
                    width={434}
                    height={434}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <Link href={link.url} className="text-desc border-b border-black">
              {link.text}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
