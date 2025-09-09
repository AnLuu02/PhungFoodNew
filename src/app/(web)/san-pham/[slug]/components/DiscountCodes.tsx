'use client';

import { Center, Grid, GridCol, Paper, Spoiler, Title } from '@mantine/core';
import VoucherTemplate from '~/components/Template/voucher-template';

export default function DiscountCodes({ data }: any) {
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
          {data?.length > 0 &&
            data.map((promo: any) => (
              <GridCol span={{ base: 12, sm: 6, md: 6 }} key={promo.id}>
                <VoucherTemplate voucher={promo} />
              </GridCol>
            ))}
        </Grid>
      </Spoiler>
    </Paper>
  );
}
