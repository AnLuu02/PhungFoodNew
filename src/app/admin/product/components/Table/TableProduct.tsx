'use client';
import { Avatar, Badge, Button, Checkbox, Group, Highlight, Menu, Spoiler, Table, Text, Tooltip } from '@mantine/core';
import { ImageType } from '@prisma/client';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import PageSizeSelector from '~/app/_components/Admin/Perpage';
import LoadingComponent from '~/app/_components/Loading';
import CustomPagination from '~/app/_components/Pagination';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
import { api } from '~/trpc/react';
import { DeleteProductButton, UpdateProductButton } from '../Button';

export default function TableProduct({
  currentPage,
  query,
  limit
}: {
  currentPage: string;
  query: string;
  limit: string;
}) {
  const { data: result, isLoading } = api.Product.find.useQuery({ skip: +currentPage, take: +limit, query });
  const currentItems = result?.products || [];
  const columns: ColumnDef<any>[] = [
    {
      header: 'Tên',
      accessorKey: 'name',
      cell: info => <Highlight highlight={query}>{info.row.original.name}</Highlight>
    },
    {
      header: 'Ảnh',
      accessorKey: 'images',
      cell: info => {
        const thumbnail = info.row.original.images?.find((img: any) => img.type === ImageType.THUMBNAIL)?.url as string;
        return <Avatar src={thumbnail} alt={info.row.original.name} size={40} radius={'md'} />;
      }
    },
    {
      header: 'Giá tiền',
      accessorKey: 'price',
      cell: info => {
        const price = info.row.original.price;
        return formatPriceLocaleVi(price);
      }
    },

    {
      header: 'Mô tả',
      accessorKey: 'description',
      size: 400,
      cell: info => (
        <Spoiler maxHeight={60} showLabel='Xem thêm' hideLabel='Ẩn'>
          <Highlight highlight={query} size='sm'>
            {info.row.original.description ||
              `Có ai đó đã từng nói rằng: “Lý tưởng là những ước mơ cao thượng nhất của con người, rất khó thực hiện nhưng lại có thể thực hiện được và đòi hỏi phải phấn đấu lâu dài, gian khổ, kiên trì…”. Quả thật, trong cuộc sống của chúng ta, lí tưởng cao đẹp có một vai trò vô cùng quan trọng.
        `}
          </Highlight>
        </Spoiler>
      )
    },
    {
      header: 'Danh mục',
      accessorKey: 'subCategory.name',
      cell: info => (
        <Tooltip label={info.row.original.subCategory.name}>
          <Badge color={'green'}>{info.cell.row.original.subCategory?.name}</Badge>
        </Tooltip>
      )
    },
    {
      header: 'Ngày tạo',
      accessorKey: 'createdAt',
      cell: info => new Date(info.getValue() as string).toLocaleDateString()
    },
    {
      header: 'Actions',
      cell: info => (
        <Group className='text-center'>
          <UpdateProductButton id={info.row.original.id} />
          <DeleteProductButton id={info.row.original.id} />
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
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange'
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
                  <Table.Td key={cell.id} style={{ width: cell.column.getSize() }}>
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
