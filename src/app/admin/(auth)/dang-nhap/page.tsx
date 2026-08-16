import type { Metadata } from 'next';
import AdminLoginForm from '../components/AdminLoginForm';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Admin Login'
};

export default async function AdminLoginPage() {
  return <AdminLoginForm />;
}
