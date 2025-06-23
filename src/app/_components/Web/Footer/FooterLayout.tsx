'use client';
import { Box, Center, Flex, Grid, GridCol, Text } from '@mantine/core';
import { IconPhoneIncoming } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { noHeadersLayoutCondition } from '~/app/lib/utils/constants/no-headers-layout-condition';
export default function FooterWebLayout({ restaurant }: any) {
  const pathname = usePathname();
  return (
    noHeadersLayoutCondition.every(path => !pathname.includes(path)) && (
      <>
        <Grid className='w-full overflow-hidden px-4 py-8' bg={'gray.1'}>
          <GridCol span={{ base: 12, sm: 6, md: 5 }}>
            <Center>
              <Box className='space-y-4'>
                <Image
                  loading='lazy'
                  src='/logo/logo_phungfood_1.png'
                  alt='Jollibee Logo'
                  width={330}
                  height={120}
                  objectFit='cover'
                />
                <Text className='text-xl font-bold' tt={'uppercase'}>
                  {restaurant?.name || 'NHÀ HÀNG PHUNGFOOD'}
                </Text>
                <Text size='sm'>Địa chỉ: {restaurant?.address || 'Đầu lộ Tân Thành, Cà Mau'}</Text>
                <Text size='sm'>Điện thoại: {restaurant?.phone || ' 0911862581(Phụng) - 0913290959 (Hòa)'}</Text>
                <Text size='sm'>Mã số thuế: 0303883266</Text>
                <Text size='sm'>Ngày cấp: 15/07/2008 – Nơi cấp: Cục Thuế Hồ Chí Minh</Text>
                <Text size='sm'>Hộp thư góp ý: {restaurant?.email || `jbvnfeedback@jollibee.com.vn`}</Text>
              </Box>
            </Center>
          </GridCol>

          <GridCol span={{ base: 12, sm: 6, md: 3 }}>
            <Box className='space-y-6'>
              <Box>
                <Flex align={'center'} mb={4}>
                  <IconPhoneIncoming size={30} color='red' />
                  <Box className='ml-2 text-4xl font-bold text-red-600'>1900-1533</Box>
                </Flex>
                <Box className='inline-block rounded-lg bg-yellow-400 px-4 py-2 font-bold text-[#008b4b]'>
                  GIAO HÀNG TẬN NƠI
                </Box>
              </Box>
              <Flex direction={'column'} className='space-y-3 text-sm'>
                <Link prefetch={false} href='#' className='rounded-sm hover:underline'>
                  Liên hệ
                </Link>

                <Link prefetch={false} href='#' className='rounded-sm hover:underline'>
                  Chính sách và quy định chung
                </Link>

                <Link prefetch={false} href='#' className='rounded-sm hover:underline'>
                  Chính sách thanh toán khi đặt hàng
                </Link>

                <Link prefetch={false} href='#' className='rounded-sm hover:underline'>
                  Chính sách hoạt động
                </Link>

                <Link prefetch={false} href='#' className='rounded-sm hover:underline'>
                  Chính sách bảo mật thông tin
                </Link>

                <Link prefetch={false} href='#' className='rounded-sm hover:underline'>
                  Thông tin vận chuyển và giao nhận
                </Link>

                <Link prefetch={false} href='#' className='rounded-sm hover:underline'>
                  Thông tin đăng ký giao dịch chung
                </Link>

                <Link prefetch={false} href='#' className='rounded-sm hover:underline'>
                  Hướng dẫn đặt phần ăn
                </Link>
              </Flex>
            </Box>
          </GridCol>

          <GridCol span={{ base: 12, sm: 12, md: 4 }}>
            <Box className='space-y-6'>
              <Text className='text-xl font-bold'>HÃY KẾT NỐI VỚI CHÚNG TÔI</Text>
              <Flex align={'center'} gap={'md'}>
                <Link prefetch={false} href='#' className='rounded-sm hover:underline hover:opacity-80'>
                  <Image loading='lazy' width={40} height={40} alt='zalo' src={'/images/svg/icon-zalo.svg'} />
                </Link>
                <Link prefetch={false} href='#' className='rounded-sm hover:underline hover:opacity-80'>
                  <Image loading='lazy' width={40} height={40} alt='facebook' src={'/images/svg/icon-facebook.svg'} />
                </Link>
                <Link prefetch={false} href='#' className='rounded-sm hover:underline hover:opacity-80'>
                  <Image loading='lazy' width={40} height={40} alt='phone' src={'/images/svg/icon-phone.svg'} />
                </Link>
              </Flex>
              <Box className='flex justify-center lg:justify-start'>
                <Image loading='lazy' src='/images/png/bocongthuong.png' alt='Bộ Công Thương' width={200} height={70} />
              </Box>
              <Box className='space-y-4'>
                <h4 className='text-center font-bold lg:text-left'>TẢI ỨNG DỤNG ĐẶT HÀNG VỚI NHIỀU ƯU ĐÃI HƠN</h4>
                <Box className='flex justify-center gap-4 lg:justify-start'>
                  <Link prefetch={false} href='#' className='rounded-sm hover:underline hover:opacity-80'>
                    <Image
                      loading='lazy'
                      src='/images/png/logo_playstore.png'
                      alt='Google Play'
                      width={140}
                      height={42}
                    />
                  </Link>
                  <Link prefetch={false} href='#' className='rounded-sm hover:underline hover:opacity-80'>
                    <Image loading='lazy' src='/images/png/logo_appstore.png' alt='App Store' width={140} height={42} />
                  </Link>
                </Box>
              </Box>
            </Box>
          </GridCol>
        </Grid>
        <Box className='w-full overflow-hidden bg-[#008b4b] pb-4 pt-4 text-center text-sm text-white'>
          <Text size='md' fw={500}>
            © Bản quyền thuộc về <b className='text-[#F8C144]'>Mr. Bean</b> | Cung cấp bởi{' '}
            <b className='text-[#F8C144]'>Sapo</b> | <b className='text-[#F8C144]'>An Luu</b> Custom
          </Text>
        </Box>
      </>
    )
  );
}
