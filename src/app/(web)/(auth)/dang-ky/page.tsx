import { Metadata } from 'next';
import RegisterForm from '../components/RegisterForm';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Đăng ký - Phụng Food',
  description: 'Đăng ký tài khoản mới',
  robots: {
    index: false,
    follow: false
  }
};
export default function RegisterPage() {
  return <RegisterForm />;
}
