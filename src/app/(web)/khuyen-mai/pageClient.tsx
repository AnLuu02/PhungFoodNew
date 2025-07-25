'use client';
import {
  Box,
  Card,
  CardSection,
  Center,
  Container,
  Flex,
  Grid,
  GridCol,
  Group,
  Pagination,
  Space,
  Stack,
  Tabs,
  Text
} from '@mantine/core';
import { VoucherType } from '@prisma/client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import BButton from '~/components/Button';
import Empty from '~/components/Empty';
import VoucherTemplate from '~/components/Template/VoucherTemplate';
import LayoutPromotion from '~/components/Web/Home/Section/Layout-Promotion';
import LayoutAds from '~/components/Web/Home/Section/LayoutGrid3Col';

const ModalDetailVoucher = dynamic(() => import('~/components/Modals/ModalDetailVoucher'), { ssr: false });

const ITEMS_PER_PAGE = 4;

export default function FoodPromotionPageClient({ voucherData, productData }: any) {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [openDetail, setOpenDetail] = useState<any>({});

  const filteredPromotions = useMemo(() => {
    if (activeTab === 'all') return voucherData || [];
    return voucherData?.filter((promo: any) => promo.type === activeTab) || [];
  }, [voucherData, activeTab]);

  const paginatedPromotions = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return Array.isArray(filteredPromotions) ? filteredPromotions.slice(startIndex, startIndex + ITEMS_PER_PAGE) : [];
  }, [filteredPromotions, page]);

  const totalPages = useMemo(() => Math.ceil(filteredPromotions.length / ITEMS_PER_PAGE), [filteredPromotions]);

  return (
    <>
      <Card radius={'lg'} p={0} className='hidden bg-gray-100 md:block'>
        <CardSection pos={'relative'}>
          <Box w={'100%'} h={500} pos={'relative'}>
            <Image
              loading='lazy'
              className='cursor-pointer rounded-2xl transition-all duration-500 ease-in-out hover:scale-105'
              fill
              style={{ objectFit: 'cover' }}
              alt='Khuyến mãi đặc biệt'
              src='/images/banner/banner_food.png'
            />
          </Box>
          <Flex
            justify={'center'}
            align={'center'}
            pos={'absolute'}
            left={0}
            top={0}
            bottom={0}
            right={0}
            className='bg-[rgba(0,0,0,0.5)]'
          >
            <Stack w={{ sm: '80%', md: '80%', lg: '50%' }} gap={'xl'} align='center' justify='center'>
              <Text fw={700} className='text-6xl text-white sm:text-5xl'>
                Ưu đãi đặc biệt
              </Text>
              <Text className='text-center text-4xl text-white sm:text-3xl' fw={700}>
                Giảm <i className='animate-wiggle text-mainColor'>"50%"</i> đối với những khách hàng Bạch kim trở lên
              </Text>
              <BButton w={'max-content'} size='xl' title={'Khám phá ngay'} />
            </Stack>
          </Flex>
        </CardSection>
      </Card>
      <Space h='xl' className='hidden md:block' />

      <Container pl={0} pr={0} size='xl'>
        <LayoutAds />
        <Space h='xl' />

        {productData && productData?.products?.length > 0 && (
          <>
            <LayoutPromotion data={productData.products} />
            <Space h='xl' />
          </>
        )}
        {voucherData && voucherData?.length > 0 && (
          <Card withBorder shadow='sm' padding='lg' radius='md'>
            <Tabs
              variant='pills'
              value={activeTab}
              onChange={value => {
                setPage(1);
                setActiveTab(value);
              }}
            >
              <Tabs.List mb={'md'} className='bg-gray-100'>
                <Group gap={0}>
                  <Tabs.Tab size={'md'} fw={700} value='all'>
                    Tất cả
                  </Tabs.Tab>
                  <Tabs.Tab size={'md'} fw={700} value={VoucherType?.PERCENTAGE || 'percentage'}>
                    Phần trăm
                  </Tabs.Tab>
                  <Tabs.Tab size={'md'} fw={700} value={VoucherType?.FIXED || 'fixed'}>
                    Tiền mặt
                  </Tabs.Tab>
                </Group>
              </Tabs.List>

              <Tabs.Panel value={activeTab || 'all'}>
                <Grid mt='md'>
                  {paginatedPromotions?.length > 0 ? (
                    paginatedPromotions.map((promo: any) => (
                      <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }} key={promo.id}>
                        <VoucherTemplate voucher={promo} setOpenDetail={setOpenDetail} />
                      </GridCol>
                    ))
                  ) : (
                    <Empty
                      title='Không có khuyến mãi nào'
                      content='Vui lòng quay lại sau. Xin cảm ơn!'
                      size='xs'
                      hasButton={false}
                    />
                  )}
                </Grid>
              </Tabs.Panel>
            </Tabs>

            <Center>
              <Pagination
                classNames={{ control: 'bg-mainColor' }}
                mt='xl'
                size='md'
                total={totalPages}
                value={page}
                onChange={setPage}
              />
            </Center>
            <ModalDetailVoucher
              opened={openDetail?.type}
              onClose={() => setOpenDetail({})}
              data={openDetail}
              products={[]}
            />
          </Card>
        )}
      </Container>
    </>
  );
}
