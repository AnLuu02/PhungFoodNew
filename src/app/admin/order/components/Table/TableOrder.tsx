'use client';

import { Badge, Box, Divider, Group, Highlight, Paper, Stack, Text } from '@mantine/core';
import { IconBellPause, IconCircleCheck, IconSum, IconTruckDelivery, IconXboxX } from '@tabler/icons-react';
import CustomPagination from '~/components/Pagination';
import PageSizeSelector from '~/components/Perpage';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getStatusInfo, ORDER_STATUS_UI } from '~/lib/FuncHandler/status-order';
import {
  CopyOrderButton,
  DeleteOrderButton,
  HandleStateOrderButton,
  SendMessageOrderButton,
  SendOrderButton,
  UpdateOrderButton
} from '../Button';

import { ActionIcon, Card, Flex, Select, SimpleGrid, Title } from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import dayjs from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import { SearchInput } from '~/components/Search/SearchInput';
import { TFindOrder, TGetAllOrder } from '~/shared/type-trpc/order.type-trpc';
import { api } from '~/trpc/react';

export default function TableOrder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const s = searchParams?.get('s') || '';
  const page = searchParams?.get('page') || '1';
  const limit = searchParams?.get('limit') ?? '5';
  const filter = searchParams?.get('filter') ?? undefined;
  const sortArr = searchParams?.getAll('sort') ?? undefined;

  const { data: dataClient, isLoading } = api.Order.find.useQuery({
    page: +page,
    limit: +limit,
    s,
    filter,
    sort: sortArr
  });
  const { data: allDataClient } = api.Order.getAll.useQuery(undefined);
  const currentItems = dataClient?.orders || [];
  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];
    const summary = allDataClient.reduce(
      (
        acc: {
          total: number;
          [OrderStatus.COMPLETED]: number;
          [OrderStatus.UNPAID]: number;
          [OrderStatus.SHIPPING]: number;
          [OrderStatus.PENDING]: number;
          [OrderStatus.CANCELLED]: number;
          [OrderStatus.CONFIRMED]: number;
        },
        item: TGetAllOrder[number]
      ) => {
        acc.total += 1;
        item.status ? (acc[item.status as OrderStatus] += 1) : null;
        return acc;
      },
      {
        total: 0,
        [OrderStatus.UNPAID]: 0,
        [OrderStatus.COMPLETED]: 0,
        [OrderStatus.SHIPPING]: 0,
        [OrderStatus.PENDING]: 0,
        [OrderStatus.CANCELLED]: 0,
        [OrderStatus.CONFIRMED]: 0
      }
    );

    return [
      {
        label: 'Tổng số đơn hàng',
        value: summary.total,
        icon: IconSum,
        color: '#446DAE'
      },
      {
        label: 'Hoàn thành',
        value: summary[OrderStatus.COMPLETED],
        icon: IconCircleCheck,
        color: '#499764'
      },
      {
        label: 'Vận chuyển',
        value: summary[OrderStatus.SHIPPING],
        icon: IconTruckDelivery,
        color: '#C0A453'
      },
      {
        label: 'Chờ xác nhận',
        value: summary[OrderStatus.PENDING],
        icon: IconBellPause,
        color: '#F16329'
      },

      {
        label: 'Đã hủy',
        value: summary[OrderStatus.CANCELLED],
        icon: IconXboxX,
        color: '#CA041D'
      }
    ];
  }, [allDataClient]);

  const utils = api.useUtils();
  useEffect(() => {
    if (dataClient?.pagination.hasNext) {
      void utils.Order.find.prefetch({ page: +page + 1, limit: +limit, s });
    }
  }, [page]);

  return (
    <>
      <SimpleGrid cols={5}>
        {dataFilter?.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card shadow='md' pos={'relative'} key={index} p={'md'} style={{ backgroundColor: item.color + 10 }}>
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
            <PageSizeSelector />
            <Select
              allowDeselect={false}
              placeholder='Status'
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
                ...ORDER_STATUS_UI.map(item => ({
                  value: item.key,
                  label: item.label
                }))
              ]}
            />

            <Select
              allowDeselect={false}
              placeholder='Sắp xếp'
              value={searchParams.get('sort') || 'all'}
              onChange={value => {
                if (value === 'all') params.delete('sort');
                else {
                  params.set('sort', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url, { scroll: false });
              }}
              data={[
                { value: 'all', label: 'Tất cả' },
                { value: 'finalAmount-asc', label: 'Tổng đơn tăng dần' },
                { value: 'finalAmount-desc', label: 'Tổng đơn giảm dần' }
              ]}
            />
          </Group>
        </Group>
      </Paper>
      <Stack gap='md'>
        {isLoading ? (
          <CommonSkeleton.Table count={5} />
        ) : currentItems.length > 0 ? (
          currentItems.map((order: TFindOrder['orders'][number]) => {
            const statusInfo = getStatusInfo(order.status as OrderStatus);

            return (
              <Paper
                key={order.id}
                withBorder
                radius='lg'
                p='md'
                className='bg-white shadow-sm transition hover:shadow-md dark:bg-dark-card'
              >
                <Group justify='space-between' align='flex-start' wrap='nowrap'>
                  <Stack gap={6}>
                    <Group gap='xs'>
                      <Text size='xs' c='dimmed'>
                        Mã hóa đơn
                      </Text>

                      <Highlight size='sm' fw={600} highlight={s}>
                        {order.id}
                      </Highlight>
                    </Group>

                    <Group gap='xl' wrap='wrap'>
                      <Stack gap={2}>
                        <Text size='xs' c='dimmed'>
                          Khách hàng
                        </Text>
                        <Highlight size='sm' highlight={s}>
                          {order.user?.name || 'Đang cập nhật'}
                        </Highlight>
                      </Stack>

                      <Stack gap={2}>
                        <Text size='xs' c='dimmed'>
                          Thanh toán
                        </Text>
                        <Highlight size='sm' highlight={s}>
                          {order.payment?.name || 'Đang cập nhật'}
                        </Highlight>
                      </Stack>

                      <Stack gap={2}>
                        <Text size='xs' c='dimmed'>
                          Tổng hóa đơn
                        </Text>
                        <Text size='sm' fw={600}>
                          {formatPriceLocaleVi(order?.finalAmount)}
                        </Text>
                      </Stack>

                      <Stack gap={2}>
                        <Text size='xs' c='dimmed'>
                          Ngày tạo
                        </Text>
                        <Text size='sm'>{dayjs(order.createdAt).format('DD-MM-YYYY HH:mm:ss')}</Text>
                      </Stack>
                    </Group>
                  </Stack>

                  <Badge
                    leftSection={<statusInfo.icon size={16} />}
                    variant='light'
                    color={statusInfo.color}
                    style={{ borderColor: statusInfo.color }}
                  >
                    {statusInfo.label}
                  </Badge>
                </Group>

                <Divider my='sm' />

                <Group justify='space-between' align='center' wrap='wrap'>
                  <Group gap='xs'>
                    {order.status === OrderStatus.PENDING && (
                      <HandleStateOrderButton id={order.id} status={OrderStatus.CONFIRMED} title='Xác nhận' />
                    )}

                    {order.status === OrderStatus.CONFIRMED && (
                      <HandleStateOrderButton id={order.id} status={OrderStatus.SHIPPING} title='Giao hàng' />
                    )}

                    {order.status === OrderStatus.SHIPPING && (
                      <HandleStateOrderButton id={order.id} status={OrderStatus.COMPLETED} title='Hoàn thành' />
                    )}

                    {order.status !== OrderStatus.CANCELLED && (
                      <HandleStateOrderButton id={order.id} status={OrderStatus.CANCELLED} title='Hủy đơn' />
                    )}
                  </Group>

                  <Group gap='xs'>
                    <UpdateOrderButton id={order.id} />
                    <DeleteOrderButton id={order.id} />
                    <CopyOrderButton data={order} />

                    {order?.user && <SendOrderButton order={order} />}

                    {order.status !== OrderStatus.COMPLETED && order?.user && (
                      <SendMessageOrderButton user={order.user} />
                    )}
                  </Group>
                </Group>
              </Paper>
            );
          })
        ) : (
          <Paper withBorder radius='lg' p='xl' className='bg-gray-100 text-center dark:bg-dark-card'>
            <Text size='md' c='dimmed'>
              Không có bản ghi phù hợp.
            </Text>
          </Paper>
        )}
      </Stack>

      <Group justify='space-between' align='center' my={'md'}>
        <PageSizeSelector />
        <CustomPagination totalPages={dataClient?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
