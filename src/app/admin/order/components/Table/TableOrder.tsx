'use client';
import { Badge, Button, Checkbox, Flex, Group, Highlight, Menu, Table, Text } from '@mantine/core';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import clsx from 'clsx';
import { useState } from 'react';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';
import { getStatusColor, getStatusIcon, getStatusText } from '~/lib/func-handler/get-status-order';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
import {
  CancleOrderButton,
  DeleteOrderButton,
  DeliveryOrderButton,
  SendMessageOrderButton,
  SendOrderButton,
  SuccessOrderButton,
  UpdateOrderButton
} from '../Button';

export default function TableOrder({ s, data, user }: { data: any; s: string; user?: any }) {
  const currentItems = data?.orders || [];

  const columns: ColumnDef<any>[] = [
    {
      header: 'Mã hóa đơn',
      accessorKey: 'id',
      cell: info => <Highlight highlight={s}>{info.row.original.id}</Highlight>
    },
    {
      header: 'Khách hàng',
      accessorKey: 'user.name',
      cell: info => <Highlight highlight={s}>{info.row.original.user?.name}</Highlight>
    },
    {
      header: 'Thanh toán',
      accessorKey: 'payment.name',
      cell: info => <Highlight highlight={s}>{info.row.original.payment?.name}</Highlight>
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
            size='xs'
            color={getStatusColor(info.row.original.status)}
            p={'xs'}
            className='align-items-center flex'
          >
            <Flex align={'center'}>
              <Text size='10px' fw={700}>
                {getStatusText(info.row.original.status)}
              </Text>
              {getStatusIcon(info.row.original.status)}
            </Flex>
          </Badge>
        </Group>
      )
    },
    {
      header: 'Thao tác',
      cell: info => (
        <Group className='text-center'>
          {user?.user && (
            <>
              <Group>
                {info.row.original.status === LocalOrderStatus.DELIVERED && (
                  <SuccessOrderButton id={info.row.original.id} />
                )}
                {info.row.original.status === LocalOrderStatus.PENDING && (
                  <DeliveryOrderButton id={info.row.original.id} />
                )}
                {info.row.original.status !== LocalOrderStatus.CANCELLED && (
                  <CancleOrderButton id={info.row.original.id} />
                )}
                <UpdateOrderButton id={info.row.original.id} />

                {(user.user.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN ||
                  user.user.role?.name === 'ADMIN') && <DeleteOrderButton id={info.row.original.id} />}
              </Group>
              <Group>
                <SendOrderButton order={info.row.original} />
                {info.row.original.status !== LocalOrderStatus.COMPLETED && (
                  <SendMessageOrderButton userId={info.row.original.user?.id} email={info.row.original.user?.email} />
                )}
              </Group>
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

  return (
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
      <Group justify='space-between' mt='md'>
        <PageSizeSelector />
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
