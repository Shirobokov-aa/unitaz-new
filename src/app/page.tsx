import HomePage from "@/components/pages/home";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
