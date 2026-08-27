import { Button, Center, Image, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeftToArc } from '@tabler/icons-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Không có quyền',
  description: 'Bạn không có quyền truy cập vào trang này.'
};

export default function UnauthorizedPage() {
  return (
    <Center className='min-h-[calc(100dvh-var(--header-height,0px))] w-full bg-white px-5 py-10'>
      <Stack align='center' gap={0} className='w-full max-w-5xl text-center'>
        <Image
          src='/images/jpg/403-illustration.jpg'
          alt='403 - Không có quyền truy cập'
          fit='contain'
          loading='eager'
          fetchPriority='high'
          className='w-full max-w-[720px] sm:max-w-[760px] lg:max-w-[820px]'
        />

        <Title
          order={1}
          className='mt-2 font-quicksand text-3xl font-bold tracking-tight text-[#353268] sm:text-4xl md:text-[42px]'
        >
          Rất tiếc...
        </Title>

        <Text className='mt-4 max-w-[620px] px-2 text-sm leading-7 text-[#56536f] sm:text-base sm:leading-8'>
          Trang bạn đang cố truy cập bị giới hạn quyền truy cập.
          <br className='hidden sm:block' />
          Vui lòng liên hệ quản trị viên hệ thống nếu bạn cho rằng đây là một sự nhầm lẫn.
        </Text>

        <Button
          component={Link}
          href='/'
          size='lg'
          radius='xl'
          leftSection={<IconArrowLeftToArc size={20} stroke={2} />}
          className='mt-8 h-14 min-w-[190px] border-0 bg-[#19b5d1] px-8 font-quicksand text-base font-bold text-white shadow-[0_12px_30px_rgba(25,181,209,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#13a8c3] hover:shadow-[0_16px_35px_rgba(25,181,209,0.38)] active:translate-y-0 sm:min-w-[210px]'
        >
          Quay lại trang chủ
        </Button>
      </Stack>
    </Center>
  );
}
