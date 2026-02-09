import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminLoginForm } from '@/components/admin/admin-login-form';

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  // If already logged in and admin, redirect to dashboard
  if (session && (session.user as any).role === 'ADMIN') {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Administration Ecomm Burkina
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accès réservé aux administrateurs
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
