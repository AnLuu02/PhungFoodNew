import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
  TimelineItem,
  Title
} from '@mantine/core';
import {
  IconArrowRight,
  IconChefHat,
  IconClock,
  IconFlame,
  IconGift,
  IconHeartHandshake,
  IconMapPin,
  IconMoodSmile,
  IconPackage,
  IconPhone,
  IconShieldCheck,
  IconStar,
  IconTrendingUp,
  IconTruckDelivery
} from '@tabler/icons-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from '~/components/Reveal';
import { TextTyping } from '~/components/TextTyping';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { journey, signatures, stats } from '~/shared/constants/about-us.constants';
import { GetInitAboutUs } from '~/shared/type-trpc/page.type-trpc';
import { api } from '~/trpc/server';
import { SectionHeading } from '../../../components/SectionHeading';
import { SectionMenuHighlights } from './components/SectionMenuHighlights';
import { SectionTestimonials } from './components/SectionTestimonials';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Giới thiệu - Phụng Food',
  description: 'Phụng Food - hương vị miền Tây hiện đại, món ngon nóng hổi, giao nhanh và đầy cảm xúc.'
};
const faqs = [
  {
    q: 'Phụng Food có giao hàng không?',
    a: 'Có. Bạn có thể đặt món trực tiếp trên website và theo dõi trạng thái đơn hàng.'
  },
  {
    q: 'Món ăn có được làm mới khi đặt không?',
    a: 'Có. Các món chính được chế biến sau khi có đơn để đảm bảo độ nóng và hương vị.'
  },
  {
    q: 'Có chương trình thành viên không?',
    a: 'Có. Khách hàng có thể tích điểm, nhận voucher và ưu đãi theo cấp độ thành viên.'
  }
];
const menuHighlights = [
  {
    name: 'Burger bò sốt tiêu miền Tây',
    desc: 'Bò mềm, sốt tiêu đậm vị, rau tươi và bánh nóng.',
    image: '/images/png/delicious-burger-fries.png'
  },
  {
    name: 'Gà giòn mật ong cay',
    desc: 'Lớp vỏ giòn, sốt mật ong cay nhẹ, rất hợp ăn cùng khoai.',
    image: '/images/jpg/cooking-1.jpg'
  },
  {
    name: 'Combo gia đình',
    desc: 'Phần ăn đầy đủ, tiết kiệm, phù hợp cho nhóm bạn hoặc gia đình.',
    image: '/images/jpg/cooking-2.jpg'
  }
];
const processSteps = [
  {
    icon: IconShieldCheck,
    title: 'Chọn nguyên liệu',
    desc: 'Nguyên liệu được kiểm tra kỹ trước khi nhập bếp.'
  },
  {
    icon: IconFlame,
    title: 'Chế biến nóng mới',
    desc: 'Món được làm khi có đơn để giữ độ ngon tốt nhất.'
  },
  {
    icon: IconPackage,
    title: 'Đóng gói cẩn thận',
    desc: 'Bao bì sạch, chắc chắn, giữ nhiệt và dễ mang đi.'
  },
  {
    icon: IconMoodSmile,
    title: 'Giao đến khách hàng',
    desc: 'Đơn hàng được xử lý nhanh, rõ trạng thái và dễ theo dõi.'
  }
];
const values = [
  {
    icon: IconChefHat,
    title: 'Món ăn có linh hồn',
    desc: 'Không chỉ ngon, mỗi món đều có câu chuyện: vị miền Tây, cách làm chỉn chu và cảm giác thân thuộc.'
  },
  {
    icon: IconTruckDelivery,
    title: 'Nóng hổi đến tay',
    desc: 'Tối ưu quy trình bếp và giao hàng để món đến nơi vẫn giữ được độ ngon, giòn, nóng.'
  },
  {
    icon: IconHeartHandshake,
    title: 'Tử tế trong từng phần ăn',
    desc: 'Nguyên liệu rõ ràng, đóng gói sạch sẽ, khẩu vị dễ nhớ và dịch vụ khiến khách muốn quay lại.'
  }
];

