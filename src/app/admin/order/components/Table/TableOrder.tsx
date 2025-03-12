'use client';
import { Badge, Button, Checkbox, Group, Highlight, Menu, Table, Text } from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import PageSizeSelector from '~/app/_components/Admin/Perpage';
import LoadingComponent from '~/app/_components/Loading';
import CustomPagination from '~/app/_components/Pagination';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
import { api } from '~/trpc/react';
import {
  CancleOrderButton,
  DeleteOrderButton,
  SendOrderButton,
  SuccessOrderButton,
  UpdateOrderButton
} from '../Button';

export default function TableOrder({
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
  const { data: result, isLoading } = api.Order.find.useQuery({ skip: +currentPage, take: +limit, query });
  const currentItems = result?.orders || [];

  const columns: ColumnDef<any>[] = [
    {
      header: 'Mã hóa đơn',
      accessorKey: 'id',
      cell: info => <Highlight highlight={query}>{info.row.original.id}</Highlight>
    },
    {
      header: 'Khách hàng',
      accessorKey: 'user.name',
      cell: info => <Highlight highlight={query}>{info.row.original.user?.name}</Highlight>
    },
    {
      header: 'Thanh toán',
      accessorKey: 'payment.name',
      cell: info => <Highlight highlight={query}>{info.row.original.payment?.name}</Highlight>
    },
    {
      header: 'Tổng hóa đơn',
      accessorKey: 'total',
      cell: info => {
        const price = info.row.original.total;
        return formatPriceLocaleVi(price);
      }
    },
    {
      header: 'Ngày tạo',
      accessorKey: 'createdAt',
      cell: info => new Date(info.getValue() as string).toLocaleDateString()
    },
    {
      header: 'Trạng thái',
      cell: info => (
        <Group className='text-center'>
          <Badge
            color={
              info.row.original.status === OrderStatus.COMPLETED
                ? 'green.9'
                : info.row.original.status === OrderStatus.PENDING
                  ? 'yellow'
                  : info.row.original.status === OrderStatus.CANCELLED
                    ? 'red'
                    : 'gray'
            }
          >
            {info.row.original.status}
          </Badge>
          {info.row.original.status !== OrderStatus.COMPLETED && <SuccessOrderButton id={info.row.original.id} />}
          {info.row.original.status !== OrderStatus.CANCELLED && (
            <CancleOrderButton
              id={info.row.original.id}
              formData={{
                id: info.row.original.id,
                total: info.row.original.total,
                userId: info.row.original.user?.id,
                paymentId: info.row.original.payment.id,
                orderItems: info.row.original.orderItems,
                status: OrderStatus.CANCELLED
              }}
            />
          )}
        </Group>
      )
    },
    {
      header: 'Thao tác',
      cell: info => (
        <Group className='text-center'>
          {user?.user && (
            <>
              <UpdateOrderButton id={info.row.original.id} />
              <SendOrderButton order={info.row.original} />
              {(user.user.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN || user.user.role?.name === 'ADMIN') && (
                <DeleteOrderButton id={info.row.original.id} />
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
