import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import { IconChefHat, IconMail, IconMapPin, IconPhone, IconStar } from '@tabler/icons-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from '~/components/Reveal';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { api } from '~/trpc/server';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Giới thiệu - Phụng Food',
  description:
    'Phụng Food ra đời nhằm mang đặc sản miền Tây đến với mọi người. Cùng tìm hiểu hành trình và giá trị của chúng tôi.'
};

const getInitRestaurant = async () => {
  return await withRedisCache('restaurant:getOneActiveClient', () => api.Restaurant.getOneActiveClient(), 60 * 60 * 24);
};

export default async function AboutPage() {
  const restaurant = await getInitRestaurant();
  return (
    <Box className='relative w-full overflow-x-hidden'>
      <Box pos={'relative'} mx={{ base: -10, sm: -30, md: -30, lg: -130 }} mt={-16}>
        <Box className='from-primary/20 to-accent/10 relative flex h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br md:h-[70vh]'>
          <Box className='z-2 absolute inset-0 bg-black/40'></Box>
          <Image
            src='/images/png/delicious-burger-fries.png'
            alt='Restaurant hero'
            fill
            className='absolute inset-0 z-[-1] object-cover'
          />
          <Box className='relative z-10 mx-auto max-w-4xl px-4 text-center text-white'>
            <Badge size='xl' className='mb-4 animate-fadeUp bg-subColor/90 p-3' style={{ animationDuration: '0.5s' }}>
              🍔 Câu chuyện của chúng tôi
            </Badge>
            <Title
              className='text mb-6 animate-fadeUp text-balance font-quicksand text-3xl font-bold md:text-6xl'
              style={{ animationDuration: '0.75s' }}
            >
              Hương Vị Truyền Thống,
              <span className='text-subColor'> Phong Cách Hiện Đại</span>
            </Title>
            <Text
              className='mx-auto mb-8 max-w-2xl animate-fadeUp text-pretty text-lg md:text-xl'
              style={{ animationDuration: '1s' }}
            >
              Từ năm 2010, chúng tôi đã mang đến những món ăn nhanh chất lượng cao với hương vị đậm đà Việt Nam
            </Text>
            <Link href={'/thuc-don'} className='animate-fadeUp' style={{ animationDuration: '1.25s' }}>
              <Button size='lg' w={'max-content'} children={'Xem thực đơn'} />
            </Link>
          </Box>
        </Box>
      </Box>
      <Stack gap={50} pos={'relative'} mt={50}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl'>
          <Reveal x={-20}>
            <Stack gap='md'>
              <Title className='font-quicksand text-3xl text-mainColor sm:text-4xl'>Câu chuyện của chúng tôi</Title>
              <Text>
                Mama Reastaurant là một nhà hàng gia đình mang truyền thống ẩm thực phong phú của Việt Nam vào đĩa thức
                ăn của bạn. Chúng tôi chuyên về ẩm thực miền Tây Việt Nam đồng thời cung cấp các món ăn được yêu thích
                từ cả ba miền Việt Nam.
              </Text>
              <Text>
                Hành trình của chúng tôi bắt đầu khi gia đình chúng tôi chuyển từ đồng bằng sông Cửu Long đến thành phố
                sôi động này, mang theo những hương vị và kỹ thuật được truyền qua nhiều thế hệ. Chúng tôi đam mê chia
                sẻ di sản của mình thông qua ẩm thực, kết hợp các công thức nấu ăn truyền thống với những cách chế biến
                hiện đại để tạo ra những trải nghiệm ăn uống khó quên.
              </Text>
              <Group wrap='nowrap'>
                <ThemeIcon
                  size='lg'
                  classNames={{
                    root: 'bg-mainColor'
                  }}
                >
                  <IconChefHat />
                </ThemeIcon>
                <Text>Công thức nấu ăn đích thực được truyền qua nhiều thế hệ</Text>
              </Group>
              <Group wrap='nowrap'>
                <ThemeIcon
                  size='lg'
                  classNames={{
                    root: 'bg-mainColor'
                  }}
                >
                  <IconMapPin />
                </ThemeIcon>
                <Text>Hương vị từ miền Tây Việt Nam và hơn thế nữa</Text>
              </Group>
              <Group wrap='nowrap'>
                <ThemeIcon
                  size='lg'
                  classNames={{
                    root: 'bg-mainColor'
                  }}
                >
                  <IconStar />
                </ThemeIcon>
                <Text>Gia đình sở hữu và điều hành bằng tình yêu</Text>
              </Group>
            </Stack>
          </Reveal>
          <Reveal x={20}>
            <Paper p={0} m={0} w={'100%'} h={300} pos={'relative'} className='overflow-hidden'>
              <Image
                loading='lazy'
                src='/images/jpg/cooking-1.jpg'
                alt='Restaurant interior'
                fill
                className='object-cover'
              />
            </Paper>
          </Reveal>
        </SimpleGrid>
        <Reveal z={50}>
          <Box className='py-4 md:py-8'>
            <Box className='mb-10 text-center'>
              <Badge className='mb-4 bg-mainColor/10 p-3 text-mainColor'>Giá trị cốt lõi</Badge>
              <Title className='text mb-3 text-balance font-quicksand text-3xl font-bold text-mainColor md:text-4xl'>
                Những giá trị chúng tôi theo đuổi
              </Title>
              <Text c={'dimmed'} className='mx-auto max-w-2xl text-pretty'>
                Cam kết mang đến trải nghiệm ẩm thực tuyệt vời nhất cho khách hàng
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
                {[
                  {
                    icon: '🥇',
                    title: 'Chất lượng hàng đầu',
                    description:
                      'Nguyên liệu tươi ngon, quy trình chế biến nghiêm ngặt, đảm bảo vệ sinh an toàn thực phẩm'
                  },
                  {
                    icon: '🤝',
                    title: 'Phục vụ tận tâm',
                    description: 'Đội ngũ nhân viên được đào tạo chuyên nghiệp, luôn sẵn sàng mang đến dịch vụ tốt nhất'
                  },
                  {
                    icon: '🌱',
                    title: 'Phát triển bền vững',
                    description: 'Cam kết bảo vệ môi trường, sử dụng bao bì thân thiện và hỗ trợ cộng đồng địa phương'
                  }
                ].map((value, index) => (
                  <Card
                    key={index}
                    shadow='xl'
                    className='sm:max-w-auto group max-w-[80vw] flex-shrink-0 overflow-hidden bg-mainColor/10 p-8 text-center transition-all duration-300 hover:shadow-lg sm:min-w-[45%] sm:flex-shrink lg:min-w-[32%]'
                  >
                    <Box className='space-y-4'>
                      <Box className='mb-4 text-6xl'>{value.icon}</Box>
                      <Title className='text-balance font-quicksand text-xl font-bold text-mainColor'>
                        {value.title}
                      </Title>
                      <Text className='text-pretty leading-relaxed'>{value.description}</Text>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        </Reveal>
        <Reveal z={50}>
          <Box className='py-4 md:py-8'>
            <Box className='mb-10 text-center'>
              <Badge className='mb-4 bg-blue-100 p-3 text-blue-500'>Đội ngũ lãnh đạo</Badge>
              <Title className='text mb-3 text-balance font-quicksand text-3xl font-bold text-mainColor md:text-4xl'>
                Những người kiến tạo thương hiệu
              </Title>
              <Text c={'dimmed'} className='mx-auto max-w-2xl text-pretty'>
                Đội ngũ lãnh đạo giàu kinh nghiệm, luôn đặt khách hàng làm trung tâm
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
                {[
                  {
                    name: 'Nguyễn Văn Minh',
                    role: 'Tổng Giám Đốc',
                    image: '/happy-customer-profile.png',
                    bio: '15 năm kinh nghiệm trong ngành F&B, dẫn dắt công ty phát triển mạnh mẽ'
                  },
                  {
                    name: 'Trần Thị Lan',
                    role: 'Giám Đốc Vận Hành',
                    image: '/satisfied-customer-profile.png',
                    bio: 'Chuyên gia về quy trình vận hành, đảm bảo chất lượng dịch vụ đồng nhất'
                  },
                  {
                    name: 'Lê Hoàng Nam',
                    role: 'Bếp trưởng',
                    image: '/happy-family-customer.png',
                    bio: 'Đầu bếp tài năng với hơn 20 năm kinh nghiệm, sáng tạo ra những món ăn độc đáo'
                  }
                ].map((member, index) => (
                  <Card
                    shadow='xl'
                    key={index}
                    className='sm:max-w-auto group max-w-[80vw] flex-shrink-0 overflow-hidden transition-all duration-300 hover:shadow-xl sm:min-w-[45%] sm:flex-shrink lg:min-w-[32%]'
                  >
                    <Box className='relative overflow-hidden'>
                      <Avatar src={'/images/png/403.png'} className='h-64 w-full rounded-none' />
                    </Box>
                    <Box className='p-6 text-center'>
                      <Title className='mb-2 font-quicksand text-xl font-bold text-mainColor'>{member.name}</Title>
                      <Badge className='mb-4 bg-mainColor/10 text-mainColor'>{member.role}</Badge>
                      <Text className='text-pretty text-sm leading-relaxed'>{member.bio}</Text>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        </Reveal>
        <Reveal z={50}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl' className='py-4 md:py-8'>
            <Paper p={0} m={0} w={'100%'} h={300} pos={'relative'} className='overflow-hidden'>
              <Image loading='lazy' src='/images/jpg/cooking-2.jpg' alt='Chef portrait' fill className='object-cover' />
            </Paper>
            <Stack gap='md'>
              <Title className='font-quicksand text-3xl text-mainColor sm:text-3xl'>Gặp gỡ đầu bếp của chúng tôi</Title>
              <Text>
                Tâm điểm của SaiGon Flavours là đầu bếp và chủ sở hữu tài năng của chúng tôi, Chef Phụng - một người mẹ
                với hơn 30 năm kinh nghiệm ẩm thực. Hành trình của cô bắt đầu tại những khu chợ sầm uất ở đồng bằng sông
                Cửu Long, nơi cô học được nghệ thuật cân bằng hương vị và lựa chọn những nguyên liệu tươi ngon nhất.
              </Text>
              <Text>
                Niềm đam mê ẩm thực Việt Nam và sự tâm huyết của Chef Phụng trong việc bảo tồn hương vị truyền thống
                đồng thời đổi mới các món ăn mới khiến mỗi bữa ăn tại Sài Gòn Flavors đều là một trải nghiệm đáng nhớ.
                Cô đích thân giám sát mọi khía cạnh của nhà bếp, đảm bảo rằng mỗi món ăn đều đáp ứng các tiêu chuẩn
                chính xác của cô.
              </Text>
              <Text fw={500} fs='italic'>
                "Nấu ăn không chỉ là về nguyên liệu mà còn là một nghệ thuật sáng tạo giúp gắn kết gia đình và cộng
                đồng. Thông qua món ăn, chúng ta chia sẻ văn hóa, ký ức và tình yêu của mình." - Chef Phụng
              </Text>
            </Stack>
          </SimpleGrid>
        </Reveal>
        <Reveal z={50}>
          <Box className='py-4 md:py-8'>
            <Title className='font-quicksand text-3xl text-mainColor sm:text-3xl' mb={'md'}>
              Khách hàng của chúng tôi nói gì?
            </Title>

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
                  className='sm:max-w-auto group max-w-[80vw] flex-shrink-0 overflow-hidden bg-white p-8 text-center transition-all duration-300 hover:shadow-2xl dark:bg-dark-card sm:min-w-[45%] sm:flex-shrink lg:min-w-[32%]'
                >
                  <Box mb={'md'}>
                    <Box className='flex flex-col items-center space-x-4 sm:flex-row'>
                      <Avatar
                        src={'/images/png/403.png'}
                        className='h-16 w-16 border-4 border-solid border-yellow-200'
                      />
                      <Flex
                        direction={'column'}
                        className='mt-2 items-center justify-center sm:mt-0 sm:items-start sm:justify-start'
                        gap={4}
                      >
                        <Title className='font-quicksand text-xl'>Nguyễn Hải Nam</Title>
                        <Badge size='sm' className='bg-yellow-400 text-white'>
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
                      "Ứng dụng giúp đặt món thật tiện lợi, và tôi thích việc tích điểm cho mỗi lần mua. Tháng này tôi
                      đã đổi được <b>3 suất ăn miễn phí</b> rồi! Ưu đãi ngày càng hấp dẫn! 🍔"
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
                      <Avatar
                        src={'/images/png/403.png'}
                        className='h-16 w-16 border-4 border-solid border-green-200'
                      />
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
        </Reveal>
        <Reveal z={50}>
          <Box className='py-4 md:py-8'>
            <Title className='font-quicksand text-3xl text-mainColor sm:text-5xl'>Ghé thăm chúng tôi</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 2 }} spacing='xl' mt='md'>
              <Box>
                <Text fw={700}>Địa chỉ:</Text>
                <Text>{restaurant?.address || '123 Sài Gòn, Quận Ẩm Thực, Thành Phố Của Chúng Tôi'}</Text>
                <Text fw={700} mt='md'>
                  Giờ hoạt động:
                </Text>
                {restaurant?.openingHours ? (
                  restaurant.openingHours.map((hours, index) => (
                    <Text>
                      {hours.viNameDay}: <b>{hours?.openTime} Giờ</b> - <b>{hours?.closeTime} Giờ</b>
                    </Text>
                  ))
                ) : (
                  <Text>Thứ 2 - Chủ Nhật: 10:00 - 22:00</Text>
                )}
                <Group mt='md'>
                  <ThemeIcon
                    size='lg'
                    classNames={{
                      root: 'bg-mainColor'
                    }}
                  >
                    <IconPhone />
                  </ThemeIcon>
                  <Flex gap={'sm'} align={'center'}>
                    <Text fw={700} className='text-mainColor hover:underline'>
                      <a href={`tel:${restaurant?.phone}`}>{restaurant?.phone}</a>{' '}
                    </Text>
                    -/-
                    <Text fw={700} className='text-mainColor hover:underline'>
                      <a href={`tel:0942486950`}>0942486950</a>
                    </Text>
                  </Flex>
                </Group>
                <Group mt='md'>
                  <ThemeIcon
                    size='lg'
                    classNames={{
                      root: 'bg-mainColor'
                    }}
                  >
                    <IconMail />
                  </ThemeIcon>
                  <Text fw={700} className='text-mainColor hover:underline'>
                    <a href={`mailto:${restaurant?.email}`}>{restaurant?.email}</a>
                  </Text>
                </Group>
              </Box>

              <Paper p={0} m={0} w={'100%'} h={300} pos={'relative'} className='overflow-hidden'>
                <Image loading='lazy' src='/images/jpg/map.jpg' alt='Map' fill className='object-cover' />
              </Paper>
            </SimpleGrid>
          </Box>
        </Reveal>
      </Stack>
      <Reveal z={50}>
        <Box
          pos={'relative'}
          mx={{ base: -10, sm: -30, md: -30, lg: -130 }}
          mt={'md'}
          className='bg-mainColor/5 py-16 md:py-24'
        >
          <Box className='mx-auto max-w-4xl px-4 text-center'>
            <Title className='text mb-6 text-balance font-quicksand text-3xl font-bold md:text-4xl'>
              Sẵn sàng trải nghiệm?
            </Title>
            <Text className='mx-auto mb-8 max-w-2xl text-pretty text-lg'>
              Tham gia cộng đồng khách hàng thân thiết và nhận những ưu đãi hấp dẫn ngay hôm nay
            </Text>
            <Box className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link href={'/dang-ky'}>
                <Button size='lg' w={'max-content'} children={'Đăng ký ngay'} />
              </Link>

              <Link href={'/thuc-don'}>
                <Button size='lg' w={'max-content'} variant='outline' children={'Xem thực đơn'} />
              </Link>
            </Box>
          </Box>
        </Box>
      </Reveal>
    </Box>
  );
}
