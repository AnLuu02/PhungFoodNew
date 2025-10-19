'use client';
import { Flex, Pagination, Select } from '@mantine/core';
import { memo, useMemo, useState } from 'react';
function PaginationLocal({
  data,
  onChangePage,
  onChangePerPage
}: {
  data: any[];
  onChangePage: (page: number) => void;
  onChangePerPage: (perPage: number) => void;
}) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / perPage);
  }, [data, perPage]);

  return (
    <Flex justify='flex-end' align='center' gap='md' direction={{ base: 'column-reverse', md: 'row' }}>
      <Pagination
        classNames={{
          control:
            'hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white'
        }}
        total={totalPages}
        value={page}
        onChange={newPage => {
          setPage(newPage);
          onChangePage(newPage);
        }}
      />
      <Select
        radius='md'
        value={String(perPage)}
        w={100}
        onChange={value => {
          setPerPage(Number(value));
          setPage(1);
          onChangePage(1);
          onChangePerPage(Number(value));
        }}
        data={['1', '5', '10', '15', '20']}
      />
    </Flex>
  );
}

export default memo(PaginationLocal);
