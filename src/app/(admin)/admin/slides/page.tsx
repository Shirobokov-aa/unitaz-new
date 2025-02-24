import { Suspense } from "react";
import { ImageSlidesContent } from "@/components/pages/image-slides";
import { fetchSlides } from "@/actions/query";

export const dynamic = 'force-dynamic';

export default async function ImageSlidesPage() {
  const slides = await fetchSlides();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ImageSlidesContent initialSlides={slides} />
    </Suspense>
  );
}
