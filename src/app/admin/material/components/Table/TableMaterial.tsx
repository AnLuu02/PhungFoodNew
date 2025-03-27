'use client';
import { Button, Checkbox, Group, Highlight, Menu, Table, Text } from '@mantine/core';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import clsx from 'clsx';
import { useState } from 'react';
import PageSizeSelector from '~/app/_components/Admin/Perpage';
import CustomPagination from '~/app/_components/Pagination';
import { DeleteMaterialButton, UpdateMaterialButton } from '../Button';

export default function TableMaterial({ s, data, user }: { s: string; data: any; user?: any }) {
  const currentItems = data?.materials || [];
  const columns: ColumnDef<any>[] = [
    {
      header: 'Tên',
      accessorKey: 'name',
      cell: info => <Highlight highlight={s}>{info.row.original.name}</Highlight>
    },
    {
      header: 'Mô tả',
      accessorKey: 'description',
      cell: info => <Highlight highlight={s}>{info.row.original.description || 'Đang cập nhật.'}</Highlight>
    },
    {
      header: 'Ngày tạo',
      accessorKey: 'createdAt',
      cell: info => new Date(info.getValue() as string).toLocaleDateString()
    },
    {
      header: 'Thao tác',
      cell: info => (
        <Group className='text-center'>
          {user?.user && (
            <>
              <UpdateMaterialButton id={info.row.original.id} />
              {(user.user.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN || user.user.role?.name === 'ADMIN') && (
                <DeleteMaterialButton id={info.row.original.id} />
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
                  <Text size='md' color='dimmed'>
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
