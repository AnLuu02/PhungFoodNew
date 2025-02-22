import { Button, Center, Image } from '@mantine/core';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <Center className='flex-col'>
      <Image loading='lazy' src='/images/png/403.png' alt='403' w={400} h={400} />
      <h1 className='text-4xl font-bold text-red-500'>403 - Không có quyền truy cập</h1>
      <p className='mt-2 text-gray-600'>Bạn không có quyền truy cập vào trang này.</p>
      <Link href='/' className='mt-4 rounded-sm text-black no-underline hover:underline'>
        <Button>Quay lại trang chủ</Button>
      </Link>
    </Center>
  );
}
