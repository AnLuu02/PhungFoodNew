import type { Metadata } from 'next';
import AdminLoginForm from '~/app/admin/(auth)/components/admin-login-form';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Admin Login'
};

export default async function AdminLoginPage() {
  return <AdminLoginForm />;
}
