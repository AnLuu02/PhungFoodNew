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
  Stack,
  Text,
  Title
} from '@mantine/core';
import { UserLevel } from '@prisma/client';
import { IconLogin2 } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useMemo } from 'react';
import { promotionLevels } from '~/lib/HardData/promotion-level';
import { INFO_LEVEL_USER } from '~/shared/constants/user.constants';
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

const levelPreview = [
  {
    name: 'Đồng',
    point: '0+',
    benefit: 'Bắt đầu tích điểm',
    tone: 'from-orange-500/16 to-orange-500/5'
  },
  {
    name: 'Bạc',
    point: '500+',
    benefit: 'Ưu đãi thành viên',
    tone: 'from-slate-400/20 to-slate-400/5'
  },
  {
    name: 'Vàng',
    point: '1.500+',
    benefit: 'Voucher tốt hơn',
    tone: 'from-yellow-500/22 to-yellow-500/5'
  },
  {
    name: 'Kim cương',
    point: '3.000+',
    benefit: 'Đặc quyền cao nhất',
    tone: 'from-cyan-500/20 to-cyan-500/5'
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

  const { data: userData } = api.User.getOne.useQuery(
    {
      key: session?.user.email || '',
      include: {
        order: true
      }
    },
    {
      enabled: !!session?.user.email
    }
  );

  const { levelUser, levelNextUser, progressValue, remainingPoint, currentPoint, orderCount } = useMemo(() => {
    const currentLevelKey = (userData?.level as UserLevel) || UserLevel.BRONZE;
    const currentLevel = INFO_LEVEL_USER[currentLevelKey];
    const nextLevel = INFO_LEVEL_USER[currentLevel?.nextLevel || currentLevelKey];

    const point = userData?.pointUser || 0;
    const maxPoint = currentLevel?.maxPoint || 0;
    const nextMilestone = maxPoint + 1;

    const percent = nextMilestone > 0 ? Math.min((point / nextMilestone) * 100, 100) : 0;

    return {
      levelUser: currentLevel,
      levelNextUser: nextLevel,
      progressValue: percent,
      remainingPoint: Math.max(nextMilestone - point, 0),
      currentPoint: point,
      orderCount: userData?.order?.length || 0
    };
  }, [userData]);

  const isLoggedIn = !!userData?.id;
  const currentPromotionLevel = promotionLevels[(userData?.level as UserLevel) || UserLevel.BRONZE];

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
          {isLoggedIn ? (
            <Paper
              p={{ base: 'lg', sm: 'xl' }}
              radius={'xl'}
              className='relative overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-2xl dark:border-white/10'
            >
              <Box
                className='absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl'
                style={{ backgroundColor: levelUser.color }}
              />

              <Box className='absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-white/10 to-transparent' />

              <Stack gap='xl' className='relative z-[1]'>
                <Box>
                  <Badge
                    size='lg'
                    radius='xl'
                    className='border border-white/15 bg-backgroundAdmin/10 text-white backdrop-blur'
                  >
                    Hạng {levelUser.viName}
                  </Badge>

                  <Title mt='lg' className='font-quicksand text-3xl font-black sm:text-4xl'>
                    Xin chào, thành viên {levelUser.viName}
                  </Title>

                  <Text mt='sm' className='max-w-xl leading-7 text-white/70'>
                    Bạn đang có{' '}
                    <Text span fw={900} className='text-white'>
                      <NumberFormatter value={currentPoint} thousandSeparator='.' decimalSeparator=',' /> điểm
                    </Text>
                    . Tiếp tục tích lũy để mở khóa hạng {levelNextUser.viName}.
                  </Text>
                </Box>
                <Center className='hidden shrink-0 sm:flex'>
                  <RingProgress
                    size={150}
                    thickness={12}
                    roundCaps
                    sections={[{ value: progressValue, color: levelUser.color }]}
                    label={
                      <Box ta='center'>
                        <Text fw={950} size='xl' className='text-white'>
                          {progressValue.toFixed(0)}%
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
                    <Text fw={900}>Tiến trình lên hạng {levelNextUser.viName}</Text>

                    <Text size='sm' className='text-white/70'>
                      Còn {remainingPoint} điểm
                    </Text>
                  </Group>

                  <Progress
                    value={progressValue}
                    size='lg'
                    radius='xl'
                    color={levelUser.color}
                    classNames={{
                      root: 'bg-backgroundAdmin/15'
                    }}
                  />

                  <Group mt='sm' justify='space-between'>
                    <Text size='xs' className='text-white/55'>
                      Hiện tại
                    </Text>

                    <Text size='xs' className='text-white/55'>
                      {levelNextUser.viName}
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
                          {levelNextUser.viName}
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
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}
