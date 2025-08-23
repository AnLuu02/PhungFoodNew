'use client';

import { Center, Grid, GridCol, Paper, Spoiler, Title } from '@mantine/core';
import { useState } from 'react';
import ModalDetailVoucher from '~/components/Modals/ModalDetailVoucher';
import VoucherTemplate from '~/components/Template/VoucherTemplate';
import { mockPromotions } from '~/lib/data-test/data-voucher';

export default function DiscountCodes() {
  const [openDetail, setOpenDetail] = useState<{ opened: boolean; voucherDetail: any }>({
    opened: false,
    voucherDetail: {}
  });
  return (
    <Paper p='md' radius='md' className='bg-green-50 dark:bg-dark-card'>
      <Title order={2} className='font-quicksand text-mainColor' size='xl' fw={700} mb='md'>
        MÃ GIẢM GIÁ
      </Title>
      <Spoiler
        maxHeight={150}
        showLabel={
          <Center>
            <span className='text-green-9 cursor-pointer text-sm font-semibold'>Xem tất cả</span>
          </Center>
        }
        hideLabel={
          <Center>
            <span className='text-green-9 cursor-pointer text-sm font-semibold'>Thu gọn</span>
          </Center>
        }
      >
        <Grid mt='md'>
          {mockPromotions?.length > 0 &&
            mockPromotions.map(promo => (
              <GridCol span={{ base: 12, sm: 6, md: 6, lg: 4 }} key={promo.id}>
                <VoucherTemplate voucher={promo} setOpenDetail={setOpenDetail} />
              </GridCol>
            ))}
        </Grid>
      </Spoiler>
      <ModalDetailVoucher
        openDetail={openDetail}
        onClose={() => setOpenDetail({ opened: false, voucherDetail: {} })}
        products={[]}
      />
    </Paper>
  );
}
