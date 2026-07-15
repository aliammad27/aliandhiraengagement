import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from '@/lib/adminAuth';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!isValidSessionToken(token)) {
    redirect('/admin/login');
  }

  return <AdminDashboard />;
}
