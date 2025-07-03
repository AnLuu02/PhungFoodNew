'use client';

import { Card, Flex, Grid, GridCol, Group, Pagination, Select, Tabs } from '@mantine/core';
import { useMemo, useState } from 'react';
import Empty from '~/components/Empty';
import ModalDetailVoucher from '~/components/Modals/ModalDetailVoucher';
import VoucherTemplate from '~/components/Template/VoucherTemplate';
import { LocalVoucherType } from '~/lib/zod/EnumType';

export default function Promotions({ data }: any) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [openDetail, setOpenDetail] = useState<any>({});
  const filteredPromotions = useMemo(() => {
    if (activeTab === 'all') return data;
    return data.filter((promo: any) => promo.type === activeTab);
  }, [activeTab, data]);

  const totalPages = Math.ceil(filteredPromotions.length / perPage);
  const displayedPromotions = useMemo(
    () => filteredPromotions.slice((page - 1) * perPage, page * perPage),
    [filteredPromotions, page, perPage]
  );

  return (
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
            border: '1px solid #228be6',
            margin: 4
          }
        }}
      >
        <Tabs.List bg={'gray.1'} mb={'md'}>
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
            <Pagination total={totalPages} value={page} onChange={setPage} />
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
      <ModalDetailVoucher opened={openDetail?.type} onClose={() => setOpenDetail({})} data={openDetail} products={[]} />
    </Card>
  );
}
