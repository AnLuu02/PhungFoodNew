'use client';

import { Box, Flex, Group, Pagination, Select, Text } from '@mantine/core';
import { memo } from 'react';

const PaginationLocal = ({
  page,
  perPage,
  totalPages,
  dataSelectPerpage,
  onSetPerpage,
  onChangePage
}: {
  page: number;
  perPage: number;
  totalPages: number;
  dataSelectPerpage?: number[];
  onSetPerpage: (value: number) => void;
  onChangePage: (value: number) => void;
}) => {
  return (
    <Flex
      mt='md'
      p={{ base: 'sm', sm: 'md' }}
      justify='space-between'
      align={{ base: 'stretch', sm: 'center' }}
      gap='md'
      direction={{ base: 'column', sm: 'row' }}
      className='rounded-2xl bg-white/80 shadow-sm backdrop-blur dark:bg-dark-card'
    >
      <Group justify='space-between' wrap='nowrap' className='w-full sm:w-auto'>
        <Box>
          <Text size='sm' fw={800} className='font-quicksand'>
            Trang {page}
          </Text>

          <Text size='xs' c='dimmed'>
            Tổng {totalPages} trang
          </Text>
        </Box>

        <Select
          value={String(perPage)}
          onChange={value => {
            if (value) {
              onSetPerpage(Number(value) ?? 6);
              onChangePage(1);
            }
          }}
          data={
            dataSelectPerpage
              ? dataSelectPerpage.map(item => {
                  return { value: item.toString(), label: `${item} / trang` };
                })
              : [
                  { value: '6', label: '6 / trang' },
                  { value: '12', label: '12 / trang' },
                  { value: '18', label: '18 / trang' },
                  { value: '24', label: '24 / trang' }
                ]
          }
          w={110}
          radius='xl'
          size='xs'
          allowDeselect={false}
          classNames={{
            input: 'border-slate-200 bg-slate-50 font-semibold dark:border-white/10 dark:bg-white/5'
          }}
        />
      </Group>

      <Pagination
        total={totalPages}
        value={page}
        onChange={onChangePage}
        siblings={0}
        boundaries={1}
        size='sm'
        radius='xl'
        classNames={{
          root: 'flex justify-center sm:justify-end',
          control:
            'border-slate-200 bg-white text-slate-700 transition-all hover:border-mainColor hover:bg-mainColor/10 hover:text-mainColor data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white data-[active=true]:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-dark-text'
        }}
      />
    </Flex>
  );
};

export default memo(PaginationLocal);
