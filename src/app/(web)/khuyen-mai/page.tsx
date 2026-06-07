import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import { IconArrowRight, IconGift, IconStar } from '@tabler/icons-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PromotionTabLayout } from '~/components/PromotionTabsLayout';
import { CardFeaturedOffer } from '~/components/Web/Card/CardFeaturedOffer';
import { promotionLevels } from '~/lib/HardData/promotion-level';
import { api } from '~/trpc/server';
import { SectionHeading } from '../../../components/SectionHeading';
import { TextTyping } from '../../../components/TextTyping';
import FooterSection from './components/FooterSection';
import InfoLevelUser from './components/InfoLevelUser';
import { SectionPromotions } from './components/SectionPromotions';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Khuyến mãi hấp dẫn - Phụng Food',
  description: 'Cập nhật ưu đãi và giảm giá các món ăn miền Tây tại Phụng Food. Đặt hàng ngay để nhận ưu đãi.'
};
export default async function FoodPromotionPage() {
  const productData = await api.Product.find({
    page: 1,
    limit: 6,
    loai: 'san-pham-giam-gia'
  });
  const bestDeal = {
    id: 1,
    name: 'Cơm gà xối mỡ miền Tây',
    image: '/images/png/delicious-burger-fries.png',
    price: 59000,
    oldPrice: 79000,
    sold: 128,
    tag: 'Bán chạy'
  };
  return (
    <Box className='min-h-screen bg-mainColor/10' mx={{ base: -10, sm: -30, lg: -130 }} mt={-16}>
      <Box className='relative overflow-hidden bg-[#15110d] px-4 py-20 text-white sm:py-28'>
        <Box className='absolute inset-0 opacity-45'>
          <Image src='/images/png/banner_food.png' alt='Phụng Food promotion' className='h-full w-full object-cover' />
        </Box>

        <Box className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,138,0,0.35),transparent_35%),linear-gradient(90deg,rgba(0,0,0,0.88),rgba(0,0,0,0.42),rgba(0,0,0,0.75))]' />

        <Box className='relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]'>
          <Stack gap='xl' className='animate-fadeUp'>
            <Group gap='sm'>
              <Box className='h-px w-12 bg-orange-300' />
              <Text className='text-sm font-bold uppercase tracking-[0.28em] text-orange-200'>Deal ngon hôm nay</Text>
            </Group>

            <Stack gap={'xs'}>
              <Title className='max-w-3xl text-balance font-quicksand text-5xl font-black leading-tight text-white md:text-7xl'>
                Món ngon đang giảm,
              </Title>
              <TextTyping />
            </Stack>

            <Text className='text-white/82 max-w-2xl text-lg leading-relaxed md:text-xl'>
              Săn voucher, đặt món yêu thích và tích điểm cho lần sau. Tất cả ưu đãi nổi bật nhất của Phụng Food nằm ở
              đây.
            </Text>

            <Group gap='md'>
              <Button
                component={Link}
                href='/thuc-don'
                size='lg'
                radius='xl'
                rightSection={<IconArrowRight size={18} />}
                className='bg-orange-400 px-7 text-base font-bold text-black shadow-[0_18px_50px_rgba(255,138,0,0.35)] transition hover:scale-[1.03] hover:bg-orange-300'
              >
                Đặt ngay
              </Button>

              <Button
                component={Link}
                href='#voucher'
                size='lg'
                radius='xl'
                variant='white'
                className='border border-white/25 bg-white/10 px-7 text-base font-bold text-white backdrop-blur-md transition hover:bg-white/20'
              >
                Xem voucher
              </Button>
            </Group>

            <Group gap='xl' className='pt-4' align='center'>
              {[
                ['12K+', 'voucher đã dùng'],
                ['4.8/5', 'đánh giá món ăn'],
                ['30 phút', 'giao nhanh nội thành']
              ].map(item => (
                <Box key={item[0]}>
                  <Text className='font-quicksand text-2xl font-black text-white'>{item[0]}</Text>
                  <Text size='sm' className='text-white/65'>
                    {item[1]}
                  </Text>
                </Box>
              ))}
            </Group>
          </Stack>

          <CardFeaturedOffer bestDeal={bestDeal} />
        </Box>
      </Box>

      <Box className='relative z-20 mx-auto -mt-6 max-w-6xl px-4 sm:-mt-8'>
        <Paper
          radius='xl'
          className='border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-dark-card sm:p-5'
        >
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align={{ base: 'stretch', lg: 'center' }}
            justify='space-between'
            gap='lg'
          >
            <Group wrap='nowrap' align='flex-start'>
              <ThemeIcon size={52} radius='xl' className='shrink-0 bg-mainColor/10 text-mainColor'>
                <IconGift size={26} />
              </ThemeIcon>

              <Box className='min-w-0'>
                <Text fw={900} className='font-quicksand text-base sm:text-lg'>
                  Quà tặng cho lần đặt đầu tiên
                </Text>

                <Text size='sm' c='dimmed' className='mt-1'>
                  Đăng nhập để nhận 500 điểm và voucher giảm đến 20%.
                </Text>
              </Box>
            </Group>

            <Flex
              direction={{ base: 'column', sm: 'row' }}
              align={{ base: 'stretch', sm: 'center' }}
              justify={{ base: 'flex-start', lg: 'flex-end' }}
              gap='xs'
              className='w-full lg:w-auto'
            >
              <Box className='sm:gap-xs grid grid-cols-3 gap-2 sm:flex'>
                {[
                  ['Không phí', 'tham gia'],
                  ['Tự động', 'tích điểm'],
                  ['Dùng ngay', 'voucher']
                ].map(item => (
                  <Paper
                    key={item[0]}
                    radius='lg'
                    className='bg-slate-50 px-3 py-3 text-center dark:bg-white/5 sm:px-4'
                  >
                    <Text size='sm' fw={900} className='whitespace-nowrap'>
                      {item[0]}
                    </Text>
                    <Text size='xs' c='dimmed' className='whitespace-nowrap'>
                      {item[1]}
                    </Text>
                  </Paper>
                ))}
              </Box>

              <Button component={Link} href='/dang-nhap' radius='xl' className='w-full sm:w-auto'>
                Nhận ưu đãi
              </Button>
            </Flex>
          </Flex>
        </Paper>
      </Box>

      <Box className='space-y-24 py-20' px={{ base: 10, sm: 30, md: 30, lg: 130 }}>
        <SectionPromotions initialData={productData} />
        <Stack gap={'xl'}>
          <SectionHeading
            center
            index='02'
            title='Số lượng có hạn'
            description='Nhanh tay săn nhận ngay những voucher giảm giá sâu, ăn thả ga! Số lượng có hạn.'
          />

          <Card p={0} withBorder shadow='sm' className='dark:bg-dark-subBackground'>
            <PromotionTabLayout />
          </Card>
        </Stack>

        <Stack gap={'xl'}>
          <SectionHeading
            center
            index='03'
            title='Leo Thang Phần Thưởng'
            description='Mỗi đơn hàng đưa bạn đến gần hơn với những đặc quyền và ưu đãi độc quyền'
          />

          <Box className='relative'>
            <Box className='relative mb-4 mr-4 flex items-end justify-end lg:hidden'>
              <Box className='flex animate-slideRightPulse items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 shadow-sm dark:bg-dark-card dark:text-dark-text'>
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
              {Object.values(promotionLevels).map((level, i) => {
                const Icon = level.icon;
                return (
                  <Card
                    key={i}
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
        </Stack>

        <Stack gap={'xl'}>
          <SectionHeading
            center
            index='04'
            title='Mỗi 10k = Nhiều phần thưởng hơn'
            description='Điểm sẽ tăng theo từng đơn hàng ngon lành và mở khóa nhiều phần thưởng hấp dẫn'
          />

          <InfoLevelUser />
        </Stack>

        <Stack gap={'xl'}>
          <SectionHeading
            center
            index='05'
            title='Niềm tin khách hàng'
            description='Hơn 50.000 thành viên hài lòng đang tiết kiệm tiền và tận hưởng từng bữa ăn ngon'
          />

          <Box className='relative'>
            <Box className='relative mb-4 mr-4 flex items-end justify-end md:hidden'>
              <Box className='flex animate-slideRightPulse items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 shadow-sm dark:bg-dark-card dark:text-dark-text'>
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
        </Stack>
      </Box>
      <FooterSection />
    </Box>
  );
}
