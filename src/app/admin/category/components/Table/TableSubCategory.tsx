'use client';

import { Avatar, Badge, Box, Group, Highlight, Table, Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import CustomPagination from '~/components/Pagination';
import PageSizeSelector from '~/components/Perpage';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { FindSubCategory } from '~/shared/type-trpc/subCategory.type-trpc';
import { api } from '~/trpc/react';
import { DeleteSubCategoryButton, UpdateSubCategoryButton } from '../Button';

export default function TableSubCategory() {
  const searchParams = useSearchParams();
  const s = searchParams.get('s') || '';
  const status = (searchParams?.get('status') as 'active' | 'inactive') ?? undefined;
  const category = searchParams?.get('category') ?? undefined;
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const { data, isLoading } = api.SubCategory.find.useQuery({
    page: +page,
    limit: +limit,
    filters: { s, status, category }
  });
  const currentItems = data?.subCategories || [];

  const utils = api.useUtils();
  useEffect(() => {
    if (data?.pagination.hasNext) {
      void utils.SubCategory.find.prefetch({ page: +page + 1, limit: +limit, filters: { s, status, category } });
    }
  }, [page]);

  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Tên</Table.Th>
              <Table.Th>Ảnh</Table.Th>
              <Table.Th>Thuộc loại</Table.Th>
              <Table.Th>Mô tả</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <CommonSkeleton.Table count={5} />
                </Table.Td>
              </Table.Tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item: FindSubCategory['subCategories'][number], index: number) => (
                <Table.Tr key={item.id + index}>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {item.name}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Avatar
                      src={item.imageForEntity?.image?.url}
                      alt={item?.imageForEntity?.altText || 'Đang cập nhật ảnh danh mục'}
                      size={40}
                    />
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {item.category?.name}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {item.description || 'Đang cập nhật.'}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Badge p='sm' color={item.isActive ? '#195EFE' : 'red'}>
                      {item.isActive ? 'Hoạt động' : 'Bị cấm'}
                    </Badge>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'> {formatDateViVN(item.createdAt)} </Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Group>
                      <UpdateSubCategoryButton id={item.id} />
                      <DeleteSubCategoryButton id={item.id} />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7} className='bg-gray-100 text-center dark:bg-dark-card'>
                  <Text size='md' c='dimmed'>
                    Không có bản ghi phù hợp.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Group justify='space-between' align='center' my={'md'}>
        <PageSizeSelector />
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
