'use client';
import { Group, Table, Text } from '@mantine/core';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import clsx from 'clsx';
import SearchQueryParams from '~/components/Search/SearchQueryParams';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';

export default function TableRevenue({ revenues, s }: { revenues: any; s: string }) {
  const currentItems = revenues || [];
  const columns: ColumnDef<any>[] = [
    {
      header: s === 'user' ? 'Người dùng' : s === 'date' ? 'Ngày' : s === 'month' ? 'Tháng' : 'Năm',
      accessorKey: s === 'user' ? 'user.name' : 'createdAt',
      cell: info => {
        if (s === 'user') {
          return info.getValue();
        }
        const date = info.row.original.date;
        const month = info.row.original.month;
        const year = info.row.original.year;
        return s === 'date' ? `${date}/${month}/${year}` : s === 'month' ? `${month}/${year}` : `${year}`;
      }
    },
    {
      header: 'Tổng đơn hàng',
      accessorKey: 'totalOrders'
    },
    {
      header: 'Tổng chi',
      accessorKey: 'totalSpent',
      cell: info => {
        const totalSpent = info.row.original.totalSpent;
        return formatPriceLocaleVi(totalSpent);
      }
    }
  ];

  const table = useReactTable({
    data: currentItems,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <>
      <Group pb={'lg'}>
        <Group justify='space-between' mt={'md'} w={'100%'}>
          <Text fw={500}>Số lượng bản ghi: {currentItems?.length || 0}</Text>
          <Group>
            <SearchQueryParams />
          </Group>
        </Group>
      </Group>
      <div className={clsx('w-full overflow-x-auto', 'tableAdmin')}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            {table.getHeaderGroups().map((headerGroup, index) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Table.Th key={header.id} colSpan={header.colSpan} style={{ minWidth: 100 }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              table.getRowModel().rows.map((row, index) => (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <Table.Td key={cell.id}>
                      <Text size='sm'>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Text>
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={columns.length} className='bg-gray-100 text-center'>
                  <Text size='md' c='dimmed'>
                    Không có bản ghi phù hợp./
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
    </>
  );
}
