import { fetchSlides } from "@/actions/query";
import { ImageSlideManager } from "@/components/admin/image-slide-manager";

export default async function ImageSlidesPage() {
  const slides = await fetchSlides();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Image Slides Management</h1>
      <ImageSlideManager initialSlides={slides} />
    </div>
  );
}
