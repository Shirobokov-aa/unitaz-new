import { Suspense } from "react";
import AboutContent from "./AboutContent";

export default function Kitchen() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutContent />
    </Suspense>
  );
}