const getInitAboutUs = async () => {
  try {
    return await withRedisCache('page:InitAboutUs', () => api.Page.getInitAboutUs(), 60 * 60);
  } catch {
    return await api.Page.getInitAboutUs();
  }
};
export default async function AboutPage() {
  const data: GetInitAboutUs = await api.Page.getInitAboutUs();
  const restaurant = data?.restaurant;
  return (
    <>
      <Box mx={{ base: -10, sm: -30, md: -30, lg: -130 }} mt={-16}>
        <Box className='relative min-h-[720px] overflow-hidden bg-[#07110f] text-white'>
          <Image
            src='/images/png/delicious-burger-fries.png'
            alt='Phụng Food hero'
            fill
            priority
            className='scale-105 object-cover opacity-45'
          />

          <Box className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(248,193,68,0.32),transparent_28%),linear-gradient(120deg,rgba(0,0,0,0.9),rgba(0,0,0,0.45),rgba(0,191,166,0.22))]' />
          <Box className='absolute left-10 top-24 hidden h-24 w-24 animate-[pulse_4s_ease-in-out_infinite] rounded-full bg-subColor/30 blur-3xl md:block' />
          <Box className='absolute bottom-20 right-16 hidden h-36 w-36 animate-[pulse_5s_ease-in-out_infinite] rounded-full bg-mainColor/30 blur-3xl md:block' />

          <Box className='relative z-10 mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 px-5 py-24 md:grid-cols-[1.3fr_0.7fr] lg:px-10'>
            <Reveal x={-30}>
              <Stack gap='xl'>
                <Group gap='sm'>
                  <Box className='h-px w-12 bg-orange-300' />
                  <Text className='text-sm font-bold uppercase tracking-[0.28em] text-orange-200'>
                    Phụng Food Restaurant
                  </Text>
                </Group>

                <Stack gap='md'>
                  <Title className='max-w-4xl font-quicksand text-5xl font-black leading-[1.02] md:text-balance md:text-7xl'>
                    Thức ăn nhanh, nhưng ...
                  </Title>

                  <TextTyping text={['vị ngon nhớ mãi.', 'chuẩn gu bạn thích.', 'đậm đà bản sắc.']} />

                  <Text className='text-white/82 max-w-2xl text-pretty text-lg leading-8 md:text-xl'>
                    Phụng Food mang tinh thần bếp nhà vào từng phần ăn: nóng hổi, đậm vị, sạch sẽ và đủ hấp dẫn để bạn
                    muốn đặt ngay sau lần nhìn đầu tiên.
                  </Text>
                </Stack>

                <Group gap='md'>
                  <Button
                    size='lg'
                    className='h-auto animate-fadeUp bg-subColor px-6 py-3 text-lg text-black shadow-xl duration-300 hover:scale-105 hover:bg-mainColor hover:text-white'
                    style={{ animationDuration: '2s' }}
                    rightSection={<IconArrowRight size={18} />}
                    component={Link}
                    href='/thuc-don'
                  >
                    Đặt ngay
                  </Button>

                  <Button
                    size='lg'
                    variant='outline'
                    style={{ animationDuration: '2.5s' }}
                    className='h-auto animate-fadeUp border-subColor px-6 py-3 text-lg text-white shadow-xl duration-300 hover:scale-105 hover:border-mainColor hover:text-subColor'
                    component={Link}
                    href='/dang-ky'
                  >
                    Nhận ưu đãi
                  </Button>
                </Group>

                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing='sm' className='max-w-3xl pt-4'>
                  {stats.map(item => (
                    <Paper
                      key={item.label}
                      radius='xl'
                      p='md'
                      className='border border-white/10 bg-white/10 text-center text-white backdrop-blur-md'
                    >
                      <Text className='font-quicksand text-2xl font-black text-subColor'>{item.value}</Text>
                      <Text size='sm' className='text-white/72'>
                        {item.label}
                      </Text>
                    </Paper>
                  ))}
                </SimpleGrid>
              </Stack>
            </Reveal>

            <Reveal x={30}>
              <Box className='relative mx-auto hidden w-full max-w-md md:block'>
                <Box className='absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-subColor/30 to-mainColor/30 blur-2xl' />

                <Card
                  radius={36}
                  p='md'
                  className='relative overflow-hidden border border-white/15 bg-white/10 backdrop-blur-xl'
                >
                  <Box className='relative h-[430px] overflow-hidden rounded-[28px]'>
                    <Image src='/images/jpg/cooking-1.jpg' alt='Bếp Phụng Food' fill className='object-cover' />
                    <Box className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent' />

                    <Paper radius='xl' p='md' className='bg-white/92 absolute bottom-4 left-4 right-4 backdrop-blur-md'>
                      <Box>
                        <Text fw={800} className='text-mainColor'>
                          Không chỉ là một bữa ăn
                        </Text>

                        <Text size='sm' c='dimmed'>
                          Chúng tôi mong muốn tạo nên những khoảnh khắc đáng nhớ quanh bàn ăn của bạn.
                        </Text>
                      </Box>

                      <ThemeIcon
                        variant='transparent'
                        size='xl'
                        className='absolute right-[10px] top-[10px] text-subColor'
                      >
                        <IconTrendingUp />
                      </ThemeIcon>
                    </Paper>
                  </Box>
                </Card>
              </Box>
            </Reveal>
          </Box>
        </Box>
      </Box>

      <Stack gap={100} className='relative mx-auto max-w-7xl px-1 py-16 md:px-4 md:py-24'>
        <Reveal z={40}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} verticalSpacing={40} className='items-center'>
            <Stack gap='lg'>
              <SectionHeading
                index='01'
                title='Từ căn bếp gia đình đến thương hiệu khiến khách muốn quay lại'
                description='Phụng Food bắt đầu từ niềm tin rất đơn giản: đồ ăn nhanh vẫn có thể tử tế, đậm vị và đáng nhớ.'
              />

              <Text size='lg' c='dimmed' className='leading-8'>
                Chúng tôi lấy cảm hứng từ hương vị miền Tây, kết hợp cách phục vụ hiện đại để mỗi đơn hàng đều gọn gàng,
                nóng hổi và làm khách thấy “đáng tiền”.
              </Text>

              <Stack gap='sm'>
                {signatures.map(item => (
                  <Group key={item} gap='sm'>
                    <ThemeIcon radius='xl' className='bg-subColor text-black'>
                      <IconStar size={16} />
                    </ThemeIcon>
                    <Text fw={600}>{item}</Text>
                  </Group>
                ))}
              </Stack>

              <Group>
                <Button
                  component={Link}
                  href='/thuc-don'
                  radius='xl'
                  size='md'
                  rightSection={<IconArrowRight size={17} />}
                >
                  Khám phá thực đơn
                </Button>
                <Button component={Link} href='/dang-ky' radius='xl' size='md' variant='light'>
                  Tích điểm ngay
                </Button>
              </Group>
            </Stack>

            <Box className='relative'>
              <Box className='absolute -right-5 -top-5 h-40 w-40 rounded-full bg-subColor/25 blur-2xl' />
              <Box className='absolute -bottom-5 -left-5 h-40 w-40 rounded-full bg-mainColor/20 blur-2xl' />

              <Paper
                radius={32}
                p={10}
                className='relative overflow-hidden border bg-white shadow-2xl dark:bg-dark-card'
              >
                <Box className='relative h-[420px] overflow-hidden rounded-[26px]'>
                  <Image src='/images/jpg/cooking-2.jpg' alt='Chef Phụng' fill className='object-cover' />
                </Box>
              </Paper>

              <Paper
                radius='xl'
                p='lg'
                className='absolute -bottom-8 left-6 max-w-[300px] border bg-white shadow-xl dark:bg-dark-card'
              >
                <Text className='font-quicksand text-xl font-black text-mainColor'>“Ngon là phải nhớ.”</Text>
                <Text size='sm' c='dimmed' mt={6}>
                  Tinh thần bếp của Chef Phụng trong từng món ăn.
                </Text>
              </Paper>
            </Box>
          </SimpleGrid>
        </Reveal>

        <Reveal z={40}>
          <Box>
            <SectionHeading
              index='02'
              title='Điều làm nên sự khác biệt'
              description='Không chỉ bán đồ ăn. Chúng tôi tạo ra trải nghiệm khiến khách muốn quay lại.'
              center
            />

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing='xl' mt={45}>
              {values.map((item, index) => (
                <Card
                  key={item.title}
                  radius={28}
                  p='xl'
                  className='group relative overflow-hidden border bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-dark-card'
                >
                  <Box className='absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-mainColor/5 transition duration-300 group-hover:bg-subColor/20' />

                  <ThemeIcon size={58} radius={20} className='bg-mainColor text-white'>
                    <item.icon size={28} />
                  </ThemeIcon>

                  <Text mt='xl' className='font-quicksand text-2xl font-black'>
                    0{index + 1}. {item.title}
                  </Text>

                  <Text mt='sm' c='dimmed' className='leading-7'>
                    {item.desc}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        </Reveal>

        <Reveal z={40}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} className='items-start'>
            <Stack gap='xl'>
              <SectionHeading
                index='03'
                title='Hành trình tạo nên Phụng Food'
                description='Một thương hiệu đáng nhớ không chỉ đến từ món ngon, mà còn từ cách nó lớn lên cùng khách hàng.'
              />

              <Paper radius={28} p='xl' className='border-l-4 border-subColor bg-mainColor/[0.09] dark:bg-dark-card'>
                <Text className='font-quicksand text-2xl font-black italic leading-snug text-mainColor'>
                  “Một món ăn ngon không phải là món đắt nhất, mà là món khiến khách muốn quay lại lần nữa.”
                </Text>

                <Text mt='md' fw={700} c='dimmed'>
                  — Chef Phụng
                </Text>
              </Paper>
            </Stack>

            <Timeline active={3} bulletSize={34} lineWidth={3} color='teal'>
              {journey.map(item => (
                <TimelineItem
                  key={item.year}
                  bullet={
                    <Text size='xs' fw={900}>
                      {item.year === 'Hôm nay' ? 'Nay' : item.year.slice(2)}
                    </Text>
                  }
                  title={
                    <Text fw={900} className='font-quicksand text-xl'>
                      {item.title}
                    </Text>
                  }
                >
                  <Text c='dimmed' mt={6} className='leading-7'>
                    {item.desc}
                  </Text>
                </TimelineItem>
              ))}
            </Timeline>
          </SimpleGrid>
        </Reveal>

        <Reveal z={40}>
          <Box>
            <SectionHeading
              index='04'
              title='Từ căn bếp đến tay bạn'
              description='Chúng tôi thiết kế quy trình phục vụ để mỗi đơn hàng không chỉ nhanh, mà còn chỉn chu.'
              center
            />

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing='xl' mt={45}>
              {processSteps.map((step, index) => (
                <Card
                  key={step.title}
                  radius={28}
                  p='xl'
                  className='relative overflow-hidden border bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-dark-card'
                >
                  <Text className='absolute right-5 top-4 font-quicksand text-5xl font-black text-mainColor/[0.06]'>
                    0{index + 1}
                  </Text>

                  <ThemeIcon size={58} radius={20} className='bg-subColor text-black'>
                    <step.icon size={28} />
                  </ThemeIcon>

                  <Text mt='xl' className='font-quicksand text-xl font-black'>
                    {step.title}
                  </Text>

                  <Text mt='sm' c='dimmed' className='leading-7'>
                    {step.desc}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        </Reveal>

        <SectionMenuHighlights productsPagination={data.productBestSaler} />

        <Reveal z={40}>
          <Paper
            radius={36}
            p={{ base: 'xl', md: 48 }}
            className='relative overflow-hidden border bg-white shadow-sm dark:bg-dark-card'
          >
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} className='items-center'>
              <Stack gap='md'>
                <SectionHeading
                  index='06'
                  title='Ăn ngon hơn khi trở thành thành viên'
                  description='Không chỉ đặt món, khách hàng còn được tích điểm, nhận ưu đãi và mở khóa nhiều quyền lợi theo từng cấp độ.'
                />

                <Group>
                  <Button component={Link} href='/dang-ky' radius='xl' size='lg' rightSection={<IconGift size={18} />}>
                    Đăng ký thành viên
                  </Button>

                  <Button component={Link} href='/thuc-don' radius='xl' size='lg' variant='light'>
                    Đặt món trước
                  </Button>
                </Group>
              </Stack>

              <SimpleGrid cols={1} spacing='md'>
                {[
                  'Tích điểm sau mỗi đơn hàng',
                  'Nhận voucher theo cấp độ thành viên',
                  'Ưu đãi sinh nhật và dịp đặc biệt',
                  'Theo dõi lịch sử đơn hàng dễ dàng'
                ].map(item => (
                  <Paper key={item} radius='xl' p='lg' className='border bg-mainColor/[0.03]'>
                    <Group>
                      <ThemeIcon radius='xl' className='bg-mainColor'>
                        <IconGift size={18} />
                      </ThemeIcon>
                      <Text fw={800}>{item}</Text>
                    </Group>
                  </Paper>
                ))}
              </SimpleGrid>
            </SimpleGrid>
          </Paper>
        </Reveal>

        <Reveal z={40}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} className='items-start'>
            <SectionHeading
              index='07'
              title='Một vài điều khách thường hỏi'
              description='Trả lời nhanh những thắc mắc phổ biến trước khi khách đặt món.'
            />

            <Accordion variant='separated' radius='xl'>
              {faqs.map(item => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionControl>
                    <Text fw={800}>{item.q}</Text>
                  </AccordionControl>
                  <AccordionPanel>
                    <Text c='dimmed' className='leading-7'>
                      {item.a}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </SimpleGrid>
        </Reveal>

        <Reveal z={40}>
          <Paper radius={36} p={{ base: 'xl', md: 48 }} className='relative overflow-hidden bg-mainColor text-white'>
            <Box className='absolute -right-24 -top-24 h-72 w-72 rounded-full bg-subColor/25 blur-3xl' />
            <Box className='absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl' />

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40} className='relative items-center'>
              <Stack gap='md'>
                <Text size='sm' fw={800} tt='uppercase' lts={3} className='text-white/60'>
                  Chef Phụng
                </Text>

                <Title className='text-balance font-quicksand text-4xl font-black md:text-5xl'>
                  Mỗi món ăn phải có lý do để khách nhớ đến
                </Title>

                <Text className='text-lg leading-8 text-white/80'>
                  Chef Phụng không chỉ tạo công thức. Cô tạo cảm giác: vị sốt đậm hơn một chút, lớp vỏ giòn lâu hơn một
                  chút, phần ăn đủ đầy hơn một chút.
                </Text>
              </Stack>

              <Stack gap='md'>
                {[
                  { icon: IconClock, label: 'Chuẩn bị nhanh nhưng không cẩu thả' },
                  { icon: IconChefHat, label: 'Công thức được thử vị nhiều lần trước khi bán' },
                  { icon: IconTruckDelivery, label: 'Đóng gói tối ưu để giữ độ nóng và giòn' }
                ].map(item => (
                  <Paper
                    key={item.label}
                    radius='xl'
                    p='lg'
                    className='border border-white/10 bg-white/10 backdrop-blur-md'
                  >
                    <Group>
                      <ThemeIcon radius='xl' size='lg' className='bg-subColor text-black'>
                        <item.icon size={20} />
                      </ThemeIcon>
                      <Text fw={700}>{item.label}</Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </SimpleGrid>
          </Paper>
        </Reveal>

        <SectionTestimonials reviewsPagination={data.topReviews} />

        <Reveal z={40}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl' className='items-stretch'>
            <Paper radius={32} p='xl' className='border bg-white shadow-sm dark:bg-dark-card'>
              <Stack gap='md'>
                <SectionHeading index='09' title='Đến ăn trực tiếp hoặc đặt giao tận nơi' />

                <Divider />

                <Group align='flex-start' wrap='nowrap'>
                  <ThemeIcon radius='xl' className='bg-mainColor'>
                    <IconMapPin size={18} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={800}>Địa chỉ</Text>
                    <Text c='dimmed'>
                      {restaurant?.address || '123 Sài Gòn, Quận Ẩm Thực, Thành phố của chúng tôi'}
                    </Text>
                  </Box>
                </Group>

                <Group align='flex-start' wrap='nowrap'>
                  <ThemeIcon radius='xl' className='bg-mainColor'>
                    <IconClock size={18} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={800}>Giờ hoạt động</Text>
                    {restaurant?.openingHours?.length ? (
                      restaurant.openingHours.map((hours, index) => (
                        <Text key={index} c='dimmed'>
                          {hours.viNameDay}: <b>{hours.openTime}</b> - <b>{hours.closeTime}</b>
                        </Text>
                      ))
                    ) : (
                      <Text c='dimmed'>Thứ 2 - Chủ Nhật: 10:00 - 22:00</Text>
                    )}
                  </Box>
                </Group>

                <Group align='flex-start' wrap='nowrap'>
                  <ThemeIcon radius='xl' className='bg-mainColor'>
                    <IconPhone size={18} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={800}>Hotline</Text>
                    <Group gap={8}>
                      <Text
                        component='a'
                        href={`tel:${restaurant?.phone}`}
                        fw={800}
                        className='text-mainColor hover:underline'
                      >
                        {restaurant?.phone || '0942486950'}
                      </Text>
                      <Text c='dimmed'>-/ -</Text>
                      <Text component='a' href='tel:0942486950' fw={800} className='text-mainColor hover:underline'>
                        0942486950
                      </Text>
                    </Group>
                  </Box>
                </Group>

                <Button
                  component={Link}
                  href='/thuc-don'
                  radius='xl'
                  size='lg'
                  rightSection={<IconArrowRight size={18} />}
                >
                  Xem thực đơn
                </Button>
              </Stack>
            </Paper>

            <Paper radius={32} p={8} className='relative min-h-[420px] overflow-hidden border shadow-sm'>
              <Image src='/images/jpg/map.jpg' alt='Bản đồ Phụng Food' fill className='object-cover' />
              <Box className='absolute inset-0 bg-gradient-to-t from-black/45 to-transparent' />
              <Paper
                radius='xl'
                p='md'
                className='absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md dark:bg-dark-card'
              >
                <Group justify='space-between'>
                  <Box>
                    <Text fw={900} className='text-mainColor'>
                      Phụng Food Restaurant
                    </Text>
                    <Text size='sm' c='dimmed'>
                      Sẵn sàng phục vụ món ngon nóng hổi mỗi ngày
                    </Text>
                  </Box>
                  <ThemeIcon radius='xl' size='xl' className='bg-subColor text-black'>
                    <IconMapPin />
                  </ThemeIcon>
                </Group>
              </Paper>
            </Paper>
          </SimpleGrid>
        </Reveal>
      </Stack>

      <Reveal z={40}>
        <Box
          mx={{ base: -10, sm: -30, md: -30, lg: -130 }}
          className='min-[720px] relative overflow-hidden bg-[#07110f] py-20 text-white'
        >
          <Box className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(248,193,68,0.32),transparent_28%),linear-gradient(120deg,rgba(0,0,0,0.9),rgba(0,0,0,0.45),rgba(0,191,166,0.22))]' />
          <Box className='absolute left-10 top-24 hidden h-24 w-24 animate-[pulse_4s_ease-in-out_infinite] rounded-full bg-subColor/30 blur-3xl md:block' />
          <Box className='absolute bottom-20 right-16 hidden h-36 w-36 animate-[pulse_5s_ease-in-out_infinite] rounded-full bg-mainColor/30 blur-3xl md:block' />
          <Image
            src='/images/jpg/cooking-2.jpg'
            alt='Phụng Food hero'
            fill
            priority
            className='scale-105 object-cover opacity-45'
          />

          <Box className='relative mx-auto max-w-4xl px-5 text-center'>
            <Text size='sm' fw={800} tt='uppercase' lts={3} className='mb-5 text-white/55'>
              Sẵn sàng ăn ngon?
            </Text>

            <Title className='text-balance font-quicksand text-4xl font-black md:text-6xl'>
              Đừng chỉ đọc câu chuyện.
              <Text span inherit className='block text-subColor'>
                Hãy thử hương vị.
              </Text>
            </Title>

            <Text className='mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75'>
              Chọn món bạn thích, nhận ưu đãi thành viên và để Phụng Food giao đến bạn một bữa ăn thật đáng nhớ.
            </Text>

            <Group justify='center' mt='xl'>
              <Button
                size='lg'
                className='h-auto bg-subColor px-6 py-3 text-lg text-black shadow-xl duration-300 hover:scale-105 hover:bg-mainColor hover:text-white'
                rightSection={<IconArrowRight size={18} />}
                component={Link}
                href='/thuc-don'
              >
                Đặt ngay
              </Button>

              <Button
                size='lg'
                variant='outline'
                className='h-auto border-subColor px-6 py-3 text-lg text-white shadow-xl duration-300 hover:scale-105 hover:border-mainColor hover:text-subColor'
                component={Link}
                href='/dang-ky'
              >
                Đăng ký nhận ưu đãi
              </Button>
            </Group>
          </Box>
        </Box>
      </Reveal>
    </>
  );
}
