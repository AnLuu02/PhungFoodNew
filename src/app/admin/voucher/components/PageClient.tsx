'use client';

import { ActionIcon, Box, Card, Flex, Group, Paper, Select, SimpleGrid, Title } from '@mantine/core';
import { IconActivity, IconAlertTriangle, IconCircleCheck, IconGift } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Empty from '~/components/Empty';
import { ModalUpsertSkeleton } from '~/components/ModelUpsertSkeleton';
import CustomPagination from '~/components/Pagination';
import PageSizeSelector from '~/components/Perpage';
import { SearchInput } from '~/components/Search/SearchInput';
import { STATUS_FILTER_VOUCHER } from '~/shared/constants/voucher.constants';
import { FindVoucher, GetAllVoucher } from '~/shared/type-trpc/voucher.type-trpc';
import { api } from '~/trpc/react';
import CardVoucher from './CardVoucher';
import { UpdateVoucherModal } from './Modal/UpdateVoucherModal';
import { ViewVoucherModal } from './Modal/ViewVoucherModal';

type StatusFilterVoucher = typeof STATUS_FILTER_VOUCHER;

export default function VoucherClient() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();

  const s = searchParams.get('s') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') ?? '5';
  const status = searchParams?.getAll('status');
  const type = searchParams?.get('type') ?? undefined;

  const { data, isLoading } = api.Voucher.find.useQuery({
    page: +page,
    limit: +limit,
    filters: {
      s: s,
      status,
      type
    }
  });
  const { data: allDataClient } = api.Voucher.getAll.useQuery(undefined);
  const [selectedPromotion, setSelectedPromotion] = useState<{
    type: 'edit' | 'view';
    data: FindVoucher['vouchers'][number];
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<keyof StatusFilterVoucher>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const vouchers = data?.vouchers || [];

  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];

    const now = new Date();

    const summary = allDataClient.reduce(
      (acc: { total: number; enabled: number; expired: number; totalUsage: number }, item: GetAllVoucher[number]) => {
        const endDate = new Date(item.endDate);
        const used = +item.usedQuantity || 0;

        acc.total += 1;
        acc.totalUsage += used;

        if (item.isActive) {
          if (endDate > now) {
            acc.enabled += 1;
          } else {
            acc.expired += 1;
          }
        }
        return acc;
      },
      { total: 0, enabled: 0, expired: 0, totalUsage: 0 }
    );

    return [
      {
        label: 'Tổng số khuyến mãi',
        value: summary.total,
        icon: IconGift,
        color: '#446DAE'
      },
      {
        label: 'Khả dụng',
        value: summary.enabled,
        icon: IconCircleCheck,
        color: '#499764'
      },
      {
        label: 'Đã được dùng',
        value: summary.totalUsage,
        icon: IconActivity,
        color: '#C0A453'
      },
      {
        label: 'Hết hạn',
        value: summary.expired,
        icon: IconAlertTriangle,
        color: '#CA041D'
      }
    ];
  }, [allDataClient]);

  const utils = api.useUtils();
  useEffect(() => {
    if (data?.pagination.hasNext) {
      void utils.Voucher.find.prefetch({
        page: +page + 1,
        limit: +limit,
        filters: {
          s,
          status,
          type
        }
      });
    }
  }, [page]);

  return (
    <>
      <SimpleGrid cols={4}>
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
              value={statusFilter}
              onChange={value => {
                if (value) {
                  setStatusFilter(value as typeof statusFilter);
                  params.set('status', value.toString());
                  if (value === 'all') params.delete('status');
                  params.delete('page');
                  router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
                }
              }}
              placeholder='Status'
              data={Object.values(STATUS_FILTER_VOUCHER)}
            />

            <Select
              value={typeFilter}
              allowDeselect={false}
              onChange={value => {
                if (value) {
                  setTypeFilter(value as string);
                  params.set('type', value);
                  if (value === 'all') params.delete('type');
                  params.delete('page');
                  router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
                }
              }}
              placeholder='Type'
              data={[
                { value: 'all', label: 'Tất cả loại' },
                {
                  value: 'percentage',
                  label: 'Phần trăm'
                },
                {
                  value: 'fixed',
                  label: 'Tiền mặt'
                }
              ]}
            />
          </Group>
        </Group>
      </Paper>
      {isLoading ? (
        <ModalUpsertSkeleton />
      ) : vouchers.length === 0 ? (
        <Empty hasButton={false} title='Không có kết quả phù hợp' content='' />
      ) : (
        <SimpleGrid cols={3}>
          {vouchers.map((promotion: FindVoucher['vouchers'][number]) => {
            return (
              <CardVoucher key={promotion.id} promotion={promotion} s={s} setSelectedPromotion={setSelectedPromotion} />
            );
          })}
        </SimpleGrid>
      )}
      <Group justify='space-between' align='center' my={'md'}>
        <PageSizeSelector />
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
      <ViewVoucherModal selectedPromotion={selectedPromotion} setSelectedPromotion={setSelectedPromotion} />
      <UpdateVoucherModal selectedPromotion={selectedPromotion} setSelectedPromotion={setSelectedPromotion} />
    </>
  );
}
