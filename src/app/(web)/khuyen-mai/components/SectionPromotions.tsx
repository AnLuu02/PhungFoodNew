'use client';
import { Box, Stack } from '@mantine/core';
import { useCallback, useState } from 'react';
import { SectionHeading } from '~/components/SectionHeading';
import LayoutPromotion from '~/components/Web/Home/Section/Layout-Promotion';
import { toNumber } from '~/lib/FuncHandler/Format';
import { api } from '~/trpc/react';

export const SectionPromotions = ({ initialData }: { initialData: any }) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const { data, isLoading } = api.Product.find.useQuery(
    {
      page: page,
      limit: perPage,
      loai: 'san-pham-giam-gia'
    },
    {
      initialData: page === 1 ? initialData : undefined,
      staleTime: 0,
      placeholderData: previousData => previousData
    }
  );
  const productData = data?.products ?? [];
  const totalPages = data?.pagination?.totalPages ?? 0;
  const onChangePage = useCallback((value: number) => {
    setPage(value);
  }, []);
  const onSetPerpage = useCallback((value: string) => {
    setPerPage(toNumber(value) ?? 4);
  }, []);
  return (
    <>
      <Stack gap={'xl'}>
        <SectionHeading
          center
          index='01'
          title=' Khuyến Mãi Khó Cưỡng'
          description=' Nhanh tay săn ngay những ưu đãi hấp dẫn này trước khi biến mất! Số lượng có hạn.'
        />

        {productData?.length > 0 && (
          <Box className='mb-16'>
            <LayoutPromotion
              data={productData}
              withPagination={{
                totalPages,
                onChangePage,
                onSetPerpage,
                page,
                perPage,
                loading: isLoading
              }}
            />
          </Box>
        )}
      </Stack>
    </>
  );
};
