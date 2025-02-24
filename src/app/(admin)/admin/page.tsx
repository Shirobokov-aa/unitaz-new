import { Suspense } from "react";
import AdminDashboardPage from "@/components/pages/admin-dashboard";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboardPage />
    </Suspense>
  );
}
