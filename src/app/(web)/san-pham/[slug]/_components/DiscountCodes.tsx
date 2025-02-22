'use client';

import { Center, Grid, GridCol, Paper, Spoiler, Title } from '@mantine/core';
import { useState } from 'react';
import { mockPromotions } from '~/app/(web)/thong-tin/_components/promotions';
import ModalDetailVoucher from '~/app/_components/Modals/ModalDetailVoucher';
import VoucherTemplate from '~/app/_components/Template/VoucherTemplate';

export function DiscountCodes() {
  const [checked, setChecked] = useState(false);
  const [openDetail, setOpenDetail] = useState<any>({});

  return (
    <Paper p='md' radius='md' bg='var(--mantine-color-green-0)'>
      <Title order={2} className='font-quicksand' size='xl' fw={700} c='green.9' mb='md'>
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
              <GridCol span={4} key={promo.id}>
                <VoucherTemplate voucher={promo} setOpenDetail={setOpenDetail} />
              </GridCol>
            ))}
        </Grid>
      </Spoiler>
      <ModalDetailVoucher opened={openDetail?.type} onClose={() => setOpenDetail({})} data={openDetail} products={[]} />
    </Paper>
  );
}
