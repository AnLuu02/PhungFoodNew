import { Metadata } from 'next';
import LoginForm from '../components/LoginForm';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Đăng nhập - Phụng Food',
  description: 'Đăng nhập vào tài khoản của bạn',
  robots: {
    index: false,
    follow: false
  }
};

export default function LoginPage() {
  return <LoginForm />;
}
