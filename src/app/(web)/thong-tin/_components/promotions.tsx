'use client';

import { Card, Grid, GridCol, Group, Tabs } from '@mantine/core';
import { VoucherType } from '@prisma/client';
import { useState } from 'react';
import Empty from '~/app/_components/Empty';
import ModalDetailVoucher from '~/app/_components/Modals/ModalDetailVoucher';
import VoucherTemplate from '~/app/_components/Template/VoucherTemplate';

export const mockPromotions = [
  {
    id: 'voucher-1',
    name: 'Giảm 20%',
    description: 'Giảm 20% cho đơn hàng từ 150k',
    type: 'PERCENTAGE',
    discountValue: 20,
    maxDiscount: 20000,
    minOrderPrice: 150000,
    applyAll: true,
    availableQuantity: 10,
    quantity: 10,
    usedQuantity: 0,
    vipLevel: 0,
    tag: 'giam-20',
    startDate: new Date('2025-02-15'),
    endDate: new Date('2025-03-15'),
    createdAt: new Date()
  },
  {
    id: 'voucher-2',
    name: 'Giảm 50k',
    description: 'Giảm ngay 50k cho đơn từ 300k',
    type: 'FIXED',
    discountValue: 50000,
    maxDiscount: null,
    minOrderPrice: 300000,
    applyAll: true,
    availableQuantity: 15,
    quantity: 15,
    usedQuantity: 0,
    vipLevel: 0,
    tag: 'giam-50k',
    startDate: new Date('2025-02-20'),
    endDate: new Date('2025-03-20'),
    createdAt: new Date()
  },
  {
    id: 'voucher-3',
    name: 'Giảm 15%',
    description: 'Giảm 15% tối đa 30k cho đơn từ 200k',
    type: 'PERCENTAGE',
    discountValue: 15,
    maxDiscount: 30000,
    minOrderPrice: 200000,
    applyAll: true,
    availableQuantity: 20,
    quantity: 20,
    usedQuantity: 0,
    vipLevel: 1,
    tag: 'giam-15',
    startDate: new Date('2025-02-10'),
    endDate: new Date('2025-03-10'),
    createdAt: new Date()
  },
  {
    id: 'voucher-4',
    name: 'Giảm 30k',
    description: 'Giảm 30k cho đơn hàng từ 250k',
    type: 'FIXED',
    discountValue: 30000,
    maxDiscount: null,
    minOrderPrice: 250000,
    applyAll: true,
    availableQuantity: 12,
    quantity: 12,
    usedQuantity: 0,
    vipLevel: 0,
    tag: 'giam-30k',
    startDate: new Date('2025-02-12'),
    endDate: new Date('2025-03-12'),
    createdAt: new Date()
  },
  {
    id: 'voucher-5',
    name: 'Giảm 25%',
    description: 'Giảm 25% tối đa 50k cho đơn từ 300k',
    type: 'PERCENTAGE',
    discountValue: 25,
    maxDiscount: 50000,
    minOrderPrice: 300000,
    applyAll: true,
    availableQuantity: 8,
    quantity: 8,
    usedQuantity: 0,
    vipLevel: 2,
    tag: 'giam-25',
    startDate: new Date('2025-02-18'),
    endDate: new Date('2025-03-18'),
    createdAt: new Date()
  },
  {
    id: 'voucher-6',
    name: 'Giảm 100k',
    description: 'Giảm 100k cho đơn từ 500k',
    type: 'FIXED',
    discountValue: 100000,
    maxDiscount: null,
    minOrderPrice: 500000,
    applyAll: true,
    availableQuantity: 5,
    quantity: 5,
    usedQuantity: 0,
    vipLevel: 3,
    tag: 'giam-100k',
    startDate: new Date('2025-02-25'),
    endDate: new Date('2025-03-25'),
    createdAt: new Date()
  },
  {
    id: 'voucher-7',
    name: 'Giảm 10%',
    description: 'Giảm 10% tối đa 20k cho đơn từ 100k',
    type: 'PERCENTAGE',
    discountValue: 10,
    maxDiscount: 20000,
    minOrderPrice: 100000,
    applyAll: true,
    availableQuantity: 30,
    quantity: 30,
    usedQuantity: 0,
    vipLevel: 0,
    tag: 'giam-10',
    startDate: new Date('2025-02-08'),
    endDate: new Date('2025-03-08'),
    createdAt: new Date()
  },
  {
    id: 'voucher-8',
    name: 'Giảm 5%',
    description: 'Giảm 5% tối đa 10k cho đơn từ 50k',
    type: 'PERCENTAGE',
    discountValue: 5,
    maxDiscount: 10000,
    minOrderPrice: 50000,
    applyAll: true,
    availableQuantity: 50,
    quantity: 50,
    usedQuantity: 0,
    vipLevel: 0,
    tag: 'giam-5',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-02-28'),
    createdAt: new Date()
  },
  {
    id: 'voucher-9',
    name: 'Giảm 70k',
    description: 'Giảm 70k cho đơn từ 400k',
    type: 'FIXED',
    discountValue: 70000,
    maxDiscount: null,
    minOrderPrice: 400000,
    applyAll: true,
    availableQuantity: 7,
    quantity: 7,
    usedQuantity: 0,
    vipLevel: 1,
    tag: 'giam-70k',
    startDate: new Date('2025-02-22'),
    endDate: new Date('2025-03-22'),
    createdAt: new Date()
  },
  {
    id: 'voucher-10',
    name: 'Giảm 40%',
    description: 'Giảm 40% tối đa 80k cho đơn từ 500k',
    type: 'PERCENTAGE',
    discountValue: 40,
    maxDiscount: 80000,
    minOrderPrice: 500000,
    applyAll: true,
    availableQuantity: 6,
    quantity: 6,
    usedQuantity: 0,
    vipLevel: 2,
    tag: 'giam-40',
    startDate: new Date('2025-02-28'),
    endDate: new Date('2025-03-30'),
    createdAt: new Date()
  }
];

export default function Promotions({ promotions, isLoading }: any) {
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [openDetail, setOpenDetail] = useState<any>({});
  const promotionData = promotions || [];
  const getFilteredPromotions = () => {
    if (activeTab === 'all') return promotionData;
    return promotionData.filter((promo: any) => promo.type === activeTab);
  };

  return (
    <Card withBorder shadow='sm' padding='lg' radius='md'>
      <Tabs variant='pills' value={activeTab} onChange={setActiveTab}>
        <Tabs.List bg={'gray.1'} mb={'md'}>
          <Group gap={0}>
            <Tabs.Tab size={'md'} fw={700} value='all'>
              Tất cả
            </Tabs.Tab>
            <Tabs.Tab size={'md'} fw={700} value={VoucherType.PERCENTAGE}>
              Phầm trăm
            </Tabs.Tab>
            <Tabs.Tab size={'md'} fw={700} value={VoucherType.FIXED}>
              Tiền mặt
            </Tabs.Tab>
          </Group>
        </Tabs.List>
        <Tabs.Panel value={activeTab || 'all'}>
          {getFilteredPromotions()?.length > 0 ? (
            <Grid mt='md'>
              {getFilteredPromotions().map((promo: any) => (
                <GridCol span={6} key={promo.id}>
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
        </Tabs.Panel>
      </Tabs>
      <ModalDetailVoucher opened={openDetail?.type} onClose={() => setOpenDetail({})} data={openDetail} products={[]} />
    </Card>
  );
}
