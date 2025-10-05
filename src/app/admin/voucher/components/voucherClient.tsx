'use client';

import { ActionIcon, Box, Card, Flex, Group, Paper, Select, SimpleGrid, Title } from '@mantine/core';
import { IconActivity, IconAlertTriangle, IconCircleCheck, IconGift } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import PageSizeSelector from '~/components/Admin/Perpage';
import Empty from '~/components/Empty';
import CustomPagination from '~/components/Pagination';
import { SearchInput } from '~/components/Search/search-input';
import { api } from '~/trpc/react';
import CardVoucher from './card-voucher';
import { UpdateVoucherModal } from './Modal/UpdateVoucherModal';
import { ViewVoucherModal } from './Modal/ViewVoucherModal';

export default function VoucherClient({ s, data, allData }: { s: string; data: any; allData?: any }) {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '3';
  const { data: dataClient } = api.Voucher.find.useQuery({ skip: +page, take: +limit, s }, { initialData: data });
  const { data: allDataClient } = api.Voucher.getAll.useQuery(undefined, { initialData: allData });
  const [selectedPromotion, setSelectedPromotion] = useState<{ type: 'edit' | 'view'; data: any } | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredItems = useMemo(() => {
    if (!dataClient?.vouchers) return [];

    return dataClient.vouchers.filter((promotion: any) => {
      const matchStatus = statusFilter === 'all' || promotion.status?.toLowerCase() === statusFilter?.toLowerCase();

      const matchType = typeFilter === 'all' || promotion.type?.toLowerCase() === typeFilter?.toLowerCase();

      return matchStatus && matchType;
    });
  }, [dataClient?.vouchers, statusFilter, typeFilter]);

  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];

    const now = new Date();

    const summary = allDataClient.reduce(
      (acc: any, item: any) => {
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

  return (
    <>
      <SimpleGrid cols={4}>
        {dataFilter?.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card
              shadow='md'
              radius={'md'}
              pos={'relative'}
              key={index}
              p={'md'}
              style={{ backgroundColor: item.color + 10 }}
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
      <Paper radius={'md'} withBorder shadow='md' p={'md'}>
        <Group justify='space-between'>
          <SearchInput width={500} />
          <Group>
            <Select
              allowDeselect={false}
              value={statusFilter}
              onChange={value => setStatusFilter(value as string)}
              placeholder='Status'
              data={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'enabled', label: 'Hoạt động' },
                { value: 'disabled', label: 'Không hoạt động' }
              ]}
            />

            <Select
              value={typeFilter}
              allowDeselect={false}
              onChange={value => setTypeFilter(value as string)}
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
      {filteredItems.length === 0 ? (
        <Empty hasButton={false} title='Không có kết quả phù hợp' content='' />
      ) : (
        <SimpleGrid cols={3}>
          {filteredItems.map((promotion: any) => {
            return (
              <CardVoucher key={promotion.id} promotion={promotion} s={s} setSelectedPromotion={setSelectedPromotion} />
            );
          })}
        </SimpleGrid>
      )}
      <Group justify='space-between' mt='md'>
        <PageSizeSelector />
        <CustomPagination totalPages={dataClient?.pagination.totalPages || 1} />
      </Group>
      <ViewVoucherModal selectedPromotion={selectedPromotion} setSelectedPromotion={setSelectedPromotion} />
      <UpdateVoucherModal selectedPromotion={selectedPromotion} setSelectedPromotion={setSelectedPromotion} />
    </>
  );
}
