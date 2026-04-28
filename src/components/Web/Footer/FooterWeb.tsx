import { Badge, Box, Divider, Flex, Grid, GridCol, SimpleGrid, Text, Title, Tooltip } from '@mantine/core';
import { IconLink, IconPhone, IconTruck } from '@tabler/icons-react';
import Link from 'next/link';
import Logo from '~/components/Logo';
import { generateSocialUrl, iconMap } from '~/lib/FuncHandler/generateSocial';
export default async function FooterWeb({ restaurant }: { restaurant: any }) {
  const timeOpen = () => {
    const timeIndex = new Date().getDay();
    const timeOpens = restaurant?.openingHours ?? [];
    const timeOpen = timeOpens?.find((item: any) => item?.dayOfWeek === timeIndex?.toString());
    return {
      ...timeOpen,
      timeIndex
    };
  };

  return (
    <>
      <Box
        px={{ base: 10, sm: 30, md: 30, lg: 130 }}
        className='w-full overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 py-8 text-white dark:bg-dark-background'
      >
        <Grid className='w-full overflow-hidden' columns={24}>
          <GridCol span={{ base: 24, sm: 12, md: 9 }} className='mb-4 sm:mb-0'>
            <Box className='space-y-2'>
              <Logo className='w-[300px] text-mainColor lg:w-[300px]' />
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
                    <Box className='text-gray-400 dark:text-dark-text'>
                      Đặt món:{' '}
                      <a href={`tel:${restaurant?.phone || '09180646181'}`} className='hover:underline'>
                        {restaurant?.phone || '09180646181'}
                      </a>
                    </Box>
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
                    <Box className='text-gray-400 dark:text-dark-text'>Hỗ trợ 24/7</Box>
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
                    <Box className='text-gray-400 dark:text-dark-text'>Qua website & app</Box>
                  </Box>
                </Box>
                <Box className='flex items-center gap-3'>
                  <IconTruck className='h-4 w-4 text-blue-400' />
                  <Box>
                    <Box className='font-medium'>
                      Giao hàng: {timeOpen().openTime || '10:00'} - {timeOpen().closeTime || '22:00'}
                    </Box>
                    <Box className='text-gray-400 dark:text-dark-text'>Hàng ngày</Box>
                  </Box>
                </Box>
                <Box className='flex items-center gap-3'>
                  <Box className='h-4 w-4 text-yellow-400'>⚡</Box>
                  <Box>
                    <Box className='font-medium'>Giao nhanh 30-45 phút</Box>
                    <Box className='text-gray-400 dark:text-dark-text'>Trong bán kính 15km</Box>
                  </Box>
                </Box>
                <Box className='flex items-center gap-3'>
                  <Box className='h-4 w-4 text-purple-400'>💳</Box>
                  <Box>
                    <Box className='font-medium'>Thanh toán đa dạng</Box>
                    <Box className='text-gray-400 dark:text-dark-text'>Tiền mặt, thẻ, ví điện tử</Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </GridCol>

          <GridCol span={{ base: 24, sm: 12, md: 5 }} className='mb-0'>
            <Box className='space-y-4'>
              <Title order={3} className='mb-4 font-quicksand font-semibold'>
                Chính sách & Hỗ trợ
              </Title>
              <Flex direction={'column'} className='space-y-3 text-sm'>
                <Link href='/lien-he' className='hover:underline'>
                  Thông tin liên hệ
                </Link>
                <Link href='/chinh-sach#payment' className='hover:underline'>
                  Phương thức thanh toán
                </Link>
                <Link href='/chinh-sach#general' className='hover:underline'>
                  Chính sách chung
                </Link>
                <Link href='/chinh-sach#delivery' className='hover:underline'>
                  Chính sách giao hàng
                </Link>
                <Link href='/chinh-sach#order-guide' className='hover:underline'>
                  Hướng dẫn đặt món
                </Link>
              </Flex>

              <Box className='pt-4'>
                <Title order={4} className='mb-3 font-quicksand font-medium'>
                  Theo Dõi Chúng Tôi
                </Title>
                <SimpleGrid cols={{ base: 7, md: 4, lg: 5 }}>
                  {restaurant?.socials &&
                    restaurant?.socials?.map((item: any) => {
                      const { icon: IconComponent, color } = iconMap[item?.platform] || {
                        icon: IconLink,
                        color: 'black'
                      };
                      return (
                        <a
                          key={item.platform}
                          href={generateSocialUrl(item.pattern, item.value)}
                          target='_blank'
                          aria-label={item.key}
                          className='cursor-pointer hover:underline hover:opacity-80'
                        >
                          <Tooltip label={item.label}>
                            <Box
                              w={40}
                              h={40}
                              bg={color}
                              className='flex items-center justify-center overflow-hidden rounded-full'
                            >
                              {IconComponent && <IconComponent size={24} stroke={1.5} />}
                            </Box>
                          </Tooltip>
                        </a>
                      );
                    })}
                </SimpleGrid>
              </Box>
            </Box>
          </GridCol>
        </Grid>
        <Divider size={'xs'} mt={'xl'} variant='dotted' />
        <Box className='mb-4 flex flex-col items-start justify-between gap-1 sm:flex-row md:mb-0 md:items-center md:gap-4'>
          <Box className='text-sm text-gray-400 dark:text-dark-text'>
            <p>© 2025 Nhà Hàng Phụng Food. Tất cả quyền được bảo lưu.</p>
            <p className='mt-1'>MST: 0123456789 | Giấy phép KDDD: 123/GP-UBND</p>
          </Box>
          <Box className='flex items-center gap-4 text-sm'>
            <span className='text-gray-400 dark:text-dark-text'>Chứng nhận:</span>
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
