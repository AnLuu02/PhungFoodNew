import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { api } from '~/trpc/server';
import FormResetPassword from './components/Form';
export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu',
  description: 'Nhập email để nhận liên kết đặt lại mật khẩu',
  robots: {
    index: false,
    follow: false
  }
};

export default async function ResetPassword({
  searchParams
}: {
  searchParams: {
    email: string;
    token: string;
  };
}) {
  const email = decodeURIComponent(searchParams?.email) || '';
  const token = searchParams.token || '';
  try {
    await api.User.verifyOtp({ email, token });
    return <FormResetPassword email={email} token={token} />;
  } catch {
    redirect('/error?reason=time_out');
  }
}
