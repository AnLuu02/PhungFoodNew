import { Button, Center, Image, Text, Title } from '@mantine/core';
import { IconArrowLeftToArc } from '@tabler/icons-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Không có quyền',
  description: 'Không có quyền truy cập'
};
export default function UnauthorizedPage() {
  return (
    <Center className='flex-col'>
      <Image loading='lazy' src='/images/png/403.png' alt='403' w={400} style={{ objectFit: 'cover' }} />
      <Title order={1} className='font-quicksand text-4xl font-bold text-red-500'>
        403 - Không có quyền truy cập
      </Title>
      <Text className='mt-2 text-gray-600 dark:text-dark-text'>Bạn không có quyền truy cập vào trang này.</Text>
      <Link href='/' className='mt-4 text-black hover:underline'>
        <Button variant='danger' leftSection={<IconArrowLeftToArc size={16} />}>
          Quay lại trang chủ
        </Button>
      </Link>
    </Center>
  );
}
