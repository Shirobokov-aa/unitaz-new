import { Suspense } from 'react';
import AdminLoginContent from '@/components/pages/admin-login';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}
