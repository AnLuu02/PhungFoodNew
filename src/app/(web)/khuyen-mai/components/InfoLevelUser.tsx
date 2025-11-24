'use client';
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  NumberFormatter,
  Paper,
  Progress,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { IconBolt, IconBrandZapier, IconCurrencyDollar, IconUserPlus } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { getInfoLevelUser } from '~/constants';
import { LocalUserLevel } from '~/lib/ZodSchema/enum';
import { api } from '~/trpc/react';

export default function InfoLevelUser() {
  const { data: session } = useSession();
  const { data: userData } = api.User.getOne.useQuery(
    { s: session?.user.email || '', hasOrders: true },
    {
      enabled: !!session?.user.email
    }
  );
  const [levelUser, levelNextUser] = useMemo(() => {
    const levelUser = getInfoLevelUser((userData?.level as LocalUserLevel) || LocalUserLevel.BRONZE);
    const levelNextUser = getInfoLevelUser(levelUser?.nextLevel || LocalUserLevel.BRONZE);
    return [levelUser, levelNextUser];
  }, [userData]);
  return (
    <>
      <Box>
        <Box className='mb-12 text-center'>
          <Badge
            radius={'sm'}
            leftSection={<IconBrandZapier className='mr-2 h-4 w-4' />}
            className='mb-4 bg-blue-100 text-blue-700'
          >
            Hệ thống tích điểm
          </Badge>
          <Title className='mb-4 text-balance font-quicksand text-3xl font-bold text-blue-600 sm:text-5xl'>
            Mỗi 10k = Nhiều phần thưởng hơn
          </Title>
          <Text c={'dimmed'} className='mx-auto max-w-2xl text-pretty text-lg'>
            Điểm sẽ tăng theo từng đơn hàng ngon lành và mở khóa nhiều phần thưởng hấp dẫn
          </Text>
        </Box>

        <Box className='grid items-center gap-16 lg:grid-cols-2'>
          <Box className='space-y-8'>
            <Card padding={'lg'} shadow='xl' radius={'lg'} className='border-0 bg-white dark:bg-dark-card'>
              <Title className='flex items-center font-quicksand text-2xl'>
                <Box className='mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-lg'>
                  <IconCurrencyDollar className='h-6 w-6 text-white' />
                </Box>
                Kiếm điểm trên mỗi đơn hàng
              </Title>
              <Box>
                <Text className='my-5'>
                  Nhận 10 điểm cho mỗi 100.000 VND chi tiêu cho các đơn hàng. Số lượng không giới hạn. Mua càng nhiều,
                  điểm càng cao, ăn càng sướng!
                </Text>
                <Paper withBorder radius={'lg'} className='border border-blue-200 bg-blue-50 p-6'>
                  <Text size='xl' fw={700} className='text-blue-800'>
                    Ví dụ: Đơn 100.000 VND = 10 điểm 🎯
                  </Text>
                  <Text className='mt-2 text-blue-600'>Thêm điểm thưởng vào cuối tuần và cho các món đặc biệt!</Text>
                </Paper>
              </Box>
            </Card>

            <Card padding={'lg'} shadow='xl' radius={'lg'} className='border-0 bg-white dark:bg-dark-card'>
              <Box mb={'md'}>
                <Title className='flex items-center font-quicksand text-2xl'>
                  <Box className='mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-lg'>
                    <IconBolt className='h-6 w-6 text-white' />
                  </Box>
                  Cơ hội điểm thưởng
                </Title>
              </Box>
              <Box>
                <Box className='space-y-4'>
                  <Box className='flex items-center justify-between rounded-lg border border-solid border-green-200 bg-green-50 p-4'>
                    <span className='text-lg font-semibold'>🎉 Đơn hàng cuối tuần</span>
                    <Badge size='lg' py={'sm'} radius={'md'} className='bg-green-500 text-white'>
                      x2 điểm
                    </Badge>
                  </Box>
                  <Box className='flex items-center justify-between rounded-lg border border-solid border-orange-200 bg-orange-50 p-4'>
                    <span className='text-lg font-semibold'>🎂 Tháng sinh nhật</span>
                    <Badge size='lg' py={'sm'} radius={'md'} className='bg-orange-500 text-white'>
                      x3 điểm
                    </Badge>
                  </Box>
                  <Box className='flex items-center justify-between rounded-lg border border-solid border-purple-200 bg-purple-50 p-4'>
                    <span className='text-lg font-semibold'>🎪 Sự kiện đặc biệt</span>
                    <Badge size='lg' py={'sm'} radius={'md'} className='bg-purple-500 text-white'>
                      x5 điểm
                    </Badge>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>

          <Box className='space-y-8'>
            {userData?.id ? (
              <Card padding={'lg'} shadow='xl' radius={'lg'} className='border-0 bg-white shadow-2xl dark:bg-dark-card'>
                <Stack>
                  <Title className='flex items-center justify-between font-quicksand text-2xl'>
                    Tiến độ
                    <Badge
                      radius={'md'}
                      size='xl'
                      py={'lg'}
                      className={`text-lg text-white`}
                      style={{ backgroundColor: levelUser.color }}
                    >
                      {levelUser.viName}
                    </Badge>
                  </Title>
                  <Divider />

                  <Flex gap={'md'} align={'center'}>
                    <Text size='md'>
                      Hiện có <b>{userData.pointUser}</b> điểm
                    </Text>
                    <Text>-/-</Text>
                    <Text size='md'>
                      Cần <b>{levelUser.maxPoint + 1 - (userData?.pointUser || 0)}</b> điểm để lên hạng{' '}
                      <b>{levelNextUser.viName}</b>
                    </Text>
                  </Flex>
                  <Divider />
                  <Box>
                    <Box className='mb-3 flex justify-between text-lg font-semibold'>
                      <span>Tiến trình lên hạng Vàng</span>
                      <span className={`text-[${levelUser.color}]`}>
                        {((userData?.pointUser || 0) / (levelUser.maxPoint + 1)) * 100}%
                      </span>
                    </Box>
                    <Progress
                      value={((userData?.pointUser || 0) / (levelUser.maxPoint + 1)) * 100}
                      color={levelUser.color}
                      size='md'
                      radius='xl'
                    />
                    <Text size='sm' c={'dimmed'} className='mt-2'>
                      Chỉ cần thêm {levelUser.maxPoint + 1 - (userData?.pointUser || 0)} điểm tích lũy nữa để đạt hạng{' '}
                      {levelNextUser.viName}!
                    </Text>
                  </Box>

                  <Box className='grid grid-cols-2 gap-6 pt-4'>
                    <Paper
                      withBorder
                      radius={'lg'}
                      className='border-orange-200 bg-orange-50 p-3 text-center shadow-lg'
                    >
                      <Title order={1} fw={700} className='font-quicksand text-orange-600'>
                        <NumberFormatter value={userData.pointUser} thousandSeparator='.' decimalSeparator=',' />
                      </Title>
                      <Text size='sm' fw={500} c={'dimmed'}>
                        Tổng điểm
                      </Text>
                    </Paper>
                    <Paper
                      withBorder
                      radius={'lg'}
                      className='border-blue-200 bg-blue-100 p-3 text-center font-quicksand shadow-lg'
                    >
                      <Title order={1} fw={700} className='font-quicksand text-blue-600'>
                        {userData.order.length || 0}
                      </Title>
                      <Text size='sm' fw={500} c={'dimmed'}>
                        Đơn hàng trong năm
                      </Text>
                    </Paper>
                  </Box>
                </Stack>
              </Card>
            ) : (
              <Card
                padding={'lg'}
                shadow='xl'
                radius={'lg'}
                className='relative overflow-hidden border-0 bg-white shadow-2xl dark:bg-dark-card'
              >
                <Box className='absolute left-0 right-0 top-0 h-2 bg-orange-400'></Box>
                <Box mb={'md'}>
                  <Title className='flex items-center justify-between font-quicksand text-2xl'>
                    Kiếm điểm ngay hôm nay!
                    <Button size='md' radius={'xl'} className='bg-orange-500 text-lg text-white hover:bg-orange-600'>
                      Tham gia
                    </Button>
                  </Title>
                  <Text mt={'xs'}>Xem bạn có thể kiếm được bao nhiêu khi trở thành thành viên</Text>
                </Box>
                <Box className='space-y-6'>
                  <Box className='rounded-lg border-2 border-orange-200 bg-orange-50 p-6'>
                    <Title className='mb-4 font-quicksand text-xl font-bold text-orange-800'>
                      🎯 Ví dụ: Tháng đầu tiên của bạn
                    </Title>
                    <Box className='space-y-3'>
                      <Box className='flex items-center justify-between'>
                        <span className='text-gray-700 dark:text-dark-text'>8 đơn hàng × trung bình 250.000 VND</span>
                        <span className='font-bold text-orange-600'>250 điểm</span>
                      </Box>
                      <Box className='flex items-center justify-between'>
                        <span className='text-gray-700 dark:text-dark-text'>Tiền thưởng cuối tuần (gấp đôi điểm)</span>
                        <span className='font-bold text-orange-600'>+500 điểm</span>
                      </Box>
                      <Box className='flex items-center justify-between'>
                        <span className='text-gray-700 dark:text-dark-text'>Tiền thưởng đăng ký</span>
                        <span className='font-bold text-orange-600'>+500 điểm</span>
                      </Box>
                      <hr className='border-orange-200' />
                      <Box className='flex items-center justify-between text-lg'>
                        <span className='font-bold text-orange-800'> Tổng số điểm kiếm được</span>
                        <span className='text-xl font-bold text-orange-600'>3,000 điểm</span>
                      </Box>
                      <Box className='rounded-lg border border-yellow-300 bg-yellow-100 p-3'>
                        <Text className='text-center font-semibold text-yellow-800'>
                          🎉 Xin chúc mừng! Bạn đã đạt trạng thái Vàng!{' '}
                        </Text>
                      </Box>
                    </Box>
                  </Box>

                  <Box className='grid grid-cols-2 gap-6 pt-4'>
                    <Paper
                      withBorder
                      radius={'lg'}
                      className='border-orange-200 bg-orange-50 p-3 text-center shadow-lg'
                    >
                      <Title order={1} fw={700} className='font-quicksand text-orange-600'>
                        15%
                      </Title>
                      <Text size='sm' fw={500} c={'dimmed'}>
                        Giảm giá vàng
                      </Text>
                    </Paper>
                    <Paper withBorder radius={'lg'} className='border-blue-200 bg-blue-100 p-3 text-center shadow-lg'>
                      <Title order={1} fw={700} className='font-quicksand text-blue-600'>
                        450k
                      </Title>
                      <Text size='sm' fw={500} c={'dimmed'}>
                        Tiết kiệm hàng tháng
                      </Text>
                    </Paper>
                  </Box>

                  <Box className='pt-4'>
                    <Button
                      leftSection={<IconUserPlus className='mr-2 h-5 w-5' />}
                      radius={'lg'}
                      className='w-full transform bg-orange-500 text-lg text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-orange-600'
                    >
                      Đăng ký miễn phí và bắt đầu kiếm điểm!
                    </Button>
                  </Box>
                </Box>
              </Card>
            )}

            <Card padding={'lg'} shadow='xl' radius={'lg'} className='border-0 bg-white dark:bg-dark-card'>
              <Box mb={'md'}>
                <Title className='font-quicksand text-2xl'>🎯 Cách kiếm điểm</Title>
                <Text>Tối đa hóa điểm của bạn bằng những chiến lược này!</Text>
              </Box>
              <Box className='space-y-4'>
                <Box className='rounded-lg border border-solid border-yellow-200 bg-yellow-50 p-4'>
                  <Text className='text-lg font-semibold text-yellow-800'>💡 Đặt hàng cuối tuần nhận gấp đôi điểm</Text>
                  <Text className='mt-1 text-sm text-yellow-700'>
                    Vào thứ Bảy và Chủ Nhật được cộng 20 điểm cho mỗi 10.000 VND
                  </Text>
                </Box>
                <Box className='rounded-lg border border-solid border-purple-200 bg-purple-50 p-4'>
                  <Text className='text-lg font-semibold text-purple-800'>
                    🎪 Tham gia sự kiện nhận điểm thưởng triền miên
                  </Text>
                  <Text className='mt-1 text-sm text-purple-700'>
                    Theo dõi chúng tôi để biết các sự kiện tích điểm độc quyền
                  </Text>
                </Box>
                <Box className='rounded-lg border border-solid border-green-200 bg-green-50 p-4'>
                  <Text className='text-lg font-semibold text-green-800'>🎂 Tháng sinh nhật = điểm gấp ba</Text>
                  <Text className='mt-1 text-sm text-green-700'>
                    Kiếm 30 điểm cho mỗi 1 đô la trong tháng sinh nhật của bạn
                  </Text>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
}
