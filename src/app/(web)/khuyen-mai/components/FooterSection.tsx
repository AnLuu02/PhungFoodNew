'use client';

import { ActionIcon, Badge, Box, Button, Grid, GridCol, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconArrowRight, IconBolt, IconCheck, IconClock, IconGift } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function FooterSection() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.id;

  return (
    <Box className='relative overflow-hidden px-4 py-20 text-white sm:py-28'>
      <Box className='absolute inset-0 bg-[url("/images/png/banner_food.png")] bg-cover bg-center bg-no-repeat' />
      <Box className='absolute inset-0 bg-[linear-gradient(120deg,rgba(8,13,10,0.96)_0%,rgba(8,13,10,0.84)_48%,rgba(8,13,10,0.48)_100%)]' />
      <Box className='absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(248,193,68,0.28),transparent_34%)]' />

      <Box className='absolute -left-24 top-20 h-72 w-72 rounded-full bg-subColor/20 blur-3xl' />
      <Box className='absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-mainColor/30 blur-3xl' />

      <Box className='relative z-10 mx-auto max-w-6xl'>
        <Grid align='center' gutter={48}>
          <GridCol span={{ base: 12, lg: 7 }}>
            <Stack gap='xl'>
              <Group gap='sm'>
                <Box className='h-px w-12 bg-orange-300' />
                <Text className='text-sm font-bold uppercase tracking-[0.28em] text-orange-200'>
                  Ưu đãi dành riêng cho bạn
                </Text>
              </Group>

              <Box>
                <Title className='max-w-3xl text-balance font-quicksand text-4xl font-black leading-[1.05] text-white sm:text-6xl'>
                  Đặt món hôm nay,
                  <span className='block text-subColor'>nhận ưu đãi cho lần sau.</span>
                </Title>

                <Text className='mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/75 md:text-xl'>
                  Tích điểm tự động, nhận voucher thành viên và mở khóa nhiều đặc quyền mỗi khi quay lại Phụng Food.
                </Text>
              </Box>

              <Group gap='md'>
                {isLoggedIn ? (
                  <>
                    <Button
                      component={Link}
                      href='/thuc-don'
                      size='lg'
                      rightSection={<IconArrowRight size={18} />}
                      className='h-auto bg-subColor px-7 py-3 text-base font-black text-black shadow-[0_18px_60px_rgba(248,193,68,0.35)] transition hover:-translate-y-1 hover:bg-yellow-300'
                    >
                      Đặt ngay
                    </Button>

                    <Button
                      component={Link}
                      href='/thong-tin'
                      size='lg'
                      variant='outline'
                      className='h-auto border-white/25 bg-white/10 px-7 py-3 text-base font-bold text-white backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/15'
                    >
                      Xem tiến trình
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      component={Link}
                      href='/dang-nhap'
                      rightSection={<IconGift size={18} />}
                      className='h-auto bg-subColor px-5 py-3 text-sm font-black text-black shadow-[0_18px_60px_rgba(248,193,68,0.35)] transition hover:-translate-y-1 hover:bg-yellow-300 md:px-7 md:py-3 md:text-base'
                    >
                      Nhận 500 điểm
                    </Button>

                    <Button
                      component={Link}
                      href='/thuc-don'
                      variant='outline'
                      className='h-auto border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/15 md:px-7 md:py-3 md:text-base'
                    >
                      Món đang giảm
                    </Button>
                  </>
                )}
              </Group>
            </Stack>
          </GridCol>

          <GridCol span={{ base: 12, lg: 5 }}>
            <Paper
              pos={'relative'}
              radius={'xl'}
              className='border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-6'
            >
              <Stack gap='md'>
                <Box>
                  <Text className='text-sm font-bold uppercase tracking-[0.22em] text-subColor'>Member deal</Text>
                  <Title order={2} className='mt-2 font-quicksand text-3xl font-black text-white'>
                    Voucher đến 20%
                  </Title>
                  <Text className='mt-2 text-white/65'>Áp dụng cho đơn hàng đầu tiên sau khi đăng nhập.</Text>
                </Box>

                <ActionIcon
                  size={54}
                  radius='xl'
                  className='text-subColor'
                  pos={'absolute'}
                  top={10}
                  variant='transparent'
                  right={10}
                >
                  <IconGift size={28} />
                </ActionIcon>

                <Box className='rounded-3xl border border-dashed border-white/20 bg-black/20 p-5'>
                  <Group justify='space-between'>
                    <Box>
                      <Text size='xs' className='font-bold uppercase tracking-[0.2em] text-white/45'>
                        Mã ưu đãi
                      </Text>
                      <Text className='font-quicksand text-2xl font-black tracking-[0.14em] text-white'>PHUNG20</Text>
                    </Box>

                    <Badge radius='xl' className='bg-subColor text-black'>
                      Có hạn
                    </Badge>
                  </Group>
                </Box>

                <Grid>
                  {[
                    [IconCheck, 'Không phí', 'tham gia'],
                    [IconClock, 'Tự động', 'tích điểm'],
                    [IconBolt, 'Dùng ngay', 'ưu đãi']
                  ].map(([Icon, title, desc]: any) => (
                    <GridCol span={4} key={title}>
                      <Box className='rounded-2xl bg-white/10 p-3 text-center'>
                        <ActionIcon radius='xl' size={34} className='mx-auto mb-2 bg-white/10 text-subColor'>
                          <Icon size={18} />
                        </ActionIcon>
                        <Text size='sm' fw={900} className='text-white'>
                          {title}
                        </Text>
                        <Text size='xs' className='text-white/50'>
                          {desc}
                        </Text>
                      </Box>
                    </GridCol>
                  ))}
                </Grid>
              </Stack>
            </Paper>
          </GridCol>
        </Grid>
      </Box>
    </Box>
  );
}
