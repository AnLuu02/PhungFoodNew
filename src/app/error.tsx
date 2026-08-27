'use client';

import { Button, Center, Image, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeftToArc, IconRefresh } from '@tabler/icons-react';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Center className='min-h-[calc(100dvh-var(--header-height,0px))] w-full bg-white px-5 py-10'>
      <Stack align='center' gap={0} className='w-full max-w-5xl text-center'>
        <Image
          src='/images/png/500-illustration.png'
          alt='500 - Lỗi máy chủ nội bộ'
          fit='contain'
          loading='eager'
          fetchPriority='high'
          className='w-full max-w-[720px] sm:max-w-[760px] lg:max-w-[820px]'
        />

        <Title
          order={1}
          className='mt-2 font-quicksand text-3xl font-bold tracking-tight text-[#353268] sm:text-4xl md:text-[42px]'
        >
          Đã có lỗi xảy ra...
        </Title>

        <Text className='mt-4 max-w-[620px] px-2 text-sm leading-7 text-[#56536f] sm:text-base sm:leading-8'>
          Chúng tôi đang gặp sự cố máy chủ nội bộ.
          <br className='hidden sm:block' />
          Vui lòng thử lại sau hoặc quay về trang chủ.
        </Text>

        <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row'>
          <Button
            size='lg'
            radius='xl'
            leftSection={<IconRefresh size={20} stroke={2} />}
            onClick={() => reset()}
            className='h-14 min-w-[190px] border-0 bg-[#19b5d1] px-8 font-quicksand text-base font-bold text-white shadow-[0_12px_30px_rgba(25,181,209,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#13a8c3] hover:shadow-[0_16px_35px_rgba(25,181,209,0.38)] active:translate-y-0 sm:min-w-[210px]'
          >
            Thử lại
          </Button>

          <Button
            component='a'
            href='/'
            size='lg'
            radius='xl'
            variant='subtle'
            leftSection={<IconArrowLeftToArc size={20} stroke={2} />}
            className='h-14 min-w-[190px] px-8 font-quicksand text-base font-semibold text-[#353268] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#353268]/5 active:translate-y-0 sm:min-w-[210px]'
          >
            Quay lại trang chủ
          </Button>
        </div>
      </Stack>
    </Center>
  );
}
