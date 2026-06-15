'use client';

import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Group,
  NumberFormatter,
  Paper,
  Progress,
  RingProgress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { UserLevel } from '@prisma/client';
import { IconLogin2 } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { caculateLevelUser } from '~/lib/FuncHandler/calculateLevel';
import { benefitLevel } from '~/lib/HardData/promotion-level';
import { api } from '~/trpc/react';

const rewardRules = [
  {
    title: 'Tích điểm theo đơn hàng',
    description: 'Mỗi 100.000đ chi tiêu được cộng 10 điểm vào tài khoản.',
    value: '+10 điểm'
  },
  {
    title: 'Cuối tuần nhiều điểm hơn',
    description: 'Các đơn đặt vào Thứ Bảy và Chủ Nhật có thể nhận thêm điểm thưởng.',
    value: 'x2 điểm'
  },
  {
    title: 'Ưu đãi theo chiến dịch',
    description: 'Một số món hoặc sự kiện đặc biệt sẽ có mức điểm riêng.',
    value: 'Linh hoạt'
  }
];

const guestEstimate = [
  {
    label: '8 đơn / tháng',
    value: '+250 điểm',
    muted: 'Theo giá trị đơn trung bình'
  },
  {
    label: 'Đặt cuối tuần',
    value: '+500 điểm',
    muted: 'Khi có chương trình nhân điểm'
  },
  {
    label: 'Quà thành viên mới',
    value: '+500 điểm',
    muted: 'Tùy chính sách hiện hành'
  }
];

const pointExamples = [
  {
    label: 'Đơn 120.000đ',
    point: '+12 điểm'
  },
  {
    label: 'Đơn 250.000đ',
    point: '+25 điểm'
  },
  {
    label: 'Đơn 420.000đ',
    point: '+42 điểm'
  }
];

