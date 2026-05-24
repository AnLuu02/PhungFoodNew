'use client';

import { Avatar, Badge, Box, Group, Highlight, Spoiler, Text, Tooltip } from '@mantine/core';
import CustomPagination from '~/components/Pagination';
import PageSizeSelector from '~/components/Perpage';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { DeleteProductButton, UpdateProductButton } from '../Button';

import { ActionIcon, Card, Divider, Flex, Paper, Select, SimpleGrid, Stack, Title } from '@mantine/core';
import { ImageType } from '@prisma/client';
import { IconCheese, IconCircleCheck, IconGardenCartOff, IconTruckDelivery } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { SearchInput } from '~/components/Search/SearchInput';
import { CardSkeleton } from '~/components/Web/Card/CardSkeleton';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { randomColorHex } from '~/lib/FuncHandler/RandomColorHex';
import { UserRole } from '~/shared/constants/user.constants';
import { GetAllCategory } from '~/shared/type-trpc/category.type-trpc';
import { FindProduct, GetAllProduct } from '~/shared/type-trpc/product.type-trpc';
import { api } from '~/trpc/react';

export default function TableProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const s = searchParams.get('s') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const filter = searchParams?.get('filter');

  const { data: categories, isLoading } = api.Category.getAll.useQuery();
  const { data: dataClient, isLoading: isLoadingProduct } = api.Product.find.useQuery({
    page: +page,
    limit: +limit,
    s,
    userRole: UserRole.ADMIN,
    filter: filter ? filter + '@#@$@@' : undefined
  });
  const { data: allDataClient } = api.Product.getAll.useQuery({ userRole: UserRole.ADMIN });
  const currentItems = dataClient?.products || [];
  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];
    const summary = allDataClient.reduce(
      (acc: { total: number; active: number; inactive: number; purchased: number }, item: GetAllProduct[number]) => {
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

  const utils = api.useUtils();
  useEffect(() => {
    if (dataClient?.pagination.hasNext) {
      void utils.Product.find.prefetch({ page: +page + 1, limit: +limit, s });
    }
  }, [page]);

  return (
    <>
      <SimpleGrid cols={4}>
        {dataFilter?.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card style={{ backgroundColor: item.color + 10 }} shadow='md' pos={'relative'} key={index} p={'md'}>
              <Flex align={'center'} gap={'md'}>
                <ActionIcon variant='light' size={'xl'} color={item.color}>
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
      <Paper withBorder shadow='md' p={'md'}>
        <Group justify='space-between'>
          <SearchInput width={500} />
          <Group>
            <Select
              allowDeselect={false}
              value={searchParams.get('filter') || 'all'}
              onChange={value => {
                if (value === 'all') params.delete('filter');
                else {
                  params.set('filter', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url, { scroll: false });
              }}
              data={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'ACTIVE', label: 'Hoạt động' },
                { value: 'INACTIVE', label: 'Không hoạt động' }
              ]}
            />
            <Select
              allowDeselect={false}
              value={searchParams.get('s') || 'all'}
              disabled={isLoading}
              onChange={value => {
                if (value === 'all') params.delete('s');
                else {
                  params.set('s', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url, { scroll: false });
              }}
              data={[
                { value: 'all', label: 'Tất cả danh mục' },
                ...(categories || []).map((item: GetAllCategory[number]) => ({ value: item.tag, label: item.name }))
              ]}
              nothingFoundMessage='Không tìm thấy'
            />
          </Group>
        </Group>
      </Paper>
      <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing='md'>
        {isLoadingProduct ? (
          [0, 0, 0, 0, 0, 0].map((_, index) => <CardSkeleton key={index} />)
        ) : currentItems.length > 0 ? (
          currentItems.map((item: FindProduct['products'][number]) => (
            <Paper
              key={item.id}
              withBorder
              radius='xl'
              p='md'
              className='bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-dark-card'
            >
              <Group justify='space-between' align='flex-start' wrap='nowrap'>
                <Group align='flex-start' wrap='nowrap'>
                  <Avatar
                    src={getImageProduct(item?.imageForEntities ?? [], ImageType.THUMBNAIL)}
                    alt={item.name}
                    size={64}
                    radius='md'
                  />

                  <Stack gap={4}>
                    <Highlight size='sm' fw={700} highlight={s}>
                      {item.name}
                    </Highlight>

                    <Text size='sm' fw={700} c='mainColor'>
                      {formatPriceLocaleVi(item.price)}
                    </Text>

                    <Text size='xs' c='dimmed'>
                      {formatDateViVN(item.createdAt)}
                    </Text>
                  </Stack>
                </Group>

                <Group gap={6} wrap='nowrap'>
                  <UpdateProductButton id={item.id} />
                  <DeleteProductButton id={item.id} />
                </Group>
              </Group>

              <Divider my='sm' />

              <Stack gap='sm'>
                <Group gap='xs'>
                  <Text size='xs' c='dimmed' fw={600}>
                    Danh mục:
                  </Text>

                  <Tooltip label={item.subCategory?.name}>
                    <Badge color='green'>{item.subCategory?.name}</Badge>
                  </Tooltip>
                </Group>

                <Group gap='xs'>
                  <Text size='xs' c='dimmed' fw={600}>
                    Trạng thái:
                  </Text>

                  <Tooltip label={item.isActive ? 'Hoạt động' : 'Tạm ẩn'}>
                    <Badge color={item.isActive ? '' : 'red'}>{item.isActive ? 'Hoạt động' : 'Tạm ẩn'}</Badge>
                  </Tooltip>
                </Group>

                <Stack gap={6}>
                  <Text size='xs' c='dimmed' fw={600}>
                    Nguyên liệu
                  </Text>

                  <Group gap={6}>
                    {item?.materials?.length > 0 ? (
                      item?.materials?.map((i: FindProduct['products'][number]['materials'][number], index: number) => (
                        <Tooltip label={i?.name} key={index}>
                          <Badge bg={randomColorHex(index + 20)}>{i?.name}</Badge>
                        </Tooltip>
                      ))
                    ) : (
                      <Text size='sm' c='dimmed'>
                        Đang cập nhật
                      </Text>
                    )}
                  </Group>
                </Stack>

                <Stack gap={6}>
                  <Text size='xs' c='dimmed' fw={600}>
                    Mô tả
                  </Text>

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
                </Stack>
              </Stack>
            </Paper>
          ))
        ) : (
          <Paper withBorder radius='lg' p='xl' className='col-span-full bg-gray-100 text-center dark:bg-dark-card'>
            <Text size='md' c='dimmed'>
              Không có bản ghi phù hợp.
            </Text>
          </Paper>
        )}
      </SimpleGrid>

      <Group justify='space-between' align='center' my={'md'}>
        <PageSizeSelector />
        <CustomPagination totalPages={dataClient?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
