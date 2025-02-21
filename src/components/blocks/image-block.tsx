import Image from "next/image";

interface ImageData {
  src: string;
  alt: string;
  desc?: string;
}
interface ImageBlockProps {
  images: ImageData[];
}

export default function ImageBlock({ images = [] }: ImageBlockProps) {
  return (
    <div className="flex lg:flex-row flex-col gap-5 items-center">
      <div className="max-w-[520px] w-full max-h-[520px] h-full">
        {images.length > 0 && (
          <Image
            src={images[0].src || "/img/fallback-image.png"}
            alt={images[0].alt}
            width={520}
            height={518}
            className=""
          />
        )}
      </div>
      <div className="flex lg:flex-col flex-row gap-5">
        {images.slice(1, 3).map((image, index) => (
          <div key={index} className="max-w-[250px] w-full max-h-[250px] h-full">
            <Image src={image.src || "/img/fallback-image.png"} alt={image.alt} width={250} height={250} />
          </div>
        ))}
      </div>
    </div>
  );
}
