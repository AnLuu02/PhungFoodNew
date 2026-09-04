'use client';
import { Paper, Stack } from '@mantine/core';
import { SectionHeading } from '~/components/SectionHeading';
import { PromotionSection } from '~/components/Web/Home/Section/PromotionSection';
import { FindProduct } from '~/shared/type-trpc/product.type-trpc';

export const SectionPromotions = ({ initialData }: { initialData: FindProduct }) => {
  return (
    <>
      <Stack gap={'xl'}>
        <SectionHeading
          center
          index='01'
          title=' Khuyến Mãi Khó Cưỡng'
          description=' Nhanh tay săn ngay những ưu đãi hấp dẫn này trước khi biến mất! Số lượng có hạn.'
        />

        <Paper radius={'xl'} withBorder className='mb-16 overflow-hidden border-2 border-dashed border-mainColor'>
          <PromotionSection />
        </Paper>
      </Stack>
    </>
  );
};