export default function InfoLevelUser() {
  const { data: session } = useSession();

  const { data: userData, isLoading } = api.User.getOne.useQuery(
    {
      key: session?.user.email || '',
      include: {
        orders: true
      }
    },
    {
      enabled: !!session?.user.email
    }
  );

  const { currentPoint, pointRemaining, progressRemainingValue, currentLevel, nextLevel, levelText } =
    caculateLevelUser({
      level: userData?.level,
      pointUser: userData?.pointUser
    });
  const orderCount = userData?.orders?.length || 0;
  const isLoggedIn = !!userData?.id;
  const currentPromotionLevel = benefitLevel[(userData?.level as UserLevel) || UserLevel.BRONZE];

  const visibleFeatures = currentPromotionLevel.features.slice(0, 4);
  const hiddenFeatureCount = Math.max(currentPromotionLevel.features.length - visibleFeatures.length, 0);
  return (
    <Box className='relative overflow-hidden rounded-[2rem] border border-slate-200 bg-backgroundAdmin p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-dark-card sm:p-6 lg:p-8'>
      <Box className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mainColor/10 blur-3xl' />

      <SimpleGrid cols={{ base: 1, lg: 12 }} spacing={{ base: 'xl', lg: 34 }} className='relative z-[1]'>
        <Box className='lg:col-span-5'>
          <Stack gap='xl' className='h-full'>
            <Box>
              <Group gap='xs' mb='sm'>
                <Box className='h-px w-10 bg-mainColor' />
                <Text size='sm' fw={800} className='uppercase tracking-[0.22em] text-mainColor'>
                  Thành viên Phụng Food
                </Text>
              </Group>

              <Title className='font-quicksand text-3xl font-black leading-tight text-slate-950 dark:text-white sm:text-4xl'>
                Tích điểm sau mỗi lần đặt.
              </Title>

              <Text mt='md' size='md' c='dimmed' className='max-w-xl leading-7'>
                Tích điểm dễ dàng, ưu đãi rõ ràng - Đặc quyền trong tầm tay, quản lý ngay trong ví
              </Text>
            </Box>

            <Stack gap='sm'>
              {rewardRules.map((item, index) => (
                <Paper
                  key={item.title}
                  radius={'xl'}
                  p='md'
                  className='group relative overflow-hidden border border-slate-200 bg-slate-50/70 transition duration-300 hover:-translate-y-1 hover:border-mainColor/30 hover:bg-backgroundAdmin hover:shadow-lg dark:border-white/10 dark:bg-backgroundAdmin/[0.03] dark:hover:bg-backgroundAdmin/[0.06]'
                >
                  <Group wrap='nowrap' align='flex-start' gap='md'>
                    <Text
                      fw={950}
                      className='w-10 shrink-0 font-quicksand text-2xl leading-none text-slate-300 transition duration-300 group-hover:text-mainColor dark:text-white/20'
                    >
                      {String(index + 1).padStart(2, '0')}
                    </Text>

                    <Box className='min-w-0 flex-1'>
                      <Group justify='space-between' gap='xs' wrap='nowrap'>
                        <Text fw={900} className='text-slate-900 dark:text-white'>
                          {item.title}
                        </Text>

                        <Badge
                          variant='light'
                          radius='xl'
                          className='shrink-0 bg-subColor/20 text-slate-900 dark:text-white'
                        >
                          {item.value}
                        </Badge>
                      </Group>

                      <Text mt={5} size='sm' c='dimmed' className='leading-6'>
                        {item.description}
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              ))}
            </Stack>

            <Paper
              radius={'xl'}
              p='lg'
              className='mt-auto overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-xl dark:border-white/10'
            >
              <Box className='pointer-events-none absolute' />

              <Stack gap='md'>
                <Box>
                  <Text size='xs' fw={900} className='uppercase tracking-[0.22em] text-white/45'>
                    Cách tính dễ hiểu
                  </Text>

                  <Title mt={6} order={4} className='font-quicksand text-xl font-black'>
                    Cứ 100.000đ chi tiêu tương ứng 10 điểm.
                  </Title>

                  <Text mt={6} size='sm' className='leading-6 text-white/60'>
                    Điểm được cộng sau khi đơn hàng hoàn tất. Các chương trình cuối tuần hoặc chiến dịch riêng có thể
                    cộng thêm.
                  </Text>
                </Box>

                <Box className='h-px w-full bg-white/10' />

                <Stack gap='xs'>
                  {pointExamples.map((item, index) => (
                    <Group key={item.label} justify='space-between' gap='md' wrap='nowrap'>
                      <Group gap='sm' wrap='nowrap'>
                        <Text className='w-6 shrink-0 font-quicksand text-sm font-black text-white/30'>
                          {String(index + 1).padStart(2, '0')}
                        </Text>

                        <Text size='sm' className='text-white/72'>
                          {item.label}
                        </Text>
                      </Group>

                      <Text fw={950} className='shrink-0 text-subColor'>
                        {item.point}
                      </Text>
                    </Group>
                  ))}
                </Stack>

                <Paper p='sm' className='border border-white/10 bg-white/[0.06]'>
                  <Group justify='space-between' gap='md' wrap='nowrap'>
                    <Box>
                      <Text size='sm' fw={900} className='text-white'>
                        Mẹo nhỏ
                      </Text>
                      <Text size='xs' className='mt-1 leading-5 text-white/55'>
                        Đặt theo nhóm hoặc gia đình sẽ giúp điểm tăng nhanh hơn.
                      </Text>
                    </Box>

                    <Text className='shrink-0 font-quicksand text-2xl font-black text-white/20'>+++</Text>
                  </Group>
                </Paper>
              </Stack>
            </Paper>
          </Stack>
        </Box>

        <Box className='lg:col-span-7'>
          {isLoading ? (
            <>
              <Paper
                p={{ base: 'lg', sm: 'xl' }}
                radius='xl'
                className='relative overflow-hidden border border-slate-200 text-white shadow-2xl dark:border-white/10'
              >
                <Box className='absolute -right-24 -top-24 h-72 w-72 rounded-full bg-slate-500 opacity-20 blur-3xl' />

                <Stack gap='xl' className='relative z-[1]'>
                  <Box>
                    <Skeleton height={30} width={120} radius='xl' mb='lg' />
                    <Skeleton height={40} width='60%' radius='md' mb='sm' />
                    <Skeleton height={20} width='80%' radius='md' />
                  </Box>

                  <Center className='hidden sm:flex'>
                    <Skeleton height={150} width={150} circle />
                  </Center>

                  <Paper p='md' className='border border-white/10 bg-white/5 backdrop-blur-md'>
                    <Group justify='space-between' mb='sm'>
                      <Skeleton height={20} width='40%' />
                      <Skeleton height={20} width='20%' />
                    </Group>
                    <Skeleton height={24} radius='xl' />
                    <Group mt='sm' justify='space-between'>
                      <Skeleton height={12} width='15%' />
                      <Skeleton height={12} width='15%' />
                    </Group>
                  </Paper>

                  <SimpleGrid cols={{ base: 1, md: 12 }} spacing='sm'>
                    <Box className='md:col-span-5'>
                      <Stack gap='sm'>
                        {[1, 2, 3].map(i => (
                          <Paper key={i} p='md' className='border border-white/10 bg-white/5'>
                            <Skeleton height={12} width='40%' mb={8} />
                            <Skeleton height={24} width='60%' />
                          </Paper>
                        ))}
                      </Stack>
                    </Box>

                    <Paper p='md' className='border border-white/10 bg-white/5 md:col-span-7'>
                      <Stack gap='md'>
                        <Group justify='space-between'>
                          <Box>
                            <Skeleton height={12} width={80} mb={8} />
                            <Skeleton height={20} width={150} />
                          </Box>
                          <Skeleton height={28} width={100} radius='xl' />
                        </Group>
                        <Box className='h-px w-full bg-white/10' />
                        <Stack gap='lg'>
                          {[1, 2, 3].map(i => (
                            <Group key={i} gap='sm' wrap='nowrap'>
                              <Skeleton height={20} width={20} radius='sm' />
                              <Skeleton height={16} width='90%' />
                            </Group>
                          ))}
                        </Stack>
                      </Stack>
                    </Paper>
                  </SimpleGrid>
                </Stack>
              </Paper>
            </>
          ) : isLoggedIn ? (
            <Paper
              p={{ base: 'lg', sm: 'xl' }}
              radius={'xl'}
              className='relative overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-2xl dark:border-white/10'
            >
              <Box
                className='absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl'
                style={{ backgroundColor: currentLevel.color }}
              />

              <Box className='absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-white/10 to-transparent' />

              <Stack gap='xl' className='relative z-[1]'>
                <Box>
                  <Badge
                    size='lg'
                    radius='xl'
                    className='border border-white/15 bg-backgroundAdmin/10 text-white backdrop-blur'
                  >
                    Hạng {currentLevel.viName}
                  </Badge>

                  <Title mt='lg' className='font-quicksand text-3xl font-black sm:text-4xl'>
                    Xin chào, thành viên <b style={{ color: currentLevel.color }}>{currentLevel.viName}</b>
                  </Title>

                  <Text mt='sm' className='max-w-xl leading-7 text-white/70'>
                    Bạn đang có{' '}
                    <Text span fw={900} className='text-white'>
                      <NumberFormatter value={currentPoint} thousandSeparator='.' decimalSeparator=',' /> điểm
                    </Text>
                    . {levelText}
                  </Text>
                </Box>
                <Center className='hidden shrink-0 sm:flex'>
                  <RingProgress
                    size={150}
                    thickness={12}
                    roundCaps
                    sections={[{ value: progressRemainingValue, color: currentLevel.color }]}
                    label={
                      <Box ta='center'>
                        <Text fw={950} size='xl' className='text-white'>
                          {progressRemainingValue.toFixed(0)}%
                        </Text>
                        <Text size='xs' className='text-white/55'>
                          tiến độ
                        </Text>
                      </Box>
                    }
                  />
                </Center>
                <Paper p='md' className='border border-white/10 bg-backgroundAdmin/10 backdrop-blur-md'>
                  <Group justify='space-between' mb='sm' gap='xs'>
                    <Text fw={900}>Tiến trình lên hạng {nextLevel.viName}</Text>

                    <Text size='sm' className='text-white/70'>
                      Còn {pointRemaining} điểm
                    </Text>
                  </Group>

                  <Tooltip
                    label={`${currentPoint} / ${nextLevel.minPoint} điểm`}
                    styles={{
                      tooltip: {
                        backgroundColor: currentLevel.color,
                        color: 'white'
                      }
                    }}
                  >
                    <Progress
                      value={progressRemainingValue}
                      size='lg'
                      radius='xl'
                      color={currentLevel.color}
                      classNames={{
                        root: 'bg-backgroundAdmin/15'
                      }}
                    />
                  </Tooltip>

                  <Group mt='sm' justify='space-between'>
                    <Text size='xs' className='text-white/55'>
                      Hiện tại
                    </Text>

                    <Text size='xs' className='text-white/55'>
                      {nextLevel.viName}
                    </Text>
                  </Group>
                </Paper>

                <SimpleGrid cols={{ base: 1, md: 12 }} spacing='sm' className='items-stretch'>
                  <Box className='md:col-span-5'>
                    <Stack gap='sm' className='h-full'>
                      <Paper p='md' className='flex-1 border border-white/10 bg-backgroundAdmin/[0.08] backdrop-blur'>
                        <Text size='xs' className='text-white/55'>
                          Tổng điểm
                        </Text>

                        <Text mt={4} fw={950} size='xl'>
                          <NumberFormatter value={currentPoint} thousandSeparator='.' decimalSeparator=',' /> điểm
                        </Text>
                      </Paper>

                      <Paper p='md' className='flex-1 border border-white/10 bg-backgroundAdmin/[0.08] backdrop-blur'>
                        <Text size='xs' className='text-white/55'>
                          Đơn hàng trong năm
                        </Text>

                        <Text mt={4} fw={950} size='xl'>
                          {orderCount} đơn hàng
                        </Text>
                      </Paper>

                      <Paper p='md' className='flex-1 border border-white/10 bg-backgroundAdmin/[0.08] backdrop-blur'>
                        <Text size='xs' className='text-white/55'>
                          Hạng tiếp theo
                        </Text>

                        <Text mt={4} fw={950} size='xl'>
                          {nextLevel.viName}
                        </Text>
                      </Paper>
                    </Stack>
                  </Box>

                  <Paper
                    p='md'
                    className='border border-white/10 bg-backgroundAdmin/[0.08] backdrop-blur md:col-span-7'
                  >
                    <Stack gap='md' className='h-full'>
                      <Group justify='space-between' align='flex-start' gap='md'>
                        <Box>
                          <Text size='xs' className='text-white/55'>
                            Quyền lợi hiện tại
                          </Text>

                          <Text mt={4} fw={950} size='lg'>
                            Hạng {currentPromotionLevel.name}
                          </Text>
                        </Box>

                        <Badge radius='xl' className='border border-white/10 bg-white/10 text-white'>
                          {currentPromotionLevel.range}
                        </Badge>
                      </Group>

                      <Box className='h-px w-full bg-white/10' />

                      <Stack gap='xs' className='flex-1'>
                        {visibleFeatures.map((feature, index) => (
                          <Group key={feature} gap='sm' align='flex-start' wrap='nowrap'>
                            <Text fw={950} className='mt-[2px] w-6 shrink-0 font-quicksand text-sm text-white/35'>
                              {String(index + 1).padStart(2, '0')}
                            </Text>

                            <Text size='sm' className='text-white/78 leading-6'>
                              {feature}
                            </Text>
                          </Group>
                        ))}
                      </Stack>

                      {hiddenFeatureCount > 0 && (
                        <Paper p='sm' className='border border-white/10 bg-white/[0.06]'>
                          <Text size='sm' className='text-white/65'>
                            Còn {hiddenFeatureCount} quyền lợi khác sẽ được hiển thị trong trang chi tiết thành viên.
                          </Text>
                        </Paper>
                      )}
                    </Stack>
                  </Paper>
                </SimpleGrid>
              </Stack>
            </Paper>
          ) : (
            <Stack gap={'xs'}>
              <Paper
                p={{ base: 'lg', sm: 'xl' }}
                radius={'xl'}
                className='relative overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-2xl dark:border-white/10'
              >
                <Box className='absolute -right-20 -top-20 h-72 w-72 rounded-full bg-subColor/30 blur-3xl' />
                <Box className='absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-mainColor/25 blur-3xl' />

                <Stack gap='xl' className='relative z-[1]'>
                  <Group justify='space-between' align='flex-start' gap='lg'>
                    <Box>
                      <Badge size='lg' radius='xl' className='border border-white/15 bg-backgroundAdmin/10 text-white'>
                        Thành viên mới
                      </Badge>

                      <Title mt='lg' className='font-quicksand text-3xl font-black sm:text-4xl'>
                        Đăng nhập để bắt đầu nhận điểm.
                      </Title>

                      <Text mt='sm' className='max-w-xl text-white/70'>
                        Theo dõi điểm thưởng, hạng thành viên và các ưu đãi cá nhân hóa sau mỗi lần đặt món.
                      </Text>
                    </Box>
                  </Group>

                  <Paper p='md' className='border border-white/10 bg-backgroundAdmin/10 backdrop-blur-md'>
                    <Text fw={900}>Ví dụ trong tháng đầu tiên</Text>

                    <Stack mt='md' gap='sm'>
                      {guestEstimate.map(item => (
                        <Group key={item.label} justify='space-between' gap='md' wrap='nowrap'>
                          <Box className='w-[60%] md:flex-1'>
                            <Text size='sm' fw={800}>
                              {item.label}
                            </Text>
                            <Text size='xs' className='text-white/55'>
                              {item.muted}
                            </Text>
                          </Box>

                          <Text fw={950} className='flex-1 text-subColor md:w-[max-content] md:flex-none'>
                            {item.value}
                          </Text>
                        </Group>
                      ))}
                    </Stack>

                    <Divider my='md' className='border-white/10' />

                    <Group justify='space-between'>
                      <Text fw={900}>Tổng điểm ước tính</Text>
                      <Text fw={950} size='xl'>
                        1.250 điểm
                      </Text>
                    </Group>
                  </Paper>

                  <Button component={Link} href='/dang-nhap' size='md' rightSection={<IconLogin2 size={18} />}>
                    Đăng nhập để tích điểm
                  </Button>
                </Stack>
              </Paper>

              <Box className='mt-10 flex justify-center'>
                <Paper
                  radius='xl'
                  p={{ base: 'lg', md: 'xl' }}
                  className='relative w-full max-w-4xl overflow-hidden border border-dashed border-mainColor/25 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-dark-card/70'
                >
                  <Box className='absolute -right-10 -top-10 h-28 w-28 rounded-full bg-mainColor/10 blur-2xl' />
                  <Box className='absolute -bottom-12 left-1/3 h-28 w-28 rounded-full bg-subColor/10 blur-2xl' />

                  <Group justify='space-between' align='center' gap='xl' className='relative'>
                    <Box className='min-w-0 flex-1'>
                      <Text size='xs' fw={900} tt='uppercase' lts={2} className='text-mainColor'>
                        Điểm sẽ tự động cộng
                      </Text>

                      <Text mt={6} fw={900} className='font-quicksand text-xl text-slate-950 dark:text-white'>
                        Ăn nhiều hơn, nhận lại nhiều hơn trong những lần sau.
                      </Text>

                      <Text mt={6} size='sm' c='dimmed' className='max-w-xl leading-6'>
                        Khi đơn hàng hoàn tất, điểm được cộng vào tài khoản và dùng để theo dõi hạng thành viên hoặc đổi
                        ưu đãi phù hợp.
                      </Text>

                      <Group mt='md' gap='xs'>
                        {['Tự động cộng điểm', 'Theo dõi hạng', 'Đổi ưu đãi'].map(item => (
                          <Box
                            key={item}
                            className='rounded-full border border-mainColor/10 bg-mainColor/5 px-3 py-1 text-xs font-bold text-mainColor'
                          >
                            {item}
                          </Box>
                        ))}
                      </Group>
                    </Box>

                    <Box className='hidden min-w-[240px] md:block'>
                      <Paper
                        radius='lg'
                        p='md'
                        className='border border-white/60 bg-white/80 shadow-sm dark:border-white/10 dark:bg-white/5'
                      >
                        <Group justify='space-between' mb='sm'>
                          <Text size='xs' fw={900} tt='uppercase' lts={1.5} c='dimmed'>
                            Ví dụ đơn hàng
                          </Text>

                          <Box className='h-2 w-2 rounded-full bg-mainColor' />
                        </Group>

                        <Stack gap={8}>
                          <Group justify='space-between'>
                            <Text size='sm' c='dimmed'>
                              Tạm tính
                            </Text>
                            <Text size='sm' fw={800}>
                              250.000đ
                            </Text>
                          </Group>

                          <Group justify='space-between'>
                            <Text size='sm' c='dimmed'>
                              Quy đổi
                            </Text>
                            <Text size='sm' fw={800}>
                              100.000đ = 10 điểm
                            </Text>
                          </Group>

                          <Box className='h-px bg-slate-200 dark:bg-white/10' />

                          <Group justify='space-between' align='flex-end'>
                            <Box>
                              <Text size='xs' c='dimmed'>
                                Điểm nhận được
                              </Text>
                              <Text size='xs' c='dimmed'>
                                Sau khi hoàn tất đơn
                              </Text>
                            </Box>

                            <Text fw={900} className='font-quicksand text-2xl text-amber-500'>
                              +25
                            </Text>
                          </Group>
                        </Stack>
                      </Paper>
                    </Box>
                  </Group>
                </Paper>
              </Box>
            </Stack>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}
