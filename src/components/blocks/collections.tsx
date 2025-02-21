import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Link from "next/link";

interface Image {
  id: number;
  src: string;
  alt: string;
  desc: string;
  url: string;
}

interface CollectionsProps {
  images: { src: string; alt: string; desc: string; url: string }[];
}

export default function Collections({ images }: CollectionsProps) {
  return (
    <div>
      <Carousel>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="lg:basis-1/3 basis-1/2">
              <div className="relative">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={388}
                  height={388}
                  className="max-w-[388px] w-full h-auto"
                />
                <Link href={image.url} className="">
                  <div className="lg:block hidden absolute top-72 right-[17px] max-w-[167px] lg:py-6 py-4 lg:px-[60px] px-8 bg-[#3E3E3E] text-white">
                    <h2 className="lg:text-xl font-light border-b border-b-white">{image.desc}</h2>
                  </div>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
