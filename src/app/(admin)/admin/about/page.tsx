import AboutPageManagementPage from "@/components/pages/admin-about";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutPageManagementPage />
    </Suspense>
  );
}
