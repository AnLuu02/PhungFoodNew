'use client';

import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Pagination,
  Select,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import { IconGift } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import Empty from '~/components/Empty';
import ModalDetailVoucher from '~/components/Modals/ModalDetailVoucher';
import VoucherTemplate from '~/components/Template/VoucherTemplate';
import { LocalVoucherType } from '~/lib/zod/EnumType';

export default function Promotions({ vouchers }: { vouchers: any }) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [openDetail, setOpenDetail] = useState<{ opened: boolean; voucherDetail: any }>({
    opened: false,
    voucherDetail: {}
  });
  const filteredPromotions = useMemo(() => {
    if (activeTab === 'all') return vouchers;
    return vouchers.filter((promo: any) => promo.type === activeTab);
  }, [activeTab, vouchers]);

  const totalPages = Math.ceil(filteredPromotions.length / perPage);
  const displayedPromotions = useMemo(
    () => filteredPromotions.slice((page - 1) * perPage, page * perPage),
    [filteredPromotions, page, perPage]
  );

  return (
    <Stack>
      <Flex className='sm:items-center' gap={'md'} justify={'space-between'} direction={{ base: 'column', sm: 'row' }}>
        <Box w={{ base: '100%', sm: '50%' }}>
          <Title order={2} className='font-quicksand'>
            Voucher của tôi
          </Title>
          <Text size='sm' c={'dimmed'}>
            Tất cả các voucher đã và đang khả dụng. Có thể sử dụng ngay.
          </Text>
        </Box>
        <Button className='rounded-md bg-mainColor hover:bg-mainColor/90'>Mua hàng ngay</Button>
      </Flex>
      <Card withBorder shadow='sm' padding='lg' radius='md'>
        <Tabs
          variant='pills'
          value={activeTab}
          onChange={(value: any) => {
            setActiveTab(value);
            setPage(1);
          }}
          styles={{
            tab: {
              border: '1px solid ',
              marginRight: 6
            }
          }}
          classNames={{
            tab: `!rounded-md !border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed`
          }}
        >
          <Flex
            gap={'md'}
            direction={{ base: 'column', md: 'row' }}
            justify={'space-between'}
            className='items-center sm:items-start md:items-center'
          >
            <Group align='center'>
              <ThemeIcon
                size='xl'
                classNames={{
                  root: 'bg-subColor text-white'
                }}
              >
                <IconGift />
              </ThemeIcon>
              <Stack gap={1}>
                <Title order={3} className='font-quicksand'>
                  Danh sách voucher
                </Title>
                <Text size='xs' c={'dimmed'}>
                  Có {filteredPromotions.length || 0} voucher
                </Text>
              </Stack>
            </Group>
            <Divider w={'60%'} className='sm:hidden' />
            <Tabs.List>
              <Group gap={0}>
                <Tabs.Tab size={'md'} fw={700} value='all'>
                  Tất cả
                </Tabs.Tab>
                <Tabs.Tab size={'md'} fw={700} value={LocalVoucherType.PERCENTAGE}>
                  Phầm trăm
                </Tabs.Tab>
                <Tabs.Tab size={'md'} fw={700} value={LocalVoucherType.FIXED}>
                  Tiền mặt
                </Tabs.Tab>
              </Group>
            </Tabs.List>
          </Flex>

          <Divider my='sm' />
          <Tabs.Panel value={activeTab || 'all'}>
            {displayedPromotions?.length > 0 ? (
              <Grid mt='md'>
                {displayedPromotions.map((promo: any) => (
                  <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }} key={promo.id}>
                    <VoucherTemplate voucher={promo} setOpenDetail={setOpenDetail} />
                  </GridCol>
                ))}
              </Grid>
            ) : (
              <Empty
                title='Không có khuyến mãi nào'
                content='Vui lòng quay lại sau. Xin cảm ơn!'
                size='xs'
                hasButton={false}
              />
            )}
            <Flex
              mt='xl'
              justify='flex-end'
              align={'center'}
              gap={'md'}
              direction={{ base: 'column-reverse', md: 'row' }}
            >
              <Pagination
                total={totalPages}
                value={page}
                onChange={setPage}
                classNames={{
                  control:
                    'hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white'
                }}
              />
              <Select
                value={String(perPage)}
                w={100}
                onChange={value => {
                  setPerPage(Number(value));
                  setPage(1);
                }}
                data={['4', '8', '12', '20']}
              />
            </Flex>
          </Tabs.Panel>
        </Tabs>
        <ModalDetailVoucher
          openDetail={openDetail}
          onClose={() => setOpenDetail({ opened: false, voucherDetail: {} })}
          products={[]}
        />
      </Card>
    </Stack>
  );
}
