import { Badge, Box, Divider, Flex, Grid, GridCol, Text, Title } from '@mantine/core';
import { IconPhone, IconTruck } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '~/components/Logo';
import { api } from '~/trpc/server';
export default async function FooterWeb() {
  const restaurant = await api.Restaurant.getOneActive();
  return (
    <>
      <Box
        px={{ base: 10, sm: 30, md: 30, lg: 130 }}
        className='w-full overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 py-8 text-white dark:bg-dark-background'
      >
        <Grid className='w-full overflow-hidden' columns={24}>
          <GridCol span={{ base: 24, sm: 12, md: 9 }} className='mb-4 sm:mb-0'>
            <Box className='space-y-2'>
              <Logo width={200} height={80} />
              <Text className='text-xl font-bold' tt={'uppercase'}>
                {restaurant?.name || 'NHÀ HÀNG PHUNGFOOD'}
              </Text>
              <Text c={'dimmed'} className='w-[90%] text-sm leading-relaxed'>
                {restaurant?.description ||
                  'Mang đến cho bạn những món ăn ngon nhất với nguyên liệu tươi sạch và công thức truyền thống.'}
              </Text>
              <Box className='flex items-center gap-2 text-yellow-400'>
                <span className='text-sm'>⭐⭐⭐⭐⭐</span>
                <Text c={'dimmed'} className='text-sm'>
                  4.8/5 (2,450+ đánh giá)
                </Text>
              </Box>
            </Box>
          </GridCol>
          <GridCol span={{ base: 24, sm: 12, md: 5 }} className='mb-4 sm:mb-0'>
            <Box className='space-y-4'>
              <Title order={3} className='mb-4 font-quicksand font-semibold'>
                Liên Hệ
              </Title>
              <Box className='space-y-3 text-sm'>
                <Box className='flex items-center gap-3'>
                  <IconPhone className='h-4 w-4 text-indigo-400' />
                  <Box>
                    <Box className='font-medium'>
                      Hotline:{' '}
                      <a href={`tel:${restaurant?.phone || '09180646181'}`} className='hover:underline'>
                        {restaurant?.phone || '09180646181'}
                      </a>
                    </Box>
                    <Box className='text-gray-400 dark:text-white'>Đặt món: 0942486950</Box>
                  </Box>
                </Box>
                <Box className='flex items-start gap-3'>
                  <Box className='mt-0.5 h-4 w-4 text-green-400'>📧</Box>
                  <Box>
                    <Box className='hover:underline'>
                      <a href={`mailto:${restaurant?.email || 'anluu099@gmail'}`}>
                        {restaurant?.email || 'anluu099@gmail'}
                      </a>
                    </Box>
                    <Box className='text-gray-400 dark:text-white'>Hỗ trợ 24/7</Box>
                  </Box>
                </Box>
                <Box className='flex items-start gap-3'>
                  <Box className='mt-0.5 h-4 w-4 text-red-400'>📍</Box>
                  <Text className='text-sm'>{restaurant?.address || 'Đầu lộ Tân Thành, Cà Mau'}</Text>
                </Box>
              </Box>
            </Box>
          </GridCol>

          <GridCol span={{ base: 24, sm: 12, md: 5 }} className='mb-4 sm:mb-0'>
            <Box className='space-y-4'>
              <Title order={3} className='mb-4 font-quicksand font-semibold'>
                Đặt Hàng Online
              </Title>
              <Box className='space-y-3 text-sm'>
                <Box className='flex items-center gap-3'>
                  <Box className='h-4 w-4 text-green-400'>🌐</Box>
                  <Box>
                    <Box className='font-medium'>Đặt hàng 24/7</Box>
                    <Box className='text-gray-400 dark:text-white'>Qua website & app</Box>
                  </Box>
                </Box>
                <Box className='flex items-center gap-3'>
                  <IconTruck className='h-4 w-4 text-blue-400' />
                  <Box>
                    <Box className='font-medium'>Giao hàng: 9:00 - 21:30</Box>
                    <Box className='text-gray-400 dark:text-white'>Hàng ngày</Box>
                  </Box>
                </Box>
                <Box className='flex items-center gap-3'>
                  <Box className='h-4 w-4 text-yellow-400'>⚡</Box>
                  <Box>
                    <Box className='font-medium'>Giao nhanh 30-45 phút</Box>
                    <Box className='text-gray-400 dark:text-white'>Trong bán kính 15km</Box>
                  </Box>
                </Box>
                <Box className='flex items-center gap-3'>
                  <Box className='h-4 w-4 text-purple-400'>💳</Box>
                  <Box>
                    <Box className='font-medium'>Thanh toán đa dạng</Box>
                    <Box className='text-gray-400 dark:text-white'>Tiền mặt, thẻ, ví điện tử</Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </GridCol>

          <GridCol span={{ base: 24, sm: 12, md: 5 }} className='mb-4 sm:mb-0'>
            <Box className='space-y-4'>
              <Title order={3} className='mb-4 font-quicksand font-semibold'>
                Chính sách & Hỗ trợ
              </Title>
              <Flex direction={'column'} className='space-y-3 text-sm'>
                <Link href='/lien-he' className='rounded-sm hover:underline'>
                  Thông tin liên hệ
                </Link>
                <Link href='/chinh-sach#payment' className='rounded-sm hover:underline'>
                  Phương thức thanh toán
                </Link>
                <Link href='/chinh-sach#general' className='rounded-sm hover:underline'>
                  Chính sách chung
                </Link>
                <Link href='/chinh-sach#delivery' className='rounded-sm hover:underline'>
                  Chính sách giao hàng
                </Link>
                <Link href='/chinh-sach#order-guide' className='rounded-sm hover:underline'>
                  Hướng dẫn đặt món
                </Link>
              </Flex>

              <Box className='pt-4'>
                <Title order={4} className='mb-3 font-quicksand font-medium'>
                  Theo Dõi Chúng Tôi
                </Title>
                <Flex align={'center'} gap={'md'}>
                  <a
                    href={`https://zalo.me/${restaurant?.phone || '0918064618'}`}
                    target='_blank'
                    aria-label='Liên hệ Zalo'
                    className='rounded-sm hover:underline hover:opacity-80'
                  >
                    <Image
                      loading='lazy'
                      width={40}
                      height={40}
                      alt='zalo'
                      src={'/images/svg/icon-zalo.svg'}
                      style={{ objectFit: 'cover' }}
                    />
                  </a>
                  <a
                    href={`https://m.me/${restaurant?.socials.find(item => item.key === 'facebook')?.url || 'anluu099'}`}
                    target='_blank'
                    aria-label='Liên hệ Messenger'
                    className='rounded-sm hover:underline hover:opacity-80'
                  >
                    <Image
                      loading='lazy'
                      width={40}
                      height={40}
                      alt='facebook'
                      src={'/images/svg/icon-facebook.svg'}
                      style={{ objectFit: 'cover' }}
                    />
                  </a>

                  <a
                    href={`tel:${restaurant?.phone || '0911862581'}`}
                    aria-label='Gọi điện thoại'
                    className='rounded-sm hover:underline hover:opacity-80'
                  >
                    <Image
                      loading='lazy'
                      width={40}
                      height={40}
                      alt='phone'
                      src={'/images/svg/icon-phone.svg'}
                      style={{ objectFit: 'cover' }}
                    />
                  </a>
                </Flex>
              </Box>
            </Box>
          </GridCol>
        </Grid>
        <Divider size={'xs'} mt={'xl'} variant='dotted' />
        <Box className='mb-4 flex flex-col items-start justify-between gap-1 sm:flex-row md:mb-0 md:items-center md:gap-4'>
          <Box className='text-sm text-gray-400 dark:text-white'>
            <p>© 2025 Nhà Hàng Phụng Food. Tất cả quyền được bảo lưu.</p>
            <p className='mt-1'>MST: 0123456789 | Giấy phép KDDD: 123/GP-UBND</p>
          </Box>
          <Box className='flex items-center gap-4 text-sm'>
            <span className='text-gray-400 dark:text-white'>Chứng nhận:</span>
            <Box className='flex gap-2'>
              <Badge variant='outline' className='border-green-300 bg-green-100 text-xs text-green-800'>
                HACCP
              </Badge>
              <Badge variant='outline' className='border-blue-300 bg-blue-100 text-xs text-blue-800'>
                ISO 22000
              </Badge>
              <Badge variant='outline' className='border-yellow-300 bg-yellow-100 text-xs text-yellow-800'>
                VietGAP
              </Badge>
            </Box>
          </Box>
        </Box>
        <Divider size={'xs'} mb={'md'} c={'gray.1'} variant='dotted' />
      </Box>
      <Box className='w-full overflow-hidden bg-mainColor pb-4 pt-4 text-center text-sm text-white'>
        <Text size='md' fw={500}>
          © Bản quyền thuộc về <b className='text-subColor'>Mr. Bean</b> | Cung cấp bởi{' '}
          <b className='text-subColor'>Sapo</b> | <b className='text-subColor'>An Luu</b> Custom
        </Text>
      </Box>
    </>
  );
}
