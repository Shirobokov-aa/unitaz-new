import { ImageSlideManager } from "@/components/admin/image-slide-manager";
import type { ImageSlide } from "@/lib/db/schema";

interface ImageSlidesContentProps {
  initialSlides: ImageSlide[];
}

export function ImageSlidesContent({ initialSlides }: ImageSlidesContentProps) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Image Slides Management</h1>
      <ImageSlideManager initialSlides={initialSlides} />
    </div>
  );
}
