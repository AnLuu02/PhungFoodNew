'use client';
import { Button, Checkbox, Group, Highlight, Menu, Table, Text } from '@mantine/core';
import { VoucherType } from '@prisma/client';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import PageSizeSelector from '~/app/_components/Admin/Perpage';
import LoadingComponent from '~/app/_components/Loading';
import CustomPagination from '~/app/_components/Pagination';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
import { api } from '~/trpc/react';
import { DeleteVoucherButton, UpdateVoucherButton } from '../Button';

export default function TableVoucher({
  currentPage,
  query,
  limit,
  user
}: {
  currentPage: string;
  query: string;
  limit: string;
  user?: any;
}) {
  const { data: result, isLoading } = api.Voucher.find.useQuery({ skip: +currentPage, take: +limit, query });
  const currentItems = result?.vouchers || [];
  const columns: ColumnDef<any>[] = [
    {
      header: 'Tên',
      accessorKey: 'name'
    },

    {
      header: 'Mô tả',
      accessorKey: 'description',
      cell: info => <Highlight highlight={query}>{info.row.original.description || 'Đang cập nhật.'}</Highlight>
    },
    {
      header: 'Hình thức',
      accessorKey: 'type',
      cell: info => <Text>{info.row.original.type === VoucherType.FIXED ? 'Tiền mặt' : '% đơn hàng'}</Text>
    },
    {
      header: 'Giá trị giảm',
      accessorKey: 'discountValue',
      cell: info => (
        <Text>
          {info.row.original.type === VoucherType.FIXED
            ? formatPriceLocaleVi(String(info.getValue()))
            : String(info.getValue()) + '%'}
        </Text>
      )
    },
    {
      header: 'Giá trị giảm tối đa',
      accessorKey: 'maxDiscount',
      cell: info => <Text>{formatPriceLocaleVi(String(info.getValue()))} </Text>
    },
    {
      header: 'Giá trị đơn tối thiểu',
      accessorKey: 'minOrderPrice',
      cell: info => <Text>{formatPriceLocaleVi(String(info.getValue()))} </Text>
    },
    {
      header: 'Số lượng',
      accessorKey: 'quantity'
    },
    {
      header: 'Đã dùng',
      accessorKey: 'usedQuantity'
    },
    {
      header: 'Còn lại',
      accessorKey: 'availableQuantity'
    },
    {
      header: 'Cấp độ VIP',
      accessorKey: 'vipLevel',
      cell: info => <Text>{String(info.getValue() ?? 'Không yêu cầu')}</Text>
    },
    {
      header: 'Mã đơn hàng',
      accessorKey: 'orderId',
      cell: info => <Text>{String(info.getValue() ?? 'Không có')}</Text>
    },
    {
      header: 'Bắt đầu',
      accessorKey: 'startDate',
      cell: info => <Text>{new Date(info.getValue() as string).toLocaleDateString()}</Text>
    },
    {
      header: 'Kết thúc',
      accessorKey: 'endDate',
      cell: info => <Text>{new Date(info.getValue() as string).toLocaleDateString()}</Text>
    },
    {
      header: 'Thao tác',
      cell: info => (
        <Group className='text-center'>
          {user?.user && (
            <>
              <UpdateVoucherButton id={info.row.original.id} />
              {(user.user.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN || user.user.role?.name === 'ADMIN') && (
                <DeleteVoucherButton id={info.row.original.id} />
              )}
            </>
          )}
        </Group>
      )
    }
  ];

  const [columnVisibility, setColumnVisibility] = useState({});
  const table = useReactTable({
    data: currentItems,
    columns,
    state: {
      columnVisibility
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel()
  });
  return isLoading ? (
    <LoadingComponent />
  ) : (
    <>
      <Group pb={'lg'}>
        <Menu shadow='md' width={220}>
          <Menu.Target>
            <Button variant='outline'>Tùy chỉnh bảng</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={table.getToggleAllColumnsVisibilityHandler()}>
              <Checkbox
                label='Tất cả'
                checked={table.getIsAllColumnsVisible()}
                onChange={table.getToggleAllColumnsVisibilityHandler()}
              />
            </Menu.Item>
            {table.getAllLeafColumns().map(column => (
              <Menu.Item key={column.id} onClick={column.getToggleVisibilityHandler()}>
                <Checkbox
                  label={column.id}
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
          {table.getHeaderGroups().map((headerGroup, index) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Table.Th key={header.id} colSpan={header.colSpan}>
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
                <Text size='md' color='dimmed'>
                  Không có bản ghi phù hợp./
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
      <Group justify='space-between' mt='md'>
        <PageSizeSelector />
        <CustomPagination totalPages={result?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
