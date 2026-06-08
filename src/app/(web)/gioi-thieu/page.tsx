import {
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
  IconCircleCheck,
  IconClock,
  IconMapPin,
  IconMapPins,
  IconPhone,
  IconSoup,
  IconStar
} from '@tabler/icons-react';

import { Flex } from '@mantine/core';
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
import { SectionFaqs } from './components/SectionFaqs';
import { SectionMember } from './components/SectionMember';
import { SectionMenuHighlights } from './components/SectionMenuHighlights';
import { SectionProcessSteps } from './components/SectionProcessSteps';
import AboutReviewBlock from './components/SectionTestimonials';
import { SectionValues } from './components/SectionValues';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Giới thiệu - Phụng Food',
  description: 'Phụng Food - hương vị miền Tây hiện đại, món ngon nóng hổi, giao nhanh và đầy cảm xúc.'
};

const getInitAboutUs = async () => {
  try {
    return await withRedisCache('page:InitAboutUs', () => api.Page.getInitAboutUs(), 60 * 60);
  } catch {
    return await api.Page.getInitAboutUs();
  }
};
export default async function AboutPage() {
  const data: GetInitAboutUs = await getInitAboutUs();
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
                      p='md'
                      className='border border-white/10 bg-backgroundAdmin/10 text-center text-white backdrop-blur-md'
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
                  p='md'
                  radius={'xl'}
                  className='relative overflow-hidden border border-white/15 bg-backgroundAdmin/10 backdrop-blur-xl'
                >
                  <Paper radius={'xl'} className='relative h-[430px] overflow-hidden bg-transparent'>
                    <Image src='/images/jpg/cooking-1.jpg' alt='Bếp Phụng Food' fill className='object-cover' />
                    <Box className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent' />

                    <Paper
                      p='md'
                      radius={'xl'}
                      className='absolute bottom-4 left-4 right-4 overflow-hidden border border-white/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.82),rgba(30,41,59,0.72),rgba(120,78,25,0.58))] shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl'
                    >
                      <Box className='absolute -right-12 -top-12 h-32 w-32 rounded-full bg-mainColor/25 blur-3xl' />
                      <Box className='absolute -bottom-14 left-8 h-28 w-28 rounded-full bg-subColor/25 blur-2xl' />

                      <Box className='relative pl-3'>
                        <Group gap='xs' mb={8}>
                          <Box className='h-px w-7 bg-subColor/80' />
                          <Text size='xs' fw={800} className='uppercase tracking-[0.22em] text-subColor'>
                            Phụng Food
                          </Text>
                        </Group>

                        <Text fw={900} className='font-quicksand text-lg leading-snug text-white'>
                          Không chỉ là một bữa ăn
                        </Text>

                        <Text mt={6} size='sm' className='max-w-[92%] leading-6 text-white/75'>
                          Chúng tôi chăm chút từng món ăn để mỗi lần đặt hàng đều có cảm giác gần gũi, ấm áp và đáng nhớ
                          hơn.
                        </Text>

                        <Box className='mt-4 flex items-center gap-2'>
                          <Box className='h-px flex-1 bg-gradient-to-r from-subColor/70 to-transparent' />

                          <Text size='xs' fw={800} className='whitespace-nowrap text-white/60'>
                            phục vụ bằng sự tử tế
                          </Text>
                        </Box>
                      </Box>
                    </Paper>
                  </Paper>
                </Card>
              </Box>
            </Reveal>
          </Box>
        </Box>
      </Box>

      <Stack className='relative w-full gap-[100px] overflow-hidden px-1 py-16 sm:gap-[120px] sm:overflow-visible md:px-4 md:py-24'>
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
                  h={{ base: 40, sm: 44, lg: 50 }}
                  px={{ base: 16, sm: 22, lg: 28 }}
                  fz={{ base: 14, sm: 15, lg: 16 }}
                  rightSection={<IconArrowRight size={17} />}
                >
                  Khám phá thực đơn
                </Button>
                <Button
                  component={Link}
                  href='/dang-ky'
                  h={{ base: 40, sm: 44, lg: 50 }}
                  px={{ base: 16, sm: 22, lg: 28 }}
                  fz={{ base: 14, sm: 15, lg: 16 }}
                  variant='outline'
                >
                  Tích điểm ngay
                </Button>
              </Group>
            </Stack>

            <Box className='relative'>
              <Box className='absolute -right-5 -top-5 h-40 w-40 rounded-full bg-subColor/25 blur-2xl' />
              <Box className='absolute -bottom-5 -left-5 h-40 w-40 rounded-full bg-mainColor/20 blur-2xl' />

              <Paper
                radius={'xl'}
                p={10}
                className='relative overflow-hidden border bg-backgroundAdmin shadow-2xl dark:bg-dark-card'
              >
                <Paper radius={'xl'} className='relative h-[420px] overflow-hidden bg-transparent'>
                  <Image src='/images/jpg/cooking-2.jpg' alt='Chef Phụng' fill className='object-cover' />
                </Paper>
              </Paper>

              <Paper
                p='lg'
                radius={'xl'}
                className='absolute -bottom-8 left-6 max-w-[300px] border bg-backgroundAdmin shadow-xl dark:bg-dark-card'
              >
                <Text className='font-quicksand text-xl font-black text-mainColor'>“Ngon là phải nhớ.”</Text>
                <Text size='sm' c='dimmed' mt={6}>
                  Tinh thần bếp của Chef Phụng trong từng món ăn.
                </Text>
              </Paper>
            </Box>
          </SimpleGrid>
        </Reveal>

        <SectionValues />

        <Reveal z={40}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} className='items-start'>
            <Stack gap='xl'>
              <SectionHeading
                index='03'
                title='Hành trình tạo nên Phụng Food'
                description='Một thương hiệu đáng nhớ không chỉ đến từ món ngon, mà còn từ cách nó lớn lên cùng khách hàng.'
              />

              <Paper p='xl' radius={'xl'} className='border-l-4 border-subColor bg-mainColor/[0.09] dark:bg-dark-card'>
                <Text className='font-quicksand text-xl font-black italic leading-snug text-mainColor md:text-2xl'>
                  “Một món ăn ngon không phải là món đắt nhất, mà là món khiến khách muốn quay lại lần nữa.”
                </Text>

                <Text mt='md' fw={700} c='dimmed' ta={'right'}>
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

        <SectionProcessSteps />

        <SectionMenuHighlights productsPagination={data.productBestSaler} />

        <SectionMember />

        <SectionFaqs />

        <Reveal z={40}>
          <Paper radius={'xl'} p={{ base: 'lg', md: 36 }} className='relative overflow-hidden bg-[#1f4f4a] text-white'>
            <Box className='absolute -right-24 -top-24 h-72 w-72 rounded-full bg-subColor/25 blur-3xl' />
            <Box className='absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl' />

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 32, md: 44 }} className='relative items-center'>
              <Stack gap='md'>
                <Group gap='sm'>
                  <Box className='h-px w-8 bg-subColor' />
                  <Text size='sm' fw={800} tt='uppercase' lts={3} className='text-subColor'>
                    Chef Phụng
                  </Text>
                </Group>

                <Title className='text-balance font-quicksand text-3xl font-black md:text-5xl'>
                  Mỗi món ăn phải có lý do để khách nhớ đến
                </Title>

                <Text className='max-w-xl text-base leading-7 text-white/80 md:text-lg'>
                  Chef Phụng không chỉ tạo công thức. Cô tạo cảm giác: vị sốt đậm hơn một chút, lớp vỏ giòn lâu hơn một
                  chút, phần ăn đủ đầy hơn một chút.
                </Text>
              </Stack>

              <Box className='relative mx-auto w-full max-w-[470px]'>
                <Box className='absolute -top-4 left-1/2 z-20 h-8 w-40 -translate-x-1/2 rotate-1 bg-[#d8b985]/80 shadow-sm'>
                  <Box className='absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.18)_0px,rgba(255,255,255,0.18)_1px,transparent_1px,transparent_7px)] opacity-50' />
                </Box>

                <Box className='absolute -right-1 top-7 z-20 h-16 w-8 rotate-12 rounded-full border-[3px] border-[#c59b45]' />
                <Box className='absolute right-[6px] top-[42px] z-20 h-11 w-3 rotate-12 rounded-full border-[3px] border-[#c59b45]' />

                <Paper
                  p={{ base: 'lg', md: 26 }}
                  className='paper-note-real relative overflow-hidden border border-[#eadfca] bg-[#fff8e9] text-[#123f3b] shadow-[0_22px_50px_rgba(39,28,12,0.26),0_8px_16px_rgba(39,28,12,0.12)]'
                >
                  <Box className='pointer-events-none absolute inset-0 opacity-[0.32]'>
                    <Box className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(80,50,20,0.08)_0_1px,transparent_1px),radial-gradient(circle_at_80%_30%,rgba(80,50,20,0.07)_0_1px,transparent_1px)] bg-[length:18px_18px]' />
                    <Box className='absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.45),transparent_35%,rgba(120,80,30,0.06))]' />
                  </Box>

                  <Box className='absolute bottom-0 right-0 h-20 w-20 overflow-hidden'>
                    <Box className='absolute bottom-0 right-0 h-20 w-20 rounded-tl-[24px] bg-[#ead8b8] shadow-[-8px_-8px_18px_rgba(80,50,20,0.12)]' />
                    <Box className='absolute bottom-0 right-0 h-16 w-16 bg-[#fff3dc]' />
                  </Box>

                  <Stack gap='md' className='relative z-10'>
                    <Group gap='sm'>
                      <ThemeIcon size={30} radius='xl' variant='transparent' className='text-[#c79b3b]'>
                        <IconChefHat size={23} />
                      </ThemeIcon>

                      <Box>
                        <Text size='md' fw={800} className='text-[#123f3b]'>
                          Ghi chú từ bếp
                        </Text>
                        <Box className='mt-1 h-[2px] w-28 rounded-full bg-[#c79b3b]/50' />
                      </Box>
                    </Group>

                    <Box>
                      <Title className='max-w-sm font-quicksand text-3xl font-black leading-[1.05] text-[#063f3b] md:text-4xl'>
                        Không chỉ là một bữa ăn
                      </Title>

                      <Box className='mt-2 h-[3px] w-36 rounded-full bg-[#c79b3b]' />
                    </Box>

                    <Text className='max-w-sm text-sm leading-6 text-slate-700 md:text-base'>
                      Chúng tôi mong muốn tạo nên những khoảnh khắc đáng nhớ quanh bàn ăn của bạn.
                    </Text>

                    <Stack gap={6}>
                      {['Vị được chỉnh kỹ', 'Đóng gói giữ độ nóng', 'Phần ăn đủ đầy'].map(item => (
                        <Group key={item} gap='sm' wrap='nowrap' className='border-b border-[#d8c7a8]/70 pb-1.5'>
                          <ThemeIcon size={28} radius='xl' variant='transparent' className='shrink-0 text-[#0c4a43]'>
                            <IconCircleCheck size={22} stroke={2.4} />
                          </ThemeIcon>

                          <Text fw={700} className='font-quicksand text-[15px] italic text-[#263b38]'>
                            {item}
                          </Text>
                        </Group>
                      ))}
                    </Stack>

                    <Group justify='space-between' align='center' mt={4}>
                      <Text size='xs' fw={800} tt='uppercase' lts={2} className='text-[#c79b3b]'>
                        Chef Phụng
                      </Text>

                      <Group gap={4} className='hidden sm:flex'>
                        <IconSoup size={38} stroke={1.5} className='text-[#123f3b]/80' />
                        <Text className='text-xl text-[#c79b3b]'>〰</Text>
                      </Group>
                    </Group>
                  </Stack>
                </Paper>
              </Box>
            </SimpleGrid>
          </Paper>
        </Reveal>

        <AboutReviewBlock />

        <Reveal z={40}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl' className='items-stretch'>
            <Stack gap='md'>
              <SectionHeading index='09' title='Đến ăn trực tiếp hoặc đặt giao tận nơi' />

              <Divider
                variant='dashed'
                size={'sm'}
                w={'100%'}
                classNames={{
                  root: 'border-mainColor'
                }}
                labelPosition='center'
                label={
                  <>
                    <IconMapPins size={30} className='italic text-mainColor' />
                  </>
                }
              />

              <Group align='flex-start' wrap='nowrap'>
                <ThemeIcon radius='xl' className='bg-mainColor'>
                  <IconMapPin size={18} />
                </ThemeIcon>
                <Box>
                  <Text fw={800}>Địa chỉ</Text>
                  <Text c='dimmed'>{restaurant?.address || '123 Sài Gòn, Quận Ẩm Thực, Thành phố của chúng tôi'}</Text>
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

              <Flex align={'flex-end'} justify={'flex-end'}>
                <Button
                  component={Link}
                  href='/thuc-don'
                  size='md'
                  w={'max-content'}
                  rightSection={<IconArrowRight size={18} />}
                >
                  Xem thực đơn
                </Button>
              </Flex>
            </Stack>

            <Paper
              p={8}
              radius={'xl'}
              className='relative min-h-[420px] overflow-hidden border border-white/25 bg-slate-950 shadow-[0_28px_80px_rgba(15,23,42,0.18)] dark:border-white/10'
            >
              <Image src='/images/jpg/map.jpg' alt='Bản đồ Phụng Food' fill className='object-cover' />

              <Box className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent' />
              <Box className='absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/20' />

              <Box className='absolute left-[52%] top-[38%]'>
                <Box className='relative flex h-8 w-8 items-center justify-center rounded-full bg-subColor shadow-[0_0_0_10px_rgba(248,193,68,0.18)]'>
                  <Box className='h-2.5 w-2.5 rounded-full bg-black' />
                  <Box className='absolute h-8 w-8 animate-ping rounded-full bg-subColor/45' />
                </Box>
              </Box>

              <Paper
                p='md'
                radius={'xl'}
                className='absolute bottom-5 left-5 right-5 overflow-hidden border border-white/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.88),rgba(30,41,59,0.74),rgba(120,78,25,0.52))] shadow-[0_24px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl'
              >
                <Box className='absolute -right-10 -top-10 h-28 w-28 rounded-full bg-mainColor/20 blur-2xl' />
                <Box className='absolute -bottom-12 left-8 h-24 w-24 rounded-full bg-subColor/25 blur-2xl' />

                <Box className='relative pl-3'>
                  <Group gap='xs' mb={8}>
                    <Box className='h-px w-7 bg-subColor/80' />

                    <Text size='xs' fw={800} className='uppercase tracking-[0.22em] text-subColor'>
                      Vị trí nhà hàng
                    </Text>
                  </Group>

                  <Text fw={900} className='font-quicksand text-lg leading-snug text-white'>
                    Phụng Food Restaurant
                  </Text>

                  <Text mt={6} size='sm' className='max-w-[92%] leading-6 !text-white/75'>
                    Sẵn sàng phục vụ món ngon nóng hổi mỗi ngày, từ căn bếp quen thuộc của Phụng Food.
                  </Text>

                  <Box className='mt-4 flex items-center gap-3'>
                    <Box className='h-2 w-2 rounded-full bg-subColor shadow-[0_0_0_6px_rgba(248,193,68,0.14)]' />

                    <Box className='h-px flex-1 bg-gradient-to-r from-subColor/70 via-white/20 to-transparent' />

                    <Text size='xs' fw={800} className='whitespace-nowrap !text-white/75'>
                      mở cửa mỗi ngày
                    </Text>
                  </Box>
                </Box>
              </Paper>
            </Paper>
          </SimpleGrid>
        </Reveal>
      </Stack>

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

        <Reveal z={40}>
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
        </Reveal>
      </Box>
    </>
  );
}
