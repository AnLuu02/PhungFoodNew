'use client';
import { Button, Checkbox, Group, Highlight, Menu, Table, Text } from '@mantine/core';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import PageSizeSelector from '~/app/_components/Admin/Perpage';
import LoadingComponent from '~/app/_components/Loading';
import CustomPagination from '~/app/_components/Pagination';
import { api } from '~/trpc/react';
import { DeleteCategoryButton, UpdateCategoryButton } from '../Button';

export default function TableCategory({
  currentPage,
  query,
  limit
}: {
  currentPage: string;
  query: string;
  limit: string;
}) {
  const { data: result, isLoading } = api.Category.find.useQuery({ skip: +currentPage, take: +limit, query });
  const currentItems = result?.categories || [];
  const columns: ColumnDef<any>[] = [
    {
      header: 'Tên',
      accessorKey: 'name',
      cell: info => <Highlight highlight={query}>{info.row.original.name}</Highlight>
    },
    {
      header: 'Mô tả',
      accessorKey: 'description',
      cell: info => <Highlight highlight={query}>{info.row.original.description}</Highlight>
    },
    {
      header: 'Ngày tạo',
      accessorKey: 'updatedAt',
      cell: info => new Date(info.getValue() as string).toLocaleDateString()
    },
    {
      header: 'Actions',
      cell: info => (
        <Group className='text-center'>
          <UpdateCategoryButton id={info.row.original.id} />
          <DeleteCategoryButton id={info.row.original.id} />
          {/* <CustomButton
            label=''
            icon={<IconEdit size={24} />}
            Component={UpdateCategory}
            componentProps={{
              categoryId: info.row.original.id
            }}
          />
          <CustomButton
            label=''
            icon={<IconTrash size={24} />}
            isModalConfirm={true}
            Component={DeleteCategory}
            componentProps={{
              categoryId: info.row.original.id
            }}
          /> */}
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
