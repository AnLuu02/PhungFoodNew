'use client';
import { Group, Table, Text } from '@mantine/core';
import clsx from 'clsx';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { DeletePermissionButton, UpdatePermissionButton } from '../Button';

export default function TablePermission({ s, data, user }: { s: string; data: any; user?: any }) {
  const currentItems = data?.permissions || [];

  // const columns: ColumnDef<any>[] = [
  //   {
  //     header: 'ID',
  //     accessorKey: 'id',
  //     cell: info => <Highlight highlight={s}>{info.row.original.id}</Highlight>
  //   },
  //   {
  //     header: 'Tên quyền',
  //     accessorKey: 'name',
  //     cell: info => <Highlight highlight={s}>{info.row.original.name}</Highlight>
  //   },
  //   {
  //     header: 'Mô tả',
  //     accessorKey: 'description',
  //     cell: info => <Highlight highlight={s}>{info.row.original.description}</Highlight>
  //   },

  //   {
  //     header: 'Thao tác',
  //     cell: info => (
  //       <Group className='text-center'>
  //         {user?.user && user.user.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN && (
  //           <>
  //             <UpdatePermissionButton id={info.row.original.id} />
  //             <DeletePermissionButton id={info.row.original.id} />
  //           </>
  //         )}
  //       </Group>
  //     )
  //   }
  // ];

  // const [columnVisibility, setColumnVisibility] = useState({});
  // const table = useReactTable({
  //   data: currentItems,
  //   columns,
  //   state: {
  //     columnVisibility
  //   },
  //   onColumnVisibilityChange: setColumnVisibility,
  //   getCoreRowModel: getCoreRowModel()
  // });

  return (
    <>
      <div className={clsx('w-full overflow-x-auto', 'tableAdmin')}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th style={{ minWidth: 100 }}>ID</Table.Th>
              <Table.Th style={{ minWidth: 100 }}>Quyền</Table.Th>
              <Table.Th style={{ minWidth: 100 }}>Mô tả</Table.Th>
              <Table.Th style={{ minWidth: 100 }}>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td>{row.id}</Table.Td>
                  <Table.Td>{row.name}</Table.Td>
                  <Table.Td>{row.description || 'Không có mô tả'}</Table.Td>
                  <Table.Td>
                    <Group className='text-center'>
                      {user?.user && user.user.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN && (
                        <>
                          <UpdatePermissionButton id={row.id} />
                          <DeletePermissionButton id={row.id} />
                        </>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4} className='bg-gray-100 text-center'>
                  <Text size='md' c='dimmed'>
                    Không có bản ghi phù hợp.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
      <Group justify='space-between' mt='md'>
        <PageSizeSelector />
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
