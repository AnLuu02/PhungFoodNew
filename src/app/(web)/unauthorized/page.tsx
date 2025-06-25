import { Button, Center } from '@mantine/core';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'Không có quyền',
  description: 'Không có quyền truy cập'
};
export default function UnauthorizedPage() {
  return (
    <Center className='flex-col'>
      <Image loading='lazy' src='/images/png/403.png' alt='403' width={400} height={400} objectFit='cover' />
      <h1 className='text-4xl font-bold text-red-500'>403 - Không có quyền truy cập</h1>
      <p className='mt-2 text-gray-600'>Bạn không có quyền truy cập vào trang này.</p>
      <Link href='/' className='mt-4 rounded-sm text-black hover:underline' prefetch={false}>
        <Button>Quay lại trang chủ</Button>
      </Link>
    </Center>
  );
}
