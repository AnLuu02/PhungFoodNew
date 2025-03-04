'use client';

import {
  Card,
  CardSection,
  Center,
  Container,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  Pagination,
  Space,
  Stack,
  Tabs,
  Text
} from '@mantine/core';
import { VoucherType } from '@prisma/client';
import { useState } from 'react';
import BButton from '~/app/_components/Button';
import Empty from '~/app/_components/Empty';
import LoadingComponent from '~/app/_components/Loading';
import ModalDetailVoucher from '~/app/_components/Modals/ModalDetailVoucher';
import VoucherTemplate from '~/app/_components/Template/VoucherTemplate';
import LayoutAds from '~/app/_components/Web/Home/Section/Layout-Ads';
import LayoutPromotion from '~/app/_components/Web/Home/Section/Layout-Promotion';
import { api } from '~/trpc/react';

const ITEMS_PER_PAGE = 4;

export default function FoodPromotionPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [openDetail, setOpenDetail] = useState<any>({});

  const { data: voucherData, isLoading: isVoucherLoading } = api.Voucher.getAll.useQuery();
  const { data: productData, isLoading: isProductLoading } = api.Product.find.useQuery({
    skip: 0,
    take: 10,
    discount: true
  });

  const getFilteredPromotions = () => {
    if (activeTab === 'all') return voucherData || [];
    return voucherData?.filter(promo => promo.type === activeTab) || [];
  };

  const filteredPromotions = getFilteredPromotions();
  const totalPages = Math.ceil(filteredPromotions.length / ITEMS_PER_PAGE);
  const paginatedPromotions = filteredPromotions.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (isProductLoading || isVoucherLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Card radius={'lg'} bg={'gray.1'} p={0} className='hidden md:block'>
        <CardSection pos={'relative'}>
          <Image
            loading='lazy'
            className='cursor-pointer rounded-2xl transition-all duration-500 ease-in-out hover:scale-105'
            w={'100%'}
            h={500}
            src='/images/png/banner_food.png'
          />
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
              <Text c={'white'} fw={700} className='text-6xl sm:text-5xl'>
                Ưu đãi đặc biệt
              </Text>
              <Text c={'white'} className='text-center text-4xl sm:text-3xl' fw={700}>
                Giảm <i className='animate-wiggle text-[#008b4b]'>"50%"</i> đối với những khách hàng Bạch kim trở lên
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
              <Tabs.List bg={'gray.1'} mb={'md'}>
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
                    paginatedPromotions.map(promo => (
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
              <Pagination mt='xl' size='md' total={totalPages} value={page} onChange={setPage} />
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
