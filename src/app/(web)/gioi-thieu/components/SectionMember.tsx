'use client';
import { Badge, Box, Button, Group, Paper, SimpleGrid, Skeleton, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { UserLevel } from '@prisma/client';
import { IconArrowRight, IconCake, IconGift, IconTicket, IconTruckDelivery } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Reveal from '~/components/Reveal';
import { INFO_LEVEL_USER } from '~/shared/constants/user.constants';
import { api } from '~/trpc/react';
const guestBenefits = [
  {
    icon: IconGift,
    title: 'Tích điểm sau khi đặt món',
    desc: 'Điểm sẽ được cộng vào tài khoản khi đơn hàng hoàn tất.'
  },
  {
    icon: IconTicket,
    title: 'Lưu voucher vào tài khoản',
    desc: 'Không cần nhớ mã, ưu đãi được lưu và dùng lại dễ hơn.'
  },
  {
    icon: IconCake,
    title: 'Nhận ưu đãi vào dịp đặc biệt',
    desc: 'Sinh nhật hoặc các dịp riêng sẽ có quà phù hợp hơn.'
  },
  {
    icon: IconTruckDelivery,
    title: 'Theo dõi đơn hàng rõ ràng',
    desc: 'Xem trạng thái, lịch sử đặt món và thông tin giao hàng.'
  }
];

const MemberGuestCard = () => {
  return (
    <Box className='relative mx-auto w-full max-w-[520px]'>
      <Box className='absolute -inset-4 rounded-[2rem] bg-mainColor/5 blur-xl' />

      <Paper
        p={{ base: 'lg', md: 'xl' }}
        radius={'xl'}
        className='relative overflow-hidden border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950'
      >
        <Box className='absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-mainColor/10 sm:h-80 sm:w-80' />
        <Box className='absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-mainColor/10 blur-2xl' />

        <Stack gap='xl' className='relative'>
          <Group justify='space-between' align='flex-start'>
            <Box>
              <Text size='xs' fw={900} tt='uppercase' lts={2} className='text-mainColor'>
                Guest Preview
              </Text>

              <Title order={3} mt={4} className='font-quicksand text-2xl font-black text-slate-950 dark:text-white'>
                Mở khóa Phụng Food Rewards
              </Title>

              <Text mt={6} size='sm' c='dimmed' className='max-w-sm leading-6'>
                Đăng nhập hoặc tạo tài khoản để mỗi đơn hàng đều được ghi nhận và tích điểm.
              </Text>
            </Box>
          </Group>

          <Paper
            p='md'
            className='relative overflow-hidden border border-dashed border-mainColor/25 bg-mainColor/[0.05] dark:border-white/15 dark:bg-white/5'
          >
            <Group justify='space-between' align='center' mb={10}>
              <Box>
                <Text size='sm' fw={900} className='text-slate-950 dark:text-white'>
                  Điểm thưởng của bạn
                </Text>
                <Text size='xs' c='dimmed'>
                  Sẽ hiển thị sau khi đăng nhập
                </Text>
              </Box>

              <Text fw={900} className='font-quicksand text-2xl text-mainColor'>
                —
              </Text>
            </Group>

            <Box className='h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10'>
              <Box className='h-full w-[18%] rounded-full bg-mainColor/35' />
            </Box>

            <Group mt='md' gap='xs'>
              {['Đăng ký', 'Đặt món', 'Tích điểm'].map((item, index) => (
                <Box key={item} className='flex items-center gap-2'>
                  <Text size='xs' fw={800} className={index === 0 ? 'text-mainColor' : 'text-slate-400'}>
                    {item}
                  </Text>

                  {index !== 2 && <Box className='h-px w-5 bg-slate-300 dark:bg-white/15' />}
                </Box>
              ))}
            </Group>
          </Paper>

          <Stack gap='sm'>
            {guestBenefits.map((item, index) => (
              <Group
                key={item.title}
                gap='md'
                align='flex-start'
                wrap='nowrap'
                className={
                  index !== guestBenefits.length - 1 ? 'border-b border-slate-100 pb-3 dark:border-white/10' : ''
                }
              >
                <ThemeIcon size={40} radius='xl' className='shrink-0 bg-mainColor/10 text-mainColor dark:bg-white/10'>
                  <item.icon size={20} />
                </ThemeIcon>

                <Box>
                  <Group gap='xs'>
                    <Text fw={900} className='text-slate-950 dark:text-white'>
                      {item.title}
                    </Text>

                    {index < 2 && (
                      <Badge radius='xl' variant='light' className='bg-subColor/20 text-slate-800 dark:text-white'>
                        Mở sau đăng nhập
                      </Badge>
                    )}
                  </Group>

                  <Text mt={2} size='sm' c='dimmed' className='leading-6'>
                    {item.desc}
                  </Text>
                </Box>
              </Group>
            ))}
          </Stack>

          <Paper p='md' className='border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/5'>
            <Group justify='space-between' align='center' wrap='wrap'>
              <Box>
                <Text size='sm' fw={900} className='text-slate-950 dark:text-white'>
                  Bắt đầu bằng một tài khoản miễn phí
                </Text>
                <Text size='xs' c='dimmed'>
                  Đăng ký nhanh để lưu điểm, voucher và lịch sử đơn hàng.
                </Text>
              </Box>

              <Button
                component={Link}
                href='/dang-ky'
                size='sm'
                rightSection={<IconArrowRight size={16} />}
                className='shrink-0 bg-mainColor hover:bg-mainColor/90'
              >
                Đăng ký
              </Button>
            </Group>
          </Paper>
        </Stack>
      </Paper>
    </Box>
  );
};
export const SectionMember = () => {
  const { data: session } = useSession();
  const { data: user, isLoading } = api.User.getOne.useQuery(
    { key: session?.user?.id },
    { enabled: !!session?.user?.id }
  );

  const isLoggedIn = !!session?.user;

  const currentLevelKey = user?.level ?? UserLevel.BRONZE;
  const LEVEL = INFO_LEVEL_USER[currentLevelKey];

  const NEXT_LEVEL = LEVEL.key === LEVEL.nextLevel ? LEVEL : INFO_LEVEL_USER[LEVEL.nextLevel];

  const currentPoint = user?.pointUser ?? 0;
  const pointRemaining = NEXT_LEVEL.minPoint - currentPoint;

  const isMaxLevel = pointRemaining <= 0;

  const levelText = isMaxLevel
    ? 'Bạn đã đạt hạng thành viên cao nhất của nhà hàng.'
    : `Còn ${pointRemaining} điểm để lên hạng ${NEXT_LEVEL.viName}`;

  const progressColor = LEVEL.color;
  const valueProgress = isMaxLevel ? 100 : Math.min((currentPoint / NEXT_LEVEL.minPoint) * 100, 100);

  return (
    <>
      <Reveal z={40}>
        <Paper
          radius={'xl'}
          p={{ base: 'lg', md: 48 }}
          className='relative overflow-hidden border border-mainColor/10 bg-backgroundAdmin shadow-sm dark:border-white/10 dark:bg-dark-card'
        >
          <Box className='absolute -right-28 -top-28 h-72 w-72 rounded-full bg-mainColor/10 blur-3xl' />
          <Box className='absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-subColor/20 blur-3xl' />

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 34, md: 56 }} className='relative items-center'>
            <Stack gap='xl'>
              <Box>
                <Group gap='sm' mb='md'>
                  <Box className='h-px w-10 bg-mainColor' />
                  <Text size='xs' fw={900} tt='uppercase' lts={3} className='text-mainColor'>
                    Thành viên Phụng Food
                  </Text>
                </Group>

                <Title className='max-w-xl text-balance font-quicksand text-3xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl'>
                  Ăn ngon hơn khi mỗi đơn hàng đều được ghi nhận.
                </Title>

                <Text mt='md' className='max-w-xl text-base leading-7 text-slate-600 dark:text-dark-muted md:text-lg'>
                  Không chỉ đặt món. Tài khoản thành viên giúp bạn tích điểm sau mỗi đơn, nhận ưu đãi đúng lúc và theo
                  dõi quyền lợi rõ ràng hơn khi quay lại Phụng Food.
                </Text>
              </Box>

              <Group gap='sm' p={0} m={0}>
                {isLoggedIn ? (
                  <>
                    <Button
                      component={Link}
                      href='/thuc-don'
                      h={{ base: 40, sm: 44, lg: 50 }}
                      px={{ base: 16, sm: 22, lg: 28 }}
                      fz={{ base: 14, sm: 15, lg: 16 }}
                      rightSection={<IconGift size={18} />}
                    >
                      Tích lũy ngay
                    </Button>
                  </>
                ) : (
                  <Button
                    component={Link}
                    href='/dang-ky'
                    h={{ base: 40, sm: 44, lg: 50 }}
                    px={{ base: 12, sm: 22, lg: 28 }}
                    fz={{ base: 14, sm: 15, lg: 16 }}
                    rightSection={<IconGift size={18} />}
                  >
                    Đăng ký thành viên
                  </Button>
                )}

                <Button
                  component={Link}
                  href='/thuc-don'
                  h={{ base: 40, sm: 44, lg: 50 }}
                  px={{ base: 12, sm: 22, lg: 28 }}
                  fz={{ base: 14, sm: 15, lg: 16 }}
                  variant='outline'
                >
                  Đặt món
                </Button>
              </Group>

              <SimpleGrid
                spacing='lg'
                cols={{ base: 2, sm: 3 }}
                className='border-t border-slate-200 dark:border-white/10'
              >
                {[
                  ['500+', 'điểm có thể tích'],
                  ['4', 'nhóm quyền lợi'],
                  ['24/7', 'theo dõi đơn hàng']
                ].map(([value, label]) => (
                  <Paper
                    key={value}
                    p='md'
                    className='border border-white/10 bg-white text-center text-black backdrop-blur-md dark:bg-dark-dimmed dark:text-white'
                  >
                    <Text className='font-quicksand text-2xl font-black text-subColor'>{value}</Text>
                    <Text size='sm' className='text-white/72'>
                      {label}
                    </Text>
                  </Paper>
                ))}
              </SimpleGrid>
            </Stack>

            {isLoading ? (
              <Box className='relative mx-auto w-full max-w-[520px]'>
                <Paper
                  p={{ base: 'lg', md: 'xl' }}
                  radius='xl'
                  className='relative overflow-hidden border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950'
                >
                  <Stack gap='xl' className='relative'>
                    <Box>
                      <Skeleton height={12} width='30%' mb={8} radius='xl' />
                      <Skeleton height={28} width='70%' radius='md' />
                    </Box>

                    <Paper
                      p='md'
                      className='border border-mainColor/10 bg-mainColor/[0.06] dark:border-white/10 dark:bg-white/5'
                    >
                      <Group justify='space-between' mb={12}>
                        <Box style={{ flex: 1 }}>
                          <Skeleton height={16} width='60%' mb={6} />
                          <Skeleton height={12} width='80%' />
                        </Box>
                        <Skeleton height={24} width={40} />
                      </Group>
                      <Skeleton height={8} radius='xl' />
                    </Paper>

                    <Stack gap='lg'>
                      {[1, 2, 3, 4].map(i => (
                        <Group key={i} gap='md' align='flex-start' wrap='nowrap'>
                          <Skeleton height={40} width={40} circle className='shrink-0' />
                          <Box style={{ flex: 1 }}>
                            <Skeleton height={16} width='70%' mb={8} />
                            <Skeleton height={12} width='90%' />
                          </Box>
                        </Group>
                      ))}
                    </Stack>

                    <Paper p='md' className='rounded-2xl bg-slate-50 dark:bg-white/5'>
                      <Skeleton height={14} width='90%' mb={8} />
                      <Skeleton height={12} width='60%' />
                    </Paper>
                  </Stack>
                </Paper>
              </Box>
            ) : isLoggedIn ? (
              <>
                <Box className='relative mx-auto w-full max-w-[520px]'>
                  <Box className='absolute -inset-4 rounded-[2rem] bg-mainColor/5 blur-xl' />

                  <Paper
                    p={{ base: 'lg', md: 'xl' }}
                    radius={'xl'}
                    className='relative overflow-hidden border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950'
                  >
                    <Box className='absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-mainColor/10 sm:h-80 sm:w-80' />
                    <Box className='absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-mainColor/10 blur-2xl' />

                    <Stack gap='xl' className='relative'>
                      <Group justify='space-between' align='flex-start'>
                        <Box>
                          <Text size='xs' fw={900} tt='uppercase' lts={2} className='text-mainColor'>
                            Thẻ thành viên
                          </Text>

                          <Title
                            order={3}
                            mt={4}
                            className='font-quicksand text-2xl font-black text-slate-950 dark:text-white'
                          >
                            Phụng Food Rewards
                          </Title>
                        </Box>
                      </Group>

                      <Paper
                        p='md'
                        className='border border-mainColor/10 bg-mainColor/[0.06] dark:border-white/10 dark:bg-white/5'
                      >
                        <Group justify='space-between' mb={8}>
                          <Box>
                            <Text size='sm' fw={800} className='text-slate-950 dark:text-white'>
                              Hạng <b style={{ color: LEVEL.color }}> {LEVEL.viName}</b>
                            </Text>
                            <Text size='xs' c='dimmed'>
                              {levelText}
                            </Text>
                          </Box>

                          <Text fw={900} className='font-quicksand text-xl' style={{ color: LEVEL.color }}>
                            {user?.pointUser ?? 0}
                          </Text>
                        </Group>

                        <Box className='h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10'>
                          <Box
                            className='relative h-full overflow-hidden rounded-full transition-all duration-500'
                            style={{
                              width: `${isMaxLevel ? 100 : valueProgress}%`,
                              background: isMaxLevel
                                ? `linear-gradient(90deg, ${progressColor}, ${progressColor + 10}, ${progressColor})`
                                : progressColor,
                              boxShadow: isMaxLevel ? `0 0 16px ${progressColor}80` : undefined
                            }}
                          >
                            {isMaxLevel && (
                              <Box className='absolute inset-0 -translate-x-full animate-[vip-shine_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent' />
                            )}
                          </Box>
                        </Box>
                      </Paper>

                      <Stack gap='sm'>
                        {[
                          {
                            icon: IconGift,
                            title: 'Tích điểm sau mỗi đơn hàng',
                            desc: 'Điểm được cộng vào tài khoản sau khi đơn hoàn tất.'
                          },
                          {
                            icon: IconTicket,
                            title: 'Voucher theo cấp độ',
                            desc: 'Cấp độ càng cao, ưu đãi càng dễ dùng cho lần đặt sau.'
                          },
                          {
                            icon: IconCake,
                            title: 'Ưu đãi vào dịp đặc biệt',
                            desc: 'Sinh nhật hoặc các dịp riêng sẽ có quà phù hợp hơn.'
                          },
                          {
                            icon: IconTruckDelivery,
                            title: 'Theo dõi đơn hàng dễ dàng',
                            desc: 'Xem lại lịch sử, trạng thái và thông tin đơn đã đặt.'
                          }
                        ].map((item, index) => (
                          <Group
                            key={item.title}
                            gap='md'
                            align='flex-start'
                            wrap='nowrap'
                            className={index !== 3 ? 'border-b border-slate-100 pb-3 dark:border-white/10' : ''}
                          >
                            <ThemeIcon
                              size={40}
                              radius='xl'
                              className='shrink-0 bg-mainColor/10 text-mainColor dark:bg-white/10'
                            >
                              <item.icon size={20} />
                            </ThemeIcon>

                            <Box>
                              <Text fw={900} className='text-slate-950 dark:text-white'>
                                {item.title}
                              </Text>

                              <Text mt={2} size='sm' c='dimmed' className='leading-6'>
                                {item.desc}
                              </Text>
                            </Box>
                          </Group>
                        ))}
                      </Stack>

                      <Group justify='space-between' className='relative rounded-2xl bg-slate-50 p-4 dark:bg-white/5'>
                        <Box>
                          <Text size='sm' fw={900} className='text-slate-950 dark:text-white'>
                            Quyền lợi rõ ràng hơn sau mỗi lần quay lại
                          </Text>
                          <Text size='xs' c='dimmed'>
                            Không cần ghi nhớ mã, chỉ cần đăng nhập.
                          </Text>
                        </Box>

                        <IconArrowRight size={20} className='absolute bottom-2 right-2 text-mainColor sm:static' />
                      </Group>
                    </Stack>
                  </Paper>
                </Box>
              </>
            ) : (
              <MemberGuestCard />
            )}
          </SimpleGrid>
        </Paper>
      </Reveal>
    </>
  );
};
