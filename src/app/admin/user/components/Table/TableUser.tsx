'use client';
import { Badge, Button, Checkbox, Group, Highlight, Menu, Table, Text } from '@mantine/core';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import PageSizeSelector from '~/app/_components/Admin/Perpage';
import CustomPagination from '~/app/_components/Pagination';
import { UserRole } from '~/app/lib/utils/constants/roles';
import { DeleteUserButton, UpdateUserButton } from '../Button';

export default function TableUser({
  currentPage,
  query,
  limit,
  data,
  user
}: {
  currentPage: string;
  query: string;
  limit: string;
  data: any;
  user?: any;
}) {
  const currentItems = data?.users || [];
  const columns: ColumnDef<any>[] = [
    {
      header: 'Tên',
      accessorKey: 'name',
      cell: info => <Highlight highlight={query}>{info.row.original.name}</Highlight>
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: info => <Highlight highlight={query}>{info.row.original.email}</Highlight>
    },
    {
      header: 'Vai trò',
      accessorKey: 'role',
      cell: info => (
        <Badge
          p={'sm'}
          radius={'md'}
          color={
            info.cell.row.original.role?.name !== 'ADMIN' || info.cell.row.original.role?.name !== 'Super Admin'
              ? 'green'
              : 'red'
          }
        >
          {info.cell.row.original.role?.name || 'Super Admin'}
        </Badge>
      )
    },
    {
      header: 'Điện thoại',
      accessorKey: 'phone',
      cell: info => <Highlight highlight={query}>{info.row.original.phone}</Highlight>
    },
    {
      header: 'Địa chỉ',
      accessorKey: 'address.fullAddress',
      cell: info => <Highlight highlight={query}>{info.row.original?.address?.fullAddress}</Highlight>
    },
    {
      header: 'Ngày tạo',
      accessorKey: 'createdAt',
      cell: info => new Date(info.getValue() as string).toLocaleDateString()
    },
    {
      header: 'Điểm',
      accessorKey: 'pointLevel'
    },
    {
      header: 'Cấp điểm',
      accessorKey: 'level'
    },
    {
      header: 'Thao tác',
      cell: info => (
        <Group className='text-center'>
          {user?.user &&
            (user.user.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN || user.user.role === 'ADMIN' ? (
              <>
                <UpdateUserButton email={info.row.original.email} />
                {info.row.original.email !== process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN && (
                  <DeleteUserButton id={info.row.original.id} />
                )}
              </>
            ) : user.user.role === UserRole.STAFF && user.user.email === info.row.original.email ? (
              <UpdateUserButton email={info.row.original.email} />
            ) : null)}
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
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
