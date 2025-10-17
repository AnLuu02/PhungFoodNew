'use client';
import { Box, Group, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text } from '@mantine/core';
import { SearchInput } from '~/components/Search/SearchInput';
import { formatDateViVN } from '~/lib/func-handler/Format';
import { api } from '~/trpc/react';
import { CopyRevenueButton, CreateRevenueButton, UpdateRevenueButton } from '../Button';

export default function TableRevenue({ revenues }: { revenues: any }) {
  const { data: dataClient } = api.Revenue.getAll.useQuery(undefined, { initialData: revenues });
  const currentItems = dataClient || [];

  return (
    <>
      <Group pb={'lg'}>
        <Group justify='space-between' mt={'md'} w={'100%'}>
          <Text fw={500}>Số lượng bản ghi: {currentItems?.length || 0}</Text>
          <Group>
            <SearchInput />
            <CreateRevenueButton />
          </Group>
        </Group>
      </Group>

      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover>
          <TableThead className='rounded-lg text-sm uppercase leading-normal'>
            <TableTr>
              <TableTh>Mã </TableTh>
              <TableTh>Tổng chi</TableTh>
              <TableTh>Tổng đơn</TableTh>
              <TableTh>Ngày</TableTh>
              <TableTh>Tháng</TableTh>
              <TableTh>Năm</TableTh>
              <TableTh>Tạo ngày</TableTh>
              <TableTh>Thao tác</TableTh>
            </TableTr>
          </TableThead>

          <TableTbody>
            {currentItems.length > 0 ? (
              currentItems.map((revenue: any) => {
                return (
                  <TableTr key={revenue.id}>
                    <TableTd className='text-sm'>{revenue.id}</TableTd>
                    <TableTd className='text-sm'>{revenue.totalSpent || 0}</TableTd>
                    <TableTd className='text-sm'>{revenue.totalOrders || 0}</TableTd>
                    <TableTd className='text-sm'>{revenue?.day}</TableTd>
                    <TableTd className='text-sm'>{revenue?.month} </TableTd>
                    <TableTd className='text-sm'>{revenue?.year} </TableTd>
                    <TableTd className='text-sm'>{formatDateViVN(revenue?.createdAt || new Date())}</TableTd>
                    <TableTd className='text-sm'>
                      <Group className='text-center'>
                        <UpdateRevenueButton id={revenue.id || ''} />
                        <CopyRevenueButton data={revenue} />
                      </Group>
                    </TableTd>
                  </TableTr>
                );
              })
            ) : (
              <TableTr>
                <TableTd colSpan={7} className='bg-gray-100 text-center dark:bg-dark-card'>
                  <Text size='md' c='dimmed'>
                    Không có bản ghi phù hợp.
                  </Text>
                </TableTd>
              </TableTr>
            )}
          </TableTbody>
        </Table>
      </Box>
    </>
  );
}
