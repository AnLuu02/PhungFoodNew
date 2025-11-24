import { Alert, Avatar, Badge, Box, Button, Card, Flex, Text, Title } from '@mantine/core';
import {
  IconAward,
  IconBrandZapier,
  IconCrown,
  IconGiftFilled,
  IconHeart,
  IconSparkles,
  IconStar,
  IconTrophy
} from '@tabler/icons-react';
import { Metadata } from 'next';
import Link from 'next/link';
import LayoutPromotion from '~/components/Web/Home/Section/Layout-Promotion';
import { api } from '~/trpc/server';
import FooterSection from './components/FooterSection';
import InfoLevelUser from './components/InfoLevelUser';
import PromotionSection from './components/PromotionSection';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Khuyến mãi hấp dẫn - Phụng Food',
  description: 'Cập nhật ưu đãi và giảm giá các món ăn miền Tây tại Phụng Food. Đặt hàng ngay để nhận ưu đãi.'
};
export default async function FoodPromotionPage() {
  const productData = await api.Product.find({
    skip: 0,
    take: 10,
    discount: true
  });
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
      className:
        'md:w-[30%] w-[80vw] sm:w-[45%] lg:w-[19%] flex-shrink-0 lg:scale-105 bg-yellow-50 dark:bg-yellow-900 hover:bg-yellow-100 dark:hover:bg-yellow-800',
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
  return (
    <Box className='min-h-screen bg-mainColor/10' mx={{ base: -10, sm: -30, lg: -130 }} mt={-16}>
      <Box className='relative overflow-hidden bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(/images/png/banner_food.png)] bg-cover bg-no-repeat px-4 py-16 text-white sm:py-24'>
        <Box className='relative z-10 mx-auto max-w-6xl text-center'>
          <Box className='mb-8'>
            <Badge
              leftSection={<IconSparkles className='h-5 w-5' />}
              size='xl'
              className='animate-fadeUp border-white/30 bg-white/20 text-xs text-white backdrop-blur-sm md:text-lg'
              style={{ animationDuration: '0.5s' }}
            >
              Ưu đãi đặc biệt cho thành viên mới
            </Badge>
          </Box>
          <Title
            className='mb-6 animate-fadeUp text-balance font-quicksand text-4xl font-black text-white md:mb-8 md:text-6xl'
            style={{ animationDuration: '1s' }}
          >
            Thưởng Thức & Nhận Thưởng!
          </Title>
          <Text
            className='text-md mx-auto mb-6 max-w-4xl animate-fadeUp text-pretty leading-relaxed text-white/90 md:mb-10 md:text-2xl'
            style={{ animationDuration: '1.5s' }}
          >
            Tham gia ngay chương trình khách hàng thân thiết của chúng tôi để mở khóa <b>ưu đãi hấp dẫn</b>, tích điểm
            với mỗi món ăn yêu thích và tận hưởng <b>đặc quyền VIP</b> chỉ dành riêng cho bạn.
          </Text>
          <Box className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button
              radius={'md'}
              size='lg'
              className='h-auto animate-fadeUp bg-subColor px-6 py-3 text-lg text-black shadow-xl duration-300 hover:scale-105 hover:bg-mainColor hover:text-white'
              style={{ animationDuration: '2s' }}
            >
              <Link href={'/thuc-don'}> 🛒 Đặt món ngay</Link>
            </Button>

            <Button
              radius={'md'}
              size='lg'
              variant='outline'
              style={{ animationDuration: '2.5s' }}
              className='h-auto animate-fadeUp border-subColor px-6 py-3 text-lg text-white shadow-xl duration-300 hover:scale-105 hover:border-mainColor hover:text-subColor'
            >
              <Link href={'/thuc-don'}> Xem thực đơn</Link>
            </Button>
          </Box>
        </Box>
      </Box>

      <Box className='relative z-10 mx-auto -mt-8 max-w-6xl px-4 sm:animate-bounceSlow'>
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

        <PromotionSection />

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
              <Box className='flex animate-slideRightPulse items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 shadow-sm dark:text-dark-text'>
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
                      <Box className='text-base font-medium text-gray-600 dark:text-dark-text'>{level.range}</Box>
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

        <InfoLevelUser />

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
              <Box className='flex animate-slideRightPulse items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 shadow-sm dark:text-dark-text'>
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
                className='sm:max-w-auto group max-w-[80vw] flex-shrink-0 overflow-hidden bg-white p-8 text-center transition-all duration-300 hover:shadow-2xl dark:bg-dark-card sm:min-w-[45%] sm:flex-shrink lg:min-w-[32%]'
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
                className='sm:max-w-auto group max-w-[80vw] flex-shrink-0 overflow-hidden bg-white p-8 text-center transition-all duration-300 hover:shadow-2xl dark:bg-dark-card sm:min-w-[45%] sm:flex-shrink lg:min-w-[32%]'
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
                className='sm:max-w-auto group max-w-[80vw] flex-shrink-0 overflow-hidden bg-white p-8 text-center transition-all duration-300 hover:shadow-2xl dark:bg-dark-card sm:min-w-[45%] sm:flex-shrink lg:min-w-[32%]'
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
      <FooterSection />
    </Box>
  );
}
