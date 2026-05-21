'use client';
import { Badge, Box, Flex, Group, Highlight, Table, Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import CustomPagination from '~/components/Pagination';
import PageSizeSelector from '~/components/Perpage';
import { FindPermission } from '~/shared/type-trpc/role-permission.type-trpc';
import { api } from '~/trpc/react';
import { DeletePermissionButton, UpdatePermissionButton } from '../Button';

export default function TablePermission() {
  const searchParams = useSearchParams();

  const s = searchParams.get('s') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') ?? '5';

  const { data, isLoading } = api.RolePermission.findPermission.useQuery({ page: +page, limit: +limit, s });

  const currentItems = data?.permissions || [];

  const utils = api.useUtils();
  useEffect(() => {
    if (data?.pagination.hasNext) {
      void utils.RolePermission.findPermission.prefetch({ page: +page + 1, limit: +limit, s });
    }
  }, [page]);

  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                ID
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Quyền
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Chức năng
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Mô tả
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Thuộc
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Thao tác
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <CommonSkeleton.Table count={5} />
                </Table.Td>
              </Table.Tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((row: FindPermission['permissions'][number], index: number) => (
                <Table.Tr key={index}>
                  <Table.Td className='text-sm'>{row.id}</Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight className='text-sm' highlight={s}>
                      {row.name}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight className='text-sm' highlight={s}>
                      {row?.viName || 'Đang cập nhật.'}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight className='text-sm' highlight={s}>
                      {row.description || 'Đang cập nhật.'}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Flex align={'center'} gap={5}>
                      {row?.roles?.map((item: FindPermission['permissions'][number]['roles'][number]) => {
                        return (
                          <Badge bg={item.name === 'ADMIN' ? 'red' : item.name === 'CUSTOMER' ? 'green' : '#195EFE'}>
                            {item.viName}
                          </Badge>
                        );
                      })}
                    </Flex>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Group className='text-center'>
                      <>
                        <UpdatePermissionButton id={row.id} />
                        <DeletePermissionButton id={row.id} />
                      </>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4} className='bg-gray-100 text-center dark:bg-dark-card'>
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
