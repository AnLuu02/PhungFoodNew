import { Box, Button, Flex, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { Session } from 'next-auth';
import Link from 'next/link';
import { PromotionTabLayout } from '~/components/PromotionTabsLayout';

export function Promotions({ session }: { session: Session | null }) {
  return (
    <>
      <Paper
        p={{ base: 'lg', md: 'xl' }}
        className='relative overflow-hidden border border-mainColor/10 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-dark-card'
      >
        <Box className='absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mainColor/10 blur-3xl' />
        <Box className='absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-subColor/10 blur-3xl' />

        <Stack gap='xl' className='relative'>
          <Flex
            align={{ base: 'stretch', sm: 'center' }}
            justify='space-between'
            direction={{ base: 'column', sm: 'row' }}
            gap='lg'
          >
            <Box>
              <Group gap='xs' mb={8}>
                <Box className='h-px w-9 bg-mainColor' />

                <Text size='xs' fw={900} tt='uppercase' lts={2} className='text-mainColor'>
                  Ví ưu đãi
                </Text>
              </Group>

              <Title
                order={2}
                className='font-quicksand text-2xl font-black text-slate-950 dark:text-white sm:text-3xl'
              >
                Voucher của tôi
              </Title>

              <Text size='sm' c='dimmed' mt={6} className='max-w-xl leading-6'>
                Tất cả voucher đang khả dụng được lưu tại đây để bạn dùng nhanh khi đặt món.
              </Text>
            </Box>

            <Link href='/thuc-don'>
              <Button
                size='md'
                className='bg-mainColor px-5 text-white shadow-[0_12px_30px_rgba(21,93,252,0.22)] transition hover:-translate-y-0.5 hover:bg-mainColor/90'
              >
                Mua hàng ngay
              </Button>
            </Link>
          </Flex>

          <Box className='rounded-3xl border border-slate-100 bg-slate-50/80 p-2 dark:border-white/10 dark:bg-white/5 sm:p-3'>
            <PromotionTabLayout />
          </Box>
        </Stack>
      </Paper>
    </>
  );
}
