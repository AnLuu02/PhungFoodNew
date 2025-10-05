'use client';
import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Pagination,
  Paper,
  Progress,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import {
  IconAward,
  IconBolt,
  IconBrandZapier,
  IconCheck,
  IconClock,
  IconCrown,
  IconCurrencyDollar,
  IconGift,
  IconGiftFilled,
  IconHeart,
  IconReceiptDollarFilled,
  IconSparkles,
  IconStar,
  IconTrophy,
  IconUserPlus
} from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import Empty from '~/components/Empty';
import VoucherTemplate from '~/components/Template/voucher-template';
import LayoutPromotion from '~/components/Web/Home/Section/Layout-Promotion';
import { getInfoLevelUser } from '~/constants';
import { LocalUserLevel, LocalVoucherType } from '~/lib/zod/EnumType';
const levels = [
  {
    name: 'Đồng',
    color: '#3F2627',
    bg: '#3F262722',
    icon: IconStar,
    range: '0 - 999 điểm',
    features: ['Giảm giá 5%', 'Tặng món tráng miệng sinh nhật', 'Ưu đãi hàng tuần'],
    className: 'md:w-[30%] w-[80vw] sm:w-[45%] lg:w-[19%] flex-shrink-0 md:scale-90 hover:bg-[#3F262722]'
  },
  {
    name: 'Bạc',
    color: '#64707A',
    bg: '#64707A22',
    icon: IconTrophy,
    range: '1,000 - 2,999 điểm',
    features: [
      'Giảm giá 10%',
      'Giao hàng miễn phí cho đơn hàng từ 150.000 VND trở lên',
      'Hỗ trợ ưu tiên',
      'Cuối tuần nhân đôi điểm'
    ],
    className: 'md:w-[30%] w-[80vw] sm:w-[45%] lg:w-[19%] flex-shrink-0 md:scale-95 hover:bg-[#64707A22]'
  },
  {
    name: 'Vàng',
    color: '#FACC15',
    bg: 'bg-yellow-50',
    icon: IconCrown,
    range: '3,000 - 7,999 điểm',
    features: ['15% giảm giá', 'Miễn phí vận chuyển', 'Hỗ trợ trực tiếp', 'Monthly free meal', 'Exclusive events'],
    className: 'md:w-[30%] w-[80vw] sm:w-[45%] lg:w-[19%] flex-shrink-0 lg:scale-105 bg-yellow-50',
    badge: { text: 'Phổ biến', className: 'bg-yellow-100 text-yellow-500' }
  },
  {
    name: 'Bạch kim',
    color: '#4183A7',
    bg: '#4183A722',
    icon: IconAward,
    range: '8,000 - 14,999 điểm',
    features: [
      'Giảm giá 20%',
      'Giao hàng ưu tiên',
      'Quản lý tận tâm',
      '2 bữa ăn miễn phí/tháng',
      'Sự kiện bàn đầu bếp',
      'Đồng sáng tạo thực đơn'
    ],
    className: 'md:w-[30%] w-[80vw] sm:w-[45%] lg:w-[19%] flex-shrink-0 md:scale-95 hover:bg-[#4183A722]',
    badge: { text: 'Ưu tú', className: 'bg-[#4183A7] text-white' }
  },
  {
    name: 'Kim cương',
    color: '#5F77C3',
    bg: '#5F77C322',
    icon: IconSparkles,
    range: '15,000+ điểm',
    features: [
      'Giảm giá 25%',
      'Giao hàng ngay',
      'Dịch vụ hỗ trợ 24/7',
      'Bữa ăn miễn phí không giới hạn',
      'Ăn tối riêng tư',
      'Ưu đãi VIP hàng năm',
      'Quyền lợi trọn đời'
    ],
    className: 'md:w-[30%] w-[80vw] sm:w-[45%] lg:w-[19%] flex-shrink-0 md:scale-90 hover:bg-[#5F77C322]',
    badge: { text: 'Ưu tú', className: 'bg-[#5F77C3] text-white' }
  }
];
const ITEMS_PER_PAGE = 4;
export default function FoodPromotionPageClient({ userData, voucherData, productData }: any) {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const filteredPromotions = useMemo(() => {
    if (activeTab === 'all') return voucherData || [];
    return voucherData?.filter((promo: any) => promo.type === activeTab) || [];
  }, [voucherData, activeTab]);

  const paginatedPromotions = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return Array.isArray(filteredPromotions) ? filteredPromotions.slice(startIndex, startIndex + ITEMS_PER_PAGE) : [];
  }, [filteredPromotions, page]);

  const totalPages = useMemo(() => Math.ceil(filteredPromotions.length / ITEMS_PER_PAGE), [filteredPromotions]);
  const [levelUser, levelNextUser] = useMemo(() => {
    const levelUser = getInfoLevelUser(userData?.level || LocalUserLevel.BRONZE);
    const levelNextUser = getInfoLevelUser(levelUser?.nextLevel || LocalUserLevel.BRONZE);
    return [levelUser, levelNextUser];
  }, [userData]);
  return (
    <Box className='min-h-screen bg-mainColor/10' mx={{ base: -10, sm: -30, lg: -130 }} mt={-16}>
      <Box className='relative overflow-hidden bg-mainColor px-4 py-16 text-white sm:py-24'>
        <Box className='relative z-10 mx-auto max-w-6xl text-center'>
          <Box className='mb-8'>
            <Badge
              variant='secondary'
              leftSection={<IconSparkles className='h-5 w-5' />}
              size='xl'
              className='border-white/30 bg-white/20 text-xs text-white backdrop-blur-sm md:text-lg'
            >
              Ưu đãi đặc biệt cho thành viên mới
            </Badge>
          </Box>
          <Title className='mb-6 text-balance font-quicksand text-4xl font-black text-white md:mb-8 md:text-6xl'>
            Thưởng Thức & Nhận Thưởng!
          </Title>
          <Text className='text-md mx-auto mb-6 max-w-4xl text-pretty leading-relaxed text-white/90 md:mb-10 md:text-2xl'>
            Tham gia ngay chương trình khách hàng thân thiết của chúng tôi để mở khóa <b>ưu đãi hấp dẫn</b>, tích điểm
            với mỗi món ăn yêu thích và tận hưởng <b>đặc quyền VIP</b> chỉ dành riêng cho bạn.
          </Text>
          <Box className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button
              size='lg'
              className='h-auto bg-subColor px-6 py-3 text-lg text-black shadow-xl duration-300 hover:scale-105 hover:bg-mainColor hover:text-white'
            >
              <Link href={'/thuc-don'}> 🛒 Đặt món ngay</Link>
            </Button>

            <Button
              size='lg'
              variant='outline'
              className='h-auto border-subColor px-6 py-3 text-lg text-white shadow-xl duration-300 hover:scale-105 hover:border-mainColor hover:text-subColor'
            >
              <Link href={'/thuc-don'}> Xem thực đơn</Link>
            </Button>
          </Box>
        </Box>
      </Box>

      <Box className='relative z-10 mx-auto -mt-8 max-w-6xl px-4'>
        <Alert
          icon={
            <Box className='relative'>
              <IconBrandZapier className='h-7 w-7 animate-pulse text-yellow-600' />
              <span className='absolute inset-0 animate-ping rounded-full bg-yellow-400 opacity-30'></span>
            </Box>
          }
          className='relative overflow-hidden rounded-2xl border-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 text-mainColor shadow-2xl'
        >
          <Box className='absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.4),transparent)]' />

          <Box className='relative z-10'>
            <Text className='flex items-center gap-2 text-xl font-extrabold'>
              🔥 Ưu Đãi Có Hạn!
              <span className='animate-bounce text-red-600'>⏰</span>
            </Text>

            <Text fw={700} size='lg' className='mt-2 leading-relaxed'>
              Đăng ký ngay hôm nay để nhận <strong className='text-red-600'>500 điểm thưởng</strong> và{' '}
              <strong className='text-blue-700'>Voucher giảm giá lên đến 20%</strong> cho đơn hàng đầu tiên!
            </Text>
          </Box>
        </Alert>
      </Box>

      <Box className='space-y-24 py-20' px={{ base: 10, sm: 30, md: 30, lg: 130 }}>
        <Box>
          <Box className='mb-12 text-center'>
            <Badge
              radius={'sm'}
              leftSection={<IconGiftFilled className='h-4 w-4' />}
              className='mb-4 bg-mainColor/20 text-mainColor'
            >
              Ưu Đãi Nóng
            </Badge>
            <Title className='mb-4 text-balance font-quicksand text-3xl font-bold text-mainColor sm:text-5xl'>
              Khuyến Mãi Khó Cưỡng
            </Title>
            <Text c={'dimmed'} className='mx-auto max-w-2xl text-pretty text-lg'>
              Nhanh tay săn ngay những ưu đãi hấp dẫn này trước khi biến mất! Số lượng có hạn.
            </Text>
          </Box>

          {productData?.products?.length > 0 && (
            <Box className='mb-16'>
              <LayoutPromotion data={productData.products} />
            </Box>
          )}
        </Box>

        {paginatedPromotions?.length > 0 && (
          <Box>
            <Box className='mb-12 text-center'>
              <Badge
                radius={'sm'}
                size='md'
                leftSection={<IconReceiptDollarFilled className='h-4 w-4' />}
                className='mb-4 bg-orange-50 text-xs text-orange-600'
              >
                Khuyến mãi hấp dẫn
              </Badge>
              <Title className='mb-4 text-balance font-quicksand text-3xl font-bold text-orange-600 sm:text-5xl'>
                Số lượng có hạn
              </Title>
              <Text c={'dimmed'} className='mx-auto max-w-2xl text-pretty text-lg'>
                Nhanh tay săn nhận ngay những voucher giảm giá sâu, ăn thả ga! Số lượng có hạn.
              </Text>
            </Box>

            <Card withBorder shadow='sm' padding='lg' radius='lg'>
              <Tabs
                variant='pills'
                value={activeTab}
                onChange={(value: any) => {
                  setActiveTab(value);
                  setPage(1);
                }}
                styles={{
                  tab: {
                    border: '1px solid ',
                    marginRight: 6
                  }
                }}
                classNames={{
                  tab: `!rounded-md !border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-white`
                }}
              >
                <Flex
                  gap={'md'}
                  direction={{ base: 'column', md: 'row' }}
                  justify={'space-between'}
                  className='items-center sm:items-start md:items-center'
                >
                  <Group align='center'>
                    <ThemeIcon
                      size='xl'
                      classNames={{
                        root: 'bg-subColor text-white'
                      }}
                    >
                      <IconGift />
                    </ThemeIcon>
                    <Stack gap={1}>
                      <Title order={3} className='font-quicksand'>
                        Nhận thưởng ngay
                      </Title>
                      <Text size='xs' c={'dimmed'}>
                        Có {filteredPromotions.length || 0} voucher
                      </Text>
                    </Stack>
                  </Group>
                  <Divider w={'60%'} className='sm:hidden' />
                  <Tabs.List>
                    <Group gap={0}>
                      <Tabs.Tab size={'md'} fw={700} value='all'>
                        Tất cả
                      </Tabs.Tab>
                      <Tabs.Tab size={'md'} fw={700} value={LocalVoucherType.PERCENTAGE}>
                        Phầm trăm
                      </Tabs.Tab>
                      <Tabs.Tab size={'md'} fw={700} value={LocalVoucherType.FIXED}>
                        Tiền mặt
                      </Tabs.Tab>
                    </Group>
                  </Tabs.List>
                </Flex>

                <Divider my='sm' />
                <Tabs.Panel value={activeTab || 'all'}>
                  {paginatedPromotions?.length > 0 ? (
                    <Grid mt='md'>
                      {paginatedPromotions.map((promo: any) => (
                        <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }} key={promo.id}>
                          <VoucherTemplate voucher={promo} />
                        </GridCol>
                      ))}
                    </Grid>
                  ) : (
                    <Empty
                      title='Không có khuyến mãi nào'
                      content='Vui lòng quay lại sau. Xin cảm ơn!'
                      size='xs'
                      hasButton={false}
                    />
                  )}
                  <Flex
                    mt='xl'
                    justify='flex-end'
                    align={'center'}
                    gap={'md'}
                    direction={{ base: 'column-reverse', md: 'row' }}
                  >
                    <Pagination
                      total={totalPages}
                      value={page}
                      onChange={setPage}
                      classNames={{
                        control:
                          'hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white'
                      }}
                    />
                  </Flex>
                </Tabs.Panel>
              </Tabs>
            </Card>
          </Box>
        )}

        <Box>
          <Box className='mb-12 text-center'>
            <Badge
              radius={'sm'}
              leftSection={<IconAward className='h-4 w-4' />}
              className='mb-4 bg-purple-100 text-purple-700'
            >
              Cấp Độ Thành Viên
            </Badge>
            <Title className='mb-4 text-balance font-quicksand text-3xl font-bold text-purple-600 sm:text-5xl'>
              Leo Thang Phần Thưởng
            </Title>
            <Text c={'dimmed'} className='mx-auto max-w-2xl text-pretty text-lg'>
              Mỗi đơn hàng đưa bạn đến gần hơn với những đặc quyền và ưu đãi độc quyền
            </Text>
          </Box>

          <Box className='relative'>
            <Box className='relative mb-4 mr-4 flex items-end justify-end lg:hidden'>
              <Box className='flex animate-slide-right items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 shadow-sm dark:text-white'>
                <span>Kéo để xem thêm</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 text-mainColor'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 12h16m-6-6l6 6-6 6' />
                </svg>
              </Box>
            </Box>

            <Box className='flex gap-4 overflow-x-auto pb-2 lg:overflow-x-visible'>
              {levels.map((level, i) => {
                const Icon = level.icon;
                return (
                  <Card
                    key={i}
                    radius='lg'
                    padding={0}
                    withBorder
                    className={`relative overflow-hidden px-4 py-10 text-center shadow-xl transition-all duration-300 hover:shadow-2xl ${level.className}`}
                  >
                    <Box className='absolute left-0 right-0 top-0 h-2' style={{ backgroundColor: level.color }} />

                    {level.badge && (
                      <Box className='absolute right-3 top-3'>
                        <Badge size='xs' className={level.badge.className}>
                          {level.badge.text}
                        </Badge>
                      </Box>
                    )}

                    <Box className='pb-6'>
                      <Box
                        className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-lg'
                        style={{ backgroundColor: level.color }}
                      >
                        <Icon className='h-8 w-8 text-white' />
                      </Box>
                      <Title order={3} className='font-quicksand text-2xl font-bold' style={{ color: level.color }}>
                        {level.name}
                      </Title>
                      <Box className='text-base font-medium text-gray-600 dark:text-white'>{level.range}</Box>
                    </Box>

                    <Box className='space-y-3'>
                      <Box className='space-y-2 text-left'>
                        {level.features.map((f, idx) => (
                          <Text key={idx} className='flex items-center text-sm'>
                            <span className='mr-3 h-2 w-2 rounded-full' style={{ backgroundColor: level.color }}></span>
                            <span className='flex-1'>{f}</span>
                          </Text>
                        ))}
                      </Box>
                    </Box>
                  </Card>
                );
              })}
            </Box>
          </Box>
        </Box>

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
              <Card padding={'lg'} shadow='xl' radius={'lg'} className='border-0 bg-white'>
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

              <Card padding={'lg'} shadow='xl' radius={'lg'} className='border-0 bg-white'>
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
                <Card padding={'lg'} shadow='xl' radius={'lg'} className='border-0 bg-white shadow-2xl'>
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
                  className='relative overflow-hidden border-0 bg-white shadow-2xl'
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
                          <span className='text-gray-700 dark:text-white'>8 đơn hàng × trung bình 250.000 VND</span>
                          <span className='font-bold text-orange-600'>250 điểm</span>
                        </Box>
                        <Box className='flex items-center justify-between'>
                          <span className='text-gray-700 dark:text-white'>Tiền thưởng cuối tuần (gấp đôi điểm)</span>
                          <span className='font-bold text-orange-600'>+500 điểm</span>
                        </Box>
                        <Box className='flex items-center justify-between'>
                          <span className='text-gray-700 dark:text-white'>Tiền thưởng đăng ký</span>
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

              <Card padding={'lg'} shadow='xl' radius={'lg'} className='border-0 bg-white'>
                <Box mb={'md'}>
                  <Title className='font-quicksand text-2xl'>🎯 Cách kiếm điểm</Title>
                  <Text>Tối đa hóa điểm của bạn bằng những chiến lược này!</Text>
                </Box>
                <Box className='space-y-4'>
                  <Box className='rounded-lg border border-solid border-yellow-200 bg-yellow-50 p-4'>
                    <Text className='text-lg font-semibold text-yellow-800'>
                      💡 Đặt hàng cuối tuần nhận gấp đôi điểm
                    </Text>
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

        <Box>
          <Box className='mb-12 text-center'>
            <Badge
              radius={'sm'}
              leftSection={<IconHeart className='h-4 w-4' />}
              className='mb-4 bg-red-100 text-red-700'
            >
              Khách hàng yêu thích
            </Badge>
            <Title className='mb-4 text-balance font-quicksand text-3xl font-bold text-pink-600 sm:text-5xl'>
              Niềm tin khách hàng
            </Title>
            <Text c={'dimmed'} className='mx-auto max-w-2xl text-pretty text-lg'>
              Hơn 50.000 thành viên hài lòng đang tiết kiệm tiền và tận hưởng từng bữa ăn ngon
            </Text>
          </Box>

          <Box className='relative'>
            <Box className='relative mb-4 mr-4 flex items-end justify-end md:hidden'>
              <Box className='flex animate-slide-right items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 shadow-sm dark:text-white'>
                <span>Kéo để xem thêm</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 text-mainColor'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 12h16m-6-6l6 6-6 6' />
                </svg>
              </Box>
            </Box>

            <Box className='flex gap-4 overflow-x-auto pb-2 lg:overflow-x-visible'>
              <Card
                shadow='xl'
                padding={'lg'}
                radius={'lg'}
                className='sm:max-w-auto group max-w-[80vw] flex-shrink-0 overflow-hidden bg-white p-8 text-center transition-all duration-300 hover:shadow-2xl sm:min-w-[45%] sm:flex-shrink lg:min-w-[32%]'
              >
                <Box mb={'md'}>
                  <Box className='flex flex-col items-center space-x-4 sm:flex-row'>
                    <Avatar src={'/images/png/403.png'} className='h-16 w-16 border-4 border-solid border-yellow-200' />
                    <Flex
                      direction={'column'}
                      className='mt-2 items-center justify-center sm:mt-0 sm:items-start sm:justify-start'
                      gap={4}
                    >
                      <Title className='font-quicksand text-xl'>Nguyễn Hải Nam</Title>
                      <Badge size='sm' className='bg-yellow-400 text-white'>
                        {' '}
                        Thành viên Vàng
                      </Badge>
                    </Flex>
                  </Box>
                </Box>
                <Box>
                  <Text size='md' c={'dimmed'} className='text-start leading-relaxed'>
                    "Tôi đã tiết kiệm hơn <b>4.000.000 đồng trong năm nay</b> nhờ chương trình khách hàng thân thiết!
                    Suất ăn miễn phí hàng tháng cho thành viên Vàng thật sự tuyệt vời. Quyết định sáng suốt nhất! 🎉"
                  </Text>
                  <Box className='mt-4 flex'>
                    {[...Array(5)].map((_, i) => (
                      <IconStar key={i} className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                    ))}
                  </Box>
                </Box>
              </Card>

              <Card
                shadow='xl'
                padding={'lg'}
                radius={'lg'}
                className='sm:max-w-auto group max-w-[80vw] flex-shrink-0 overflow-hidden bg-white p-8 text-center transition-all duration-300 hover:shadow-2xl sm:min-w-[45%] sm:flex-shrink lg:min-w-[32%]'
              >
                <Box mb={'md'}>
                  <Box className='flex flex-col items-center space-x-4 sm:flex-row'>
                    <Avatar src={'/images/png/403.png'} className='h-16 w-16 border-4 border-solid' />
                    <Flex
                      direction={'column'}
                      className='mt-2 items-center justify-center sm:mt-0 sm:items-start sm:justify-start'
                      gap={4}
                    >
                      <Title className='font-quicksand text-xl'>Nguyễn Thùy Linh</Title>
                      <Badge size='sm' className='bg-gray-400 text-white'>
                        Thành viên Bạc
                      </Badge>
                    </Flex>
                  </Box>
                </Box>
                <Box>
                  <Text size='md' c={'dimmed'} className='text-start leading-relaxed'>
                    "Ứng dụng giúp đặt món thật tiện lợi, và tôi thích việc tích điểm cho mỗi lần mua. Tháng này tôi đã
                    đổi được <b>3 suất ăn miễn phí</b> rồi! Ưu đãi ngày càng hấp dẫn! 🍔"
                  </Text>
                  <Box className='mt-4 flex'>
                    {[...Array(5)].map((_, i) => (
                      <IconStar key={i} className='h-5 w-5 fill-blue-400 text-blue-400' />
                    ))}
                  </Box>
                </Box>
              </Card>

              <Card
                shadow='xl'
                padding={'lg'}
                radius={'lg'}
                className='sm:max-w-auto group max-w-[80vw] flex-shrink-0 overflow-hidden bg-white p-8 text-center transition-all duration-300 hover:shadow-2xl sm:min-w-[45%] sm:flex-shrink lg:min-w-[32%]'
              >
                <Box mb={'md'}>
                  <Box className='flex flex-col items-center space-x-4 sm:flex-row'>
                    <Avatar src={'/images/png/403.png'} className='h-16 w-16 border-4 border-solid border-green-200' />
                    <Flex
                      direction={'column'}
                      className='mt-2 items-center justify-center sm:mt-0 sm:items-start sm:justify-start'
                      gap={4}
                    >
                      <Title className='font-quicksand text-xl'>Lưu Trường An</Title>
                      <Badge size='sm' className='bg-yellow-400 text-white'>
                        Thành viên Vàng
                      </Badge>
                    </Flex>
                  </Box>
                </Box>
                <Box>
                  <Text size='md' c={'dimmed'} className='text-start leading-relaxed'>
                    "Hoàn hảo cho gia đình! Chúng tôi tích điểm cho mỗi đơn hàng và bọn trẻ cực kỳ thích những món quà
                    sinh nhật bất ngờ. <b>Ưu đãi thân thiện với gia đình</b> thực sự hữu ích! 👨‍👩‍👧‍👦"
                  </Text>
                  <Box className='mt-4 flex'>
                    {[...Array(5)].map((_, i) => (
                      <IconStar key={i} className='h-5 w-5 fill-green-400 text-green-400' />
                    ))}
                  </Box>
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className='relative overflow-hidden bg-mainColor px-4 py-16 text-white sm:py-24'>
        <Box className='relative z-10 mx-auto max-w-6xl text-center'>
          {userData?.id ? (
            <>
              <Title className='mb-6 text-balance font-quicksand text-4xl font-black text-white md:mb-8 md:text-6xl'>
                🍔 Đặt Hàng & Kiếm Điểm Ngay!
              </Title>
              <Text className='text-md mx-auto mb-6 max-w-4xl text-pretty font-medium leading-relaxed text-white/90 md:mb-10 md:text-2xl'>
                Bạn đang ở <b className={`text-subColor`}>{levelUser.viName}</b> với {userData?.pointUser} điểm! Chỉ cần
                thêm {levelUser.maxPoint + 1 - (userData?.pointUser || 0)} điểm nữa để lên{' '}
                <b className={`text-subColor`}> {levelNextUser.viName}</b> và nhận 15% giảm giá cho mọi đơn hàng.
              </Text>
              <Box className='flex flex-col items-center justify-center gap-8 sm:flex-row'>
                <Button
                  size='lg'
                  className='h-auto bg-subColor px-6 py-3 text-lg text-black shadow-xl duration-300 hover:scale-105 hover:bg-mainColor hover:text-white'
                >
                  <Link href={'/thuc-don'}> 🛒 Đặt món ngay</Link>
                </Button>

                <Button
                  size='lg'
                  variant='outline'
                  className='h-auto border-subColor px-6 py-3 text-lg text-white shadow-xl duration-300 hover:scale-105 hover:border-mainColor hover:text-subColor'
                >
                  <Link href={'/thong-tin'}> 👑 Xem Tiến Trình</Link>
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Title className='mb-8 text-balance font-quicksand text-6xl font-bold text-white'>
                🚀 Sẵn Sàng Bắt Đầu Kiếm Điểm?
              </Title>
              <Text className='text-md mx-auto mb-6 max-w-4xl text-pretty font-medium leading-relaxed text-white/90 md:mb-10 md:text-2xl'>
                Tham gia cùng hơn <b>50.000 thành viên</b> đang tiết kiệm tiền và tận hưởng các đặc quyền độc quyền.
                Đăng ký chỉ mất chưa đến 2 phút và bạn sẽ bắt đầu kiếm điểm ngay lập tức!
              </Text>
              <Box className='flex flex-col items-center justify-center gap-8 sm:flex-row'>
                <Button
                  size='lg'
                  className='h-auto bg-subColor px-6 py-3 text-lg text-black shadow-xl duration-300 hover:scale-105 hover:bg-mainColor hover:text-white'
                >
                  <Link href={'/thuc-don'}> 🔑 Đã Có Tài Khoản? Đăng Nhập</Link>
                </Button>

                <Button
                  size='lg'
                  variant='outline'
                  className='h-auto border-subColor px-6 py-3 text-lg text-white shadow-xl duration-300 hover:scale-105 hover:border-mainColor hover:text-subColor'
                >
                  <Link href={'/thuc-don'}> 👑 Tham Gia Miễn Phí - Nhận 500 Điểm!</Link>
                </Button>
              </Box>
            </>
          )}

          <Box className='mt-10 text-white/95'>
            <Grid justify='center'>
              <GridCol span={4}>
                <Group gap={8} align='center' className='justify-center sm:justify-end'>
                  <ActionIcon radius={'xl'} className='bg-green-500'>
                    <IconCheck size={20} stroke={2} />
                  </ActionIcon>
                  <Text className='font-medium text-white/95'>Không phí dịch vụ</Text>
                </Group>
              </GridCol>
              <GridCol span={4}>
                <Group gap={8} align='center' className='justify-center'>
                  <ActionIcon radius={'xl'} className='bg-blue-500'>
                    <IconClock size={20} stroke={2} />
                  </ActionIcon>
                  <Text className='font-medium text-white/95'>Điểm không bao giờ hết hạn</Text>
                </Group>
              </GridCol>
              <GridCol span={4}>
                <Group gap={8} align='center' className='justify-center sm:justify-start'>
                  <ActionIcon radius={'xl'} className='bg-yellow-500'>
                    <IconBolt size={20} stroke={2} />
                  </ActionIcon>
                  <Text className='font-medium text-white/95'>Quyền lợi tức thì</Text>
                </Group>
              </GridCol>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
