'use client';

import { Center, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle, IconHome, IconLock, IconLogin2 } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import BButton from '~/components/Button/Button';

const messages: Record<string, { title: string; desc: string; icon: React.ReactNode; color: string }> = {
  locked: {
    title: 'Tài khoản bị khóa',
    desc: 'Tài khoản của bạn tạm thời bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau hoặc liên hệ quản trị viên.',
    icon: <IconLock size={60} stroke={1.5} className='text-red-500' />,
    color: 'red'
  },
  invalid: {
    title: 'Đăng nhập không hợp lệ',
    desc: 'Thông tin đăng nhập không đúng hoặc tài khoản không tồn tại.',
    icon: <IconAlertTriangle size={60} stroke={1.5} className='text-yellow-500' />,
    color: 'yellow'
  },
  oauth_error: {
    title: 'Đăng nhập thất bại',
    desc: 'Có lỗi xảy ra khi xác thực với Google. Vui lòng thử lại.',
    icon: <IconAlertTriangle size={60} stroke={1.5} className='text-red-500' />,
    color: 'red'
  },
  unknown: {
    title: 'Lỗi không xác định',
    desc: 'Có lỗi bất ngờ xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau.',
    icon: <IconAlertTriangle size={60} stroke={1.5} className='text-gray-500' />,
    color: 'gray'
  }
};
export default function AuthErrorPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'unknown';

  const { title, desc, icon } = messages[reason] || (messages.unknown as any);

  return (
    <Center>
      <div className='animate-fadeUp'>
        <Paper shadow='xl' radius='lg' p='xl' withBorder className='animate-scaleIn'>
          <Stack align='center' gap='md' maw={400}>
            <div className='animate-bounceSlow'>{icon}</div>
            <Title order={3} ta='center' className='font-quicksand'>
              {title}
            </Title>
            <Text ta='center' c='dimmed' fz='sm'>
              {desc}
            </Text>
            <Group mt='md'>
              <BButton
                w={'max-content'}
                leftSection={<IconLogin2 size={16} />}
                onClick={() => router.push('/dang-nhap')}
              >
                Đăng nhập lại
              </BButton>
              <BButton variant='outline' leftSection={<IconHome size={16} />} onClick={() => router.push('/')}>
                Trang chủ
              </BButton>
            </Group>
          </Stack>
        </Paper>
      </div>
    </Center>
  );
}
