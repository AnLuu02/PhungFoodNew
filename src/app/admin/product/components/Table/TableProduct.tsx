'use client';

import { Avatar, Badge, Box, Group, Highlight, Spoiler, Table, Text, Tooltip } from '@mantine/core';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { UserRole } from '~/constants';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { LocalImageType } from '~/lib/ZodSchema/enum';
import { DeleteProductButton, UpdateProductButton } from '../Button';

import { ActionIcon, Card, Flex, Paper, Select, SimpleGrid, Title } from '@mantine/core';
import { IconCheese, IconCircleCheck, IconGardenCartOff, IconTruckDelivery } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { SearchInput } from '~/components/Search/SearchInput';
import { api } from '~/trpc/react';

export default function TableProduct({ s, data, allData }: { s: string; data: any; allData: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { data: categories, isLoading } = api.Category.getAll.useQuery();
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const { data: dataClient } = api.Product.find.useQuery(
    { skip: +page, take: +limit, s, userRole: UserRole.ADMIN, filter: searchParams?.get('filter') + '@#@$@@' },
    { initialData: data }
  );
  const { data: allDataClient } = api.Product.getAll.useQuery({ userRole: UserRole.ADMIN }, { initialData: allData });
  const currentItems = dataClient?.products || [];
  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];
    const summary = allDataClient.reduce(
      (acc: any, item: any) => {
        acc.total += 1;
        acc.purchased += item.soldQuantity || 0;
        if (item.isActive) {
          acc.active += 1;
        } else {
          acc.inactive += 1;
        }
        return acc;
      },
      { total: 0, active: 0, inactive: 0, purchased: 0 }
    );

    return [
      {
        label: 'Tổng số sản phẩm',
        value: summary.total,
        icon: IconCheese,
        color: '#446DAE'
      },
      {
        label: 'Khả dụng',
        value: summary.active,
        icon: IconCircleCheck,
        color: '#499764'
      },
      {
        label: 'Tạm ẩn',
        value: summary.inactive,
        icon: IconGardenCartOff,
        color: '#C0A453'
      },
      {
        label: 'Đã bán',
        value: summary.purchased,
        icon: IconTruckDelivery,
        color: '#CA041D'
      }
    ];
  }, [allDataClient]);

  return (
    <>
      <SimpleGrid cols={4}>
        {dataFilter?.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card
              style={{ backgroundColor: item.color + 10 }}
              shadow='md'
              radius={'lg'}
              pos={'relative'}
              key={index}
              p={'md'}
            >
              <Flex align={'center'} gap={'md'}>
                <ActionIcon variant='light' size={'xl'} radius={'md'} color={item.color}>
                  <IconR size={20} />
                </ActionIcon>
                <Box>
                  <Title order={6} className='font-quicksand'>
                    {item.label}
                  </Title>
                  <Title order={3} className='font-quicksand'>
                    {item.value}
                  </Title>
                </Box>
              </Flex>
            </Card>
          );
        })}
      </SimpleGrid>
      <Paper radius={'lg'} withBorder shadow='md' p={'md'}>
        <Group justify='space-between'>
          <SearchInput width={500} />
          <Group>
            <Select
              allowDeselect={false}
              value={searchParams.get('filter') || 'all'}
              radius='md'
              onChange={value => {
                if (value === 'all') params.delete('filter');
                else {
                  params.set('filter', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url);
              }}
              data={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'ACTIVE', label: 'Hoạt động' },
                { value: 'INACTIVE', label: 'Không hoạt động' }
              ]}
            />
            <Select
              allowDeselect={false}
              radius='md'
              value={searchParams.get('s') || 'all'}
              disabled={isLoading}
              onChange={value => {
                if (value === 'all') params.delete('s');
                else {
                  params.set('s', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url);
              }}
              data={[
                { value: 'all', label: 'Tất cả danh mục' },
                ...(categories || []).map((item: any) => ({ value: item.tag, label: item.name }))
              ]}
              nothingFoundMessage='Không tìm thấy'
            />
          </Group>
        </Group>
      </Paper>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={100}>Tên</Table.Th>
              <Table.Th w={100}>Ảnh</Table.Th>
              <Table.Th w={100}>Giá tiền</Table.Th>
              <Table.Th w={400}>Mô tả</Table.Th>
              <Table.Th>Danh mục</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item: any) => (
                <Table.Tr key={item.id}>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {item.name}
                    </Highlight>
                  </Table.Td>

                  <Table.Td className='text-sm'>
                    <Avatar
                      src={item.images?.find((img: any) => img.type === LocalImageType.THUMBNAIL)?.url}
                      alt={item.name}
                      size={40}
                      radius='md'
                    />
                  </Table.Td>

                  <Table.Td className='text-sm'>{formatPriceLocaleVi(item.price)}</Table.Td>

                  <Table.Td className='text-sm'>
                    <Spoiler
                      maxHeight={60}
                      showLabel='Xem thêm'
                      hideLabel='Ẩn'
                      classNames={{
                        control: 'text-sm font-bold text-mainColor'
                      }}
                    >
                      <Highlight size='sm' highlight={s}>
                        {item.description || 'Đang cập nhật.'}
                      </Highlight>
                    </Spoiler>
                  </Table.Td>

                  <Table.Td className='text-sm'>
                    <Tooltip label={item.subCategory?.name}>
                      <Badge color='green'>{item.subCategory?.name}</Badge>
                    </Tooltip>
                  </Table.Td>

                  <Table.Td className='text-sm'>
                    <Tooltip label={item.isActive ? 'Hoạt động' : 'Tạm ẩn'}>
                      <Badge color={item.isActive ? '' : 'red'}>{item.isActive ? 'Hoạt động' : 'Tạm ẩn'}</Badge>
                    </Tooltip>
                  </Table.Td>

                  <Table.Td className='text-sm'> {formatDateViVN(item.createdAt)} </Table.Td>

                  <Table.Td className='text-sm'>
                    <Group>
                      <UpdateProductButton id={item.id} />
                      <DeleteProductButton id={item.id} />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8} className='bg-gray-100 text-center dark:bg-dark-card'>
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
