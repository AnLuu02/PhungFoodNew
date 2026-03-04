import { Center, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle, IconHome, IconLock, IconLogin2 } from '@tabler/icons-react';
import Link from 'next/link';
import BButton from '~/components/Button/Button';
const messages: Record<
  string,
  { title: string; desc: string; icon: React.ReactNode; color: string; retryUrl: string }
> = {
  locked: {
    title: 'Tài khoản bị khóa',
    desc: 'Tài khoản của bạn tạm thời bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau hoặc liên hệ quản trị viên.',
    icon: <IconLock size={60} stroke={1.5} className='text-red-500' />,
    color: '#DC2626',
    retryUrl: '/dang-nhap'
  },
  invalid: {
    title: 'Đăng nhập không hợp lệ',
    desc: 'Thông tin đăng nhập không đúng hoặc tài khoản không tồn tại.',
    icon: <IconAlertTriangle size={60} stroke={1.5} className='text-yellow-500' />,
    color: '#F8C144',
    retryUrl: '/dang-nhap'
  },
  oauth_error: {
    title: 'Đăng nhập thất bại',
    desc: 'Có lỗi xảy ra khi xác thực với Google. Vui lòng thử lại.',
    icon: <IconAlertTriangle size={60} stroke={1.5} className='text-red-500' />,
    color: '#DC2626',
    retryUrl: '/dang-nhap'
  },
  time_out: {
    title: 'Token hết hạn',
    desc: 'Token của bạn không tồn tại hoặc đã hết hạn.',
    icon: <IconAlertTriangle size={60} stroke={1.5} className='text-red-500' />,
    color: '#DC2626',
    retryUrl: 'password/forgot-password'
  },
  unknown: {
    title: 'Lỗi không xác định',
    desc: 'Có lỗi bất ngờ xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau.',
    icon: <IconAlertTriangle size={60} stroke={1.5} className='text-gray-500' />,
    color: '#6B7280',
    retryUrl: '/dang-nhap'
  }
};

export default function AuthErrorPage({
  searchParams
}: {
  searchParams: {
    reason?: string;
  };
}) {
  const reason = searchParams.reason || 'unknown';
  const { title, desc, icon, retryUrl, color } = messages[reason] || (messages.unknown as any);

  return (
    <Center>
      <div className='animate-fadeUp'>
        <Paper shadow='xl' radius='lg' p='xl' withBorder className='animate-scaleIn' bg={color + 10}>
          <Stack align='center' gap='md' maw={400}>
            <div className='animate-bounceSlow'>{icon}</div>
            <Title order={3} ta='center' className='font-quicksand'>
              {title}
            </Title>
            <Text ta='center' c='dimmed' fz='sm'>
              {desc}
            </Text>
            <Group mt='md'>
              <Link href={retryUrl}>
                <BButton
                  w={'max-content'}
                  leftSection={<IconLogin2 size={16} />}
                  bg={'#DC2626'}
                  c={'white'}
                  className={`hover:scale-[1.09]`}
                >
                  Thử lại
                </BButton>
              </Link>
              <Link href={'/'}>
                <BButton
                  variant='outline'
                  leftSection={<IconHome size={16} />}
                  className={`border-[${color}] hover:scale-[1.09]`}
                >
                  Trang chủ
                </BButton>
              </Link>
            </Group>
          </Stack>
        </Paper>
      </div>
    </Center>
  );
}
