'use client';

import { Badge, Box, Button, Card, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconBolt, IconClock, IconDatabase, IconLayersDifference, IconRefresh, IconUsers } from '@tabler/icons-react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useCallback, useState } from 'react';
import BButton from '~/components/Button/Button';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';
import { ActivityFeed } from './components/ActivityFeed';
import ActivityFilter from './components/ActivityFilter';
export interface ActivityFilters {
  entityType?: string;
  action?: string;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
const TABS = [
  {
    value: 'feed',
    label: 'Bảng tin hoạt động'
  },
  {
    value: 'table',
    label: 'Bảng dữ liệu'
  }
];

export default function SystemActivityPage() {
  const [selectedItem, setSelectedItem] = useState<string[]>([]);
  const [filters, setFilters] = useState<ActivityFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const utils = api.useUtils();
  const { data: stats } = api.Activity.stats.useQuery({ dateRange: 'week' });
  const deleteMutation = api.Activity.bulkDelete.useMutation({
    onSuccess: () => {
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
      setSelectedItem([]);
      utils.Activity.feed.invalidate();
    },
    onError: e => {
      NotifyError(e?.message || 'Đã có lỗi không mong muốn xảy ra');
    }
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleSelectedItem = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedItem((prev: string[]) => [...prev, id]);
    } else {
      setSelectedItem((prev: string[]) => prev.filter(p => p !== id));
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await utils.Activity.invalidate();
    } finally {
      setIsRefreshing(false);
    }
  };
  const handleFilters = useCallback((filters: ActivityFilters) => {
    setFilters({ ...filters });
  }, []);
  return (
    <Box className='mx-auto mb-10 max-w-7xl space-y-8'>
      <Paper shadow='sm' radius='lg' p='lg' withBorder className='bg-white/80 backdrop-blur-sm dark:bg-dark-background'>
        <Group justify='space-between' wrap='wrap' gap='md'>
          <div>
            <Group gap='xs' align='center'>
              <Box className='flex h-[40px] w-[40px] items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md'>
                <IconClock size={36} className='text-white' />
              </Box>
              <div>
                <Text size='xl' fw={800} variant='gradient' gradient={{ from: 'blue.7', to: 'indigo.6', deg: 45 }}>
                  Lịch sử hoạt động hệ thống
                </Text>
                <Text size='sm' c='dimmed' className='mt-0.5'>
                  Theo dõi và giám sát mọi hoạt động của hệ thống trong thời gian thực.{' '}
                </Text>
              </div>
            </Group>
          </div>
          <Badge size='lg' radius='md' variant='light' color='green' className='font-mono'>
            Trực tiếp
          </Badge>
        </Group>
      </Paper>

      {stats && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing='md'>
          <Card
            shadow='sm'
            radius='lg'
            padding='lg'
            withBorder
            className='bg-backgroundAdmin transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-dark-card'
          >
            <Group justify='space-between' align='flex-start'>
              <div>
                <Text size='xs' c='dimmed' tt='uppercase' fw={600}>
                  Tổng số hoạt động
                </Text>
                <Text size='xl' fw={800} className='mt-1'>
                  {stats.total}
                </Text>
              </div>
              <Box className='flex h-[50px] w-[50px] items-center justify-center rounded-full bg-blue-50 p-2 text-blue-600 dark:bg-dark-dimmed'>
                <IconDatabase size={30} />
              </Box>
            </Group>
          </Card>

          <Card
            shadow='sm'
            radius='lg'
            padding='lg'
            withBorder
            className='bg-backgroundAdmin transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-dark-card'
          >
            <Group justify='space-between' align='flex-start'>
              <div>
                <Text size='xs' c='dimmed' tt='uppercase' fw={600}>
                  Đối tượng
                </Text>
                <Text size='xl' fw={800} className='mt-1'>
                  {stats.byEntity.length}
                </Text>
              </div>
              <Box className='flex h-[50px] w-[50px] items-center justify-center rounded-full bg-emerald-50 p-2 text-emerald-600 dark:bg-dark-dimmed'>
                <IconLayersDifference size={30} />
              </Box>
            </Group>
          </Card>

          <Card
            shadow='sm'
            radius='lg'
            padding='lg'
            withBorder
            className='bg-backgroundAdmin transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-dark-card'
          >
            <Group justify='space-between' align='flex-start'>
              <div>
                <Text size='xs' c='dimmed' tt='uppercase' fw={600}>
                  Hành động hàng đầu
                </Text>
                <Text fw={700} size='lg' className='mt-1 capitalize'>
                  {stats.byAction[0]?.action || '—'}
                </Text>
              </div>
              <Box className='flex h-[50px] w-[50px] items-center justify-center rounded-full bg-amber-50 p-2 text-amber-600 dark:bg-dark-dimmed'>
                <IconBolt size={30} />
              </Box>
            </Group>
          </Card>

          <Card
            shadow='sm'
            radius='lg'
            padding='lg'
            withBorder
            className='bg-backgroundAdmin transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-dark-card'
          >
            <Group justify='space-between' align='flex-start'>
              <div>
                <Text size='xs' c='dimmed' tt='uppercase' fw={600}>
                  Người dùng đang hoạt động
                </Text>
                <Text size='xl' fw={800} className='mt-1'>
                  {stats.topEditors.length}
                </Text>
              </div>
              <Box className='flex h-[50px] w-[50px] items-center justify-center rounded-full bg-purple-50 p-2 text-purple-600 dark:bg-dark-dimmed'>
                <IconUsers size={30} />
              </Box>
            </Group>
          </Card>
        </SimpleGrid>
      )}

      <ActivityFilter showFilters={showFilters} onFilters={handleFilters} />

      <Card shadow='lg' radius='lg' padding='xl' withBorder className='bg-cardAdmin dark:bg-dark-card'>
        <Stack gap='lg'>
          <Group justify='space-between'>
            <Text fw={700} size='lg' className='tracking-tight'>
              📋 Bảng tin hoạt động
            </Text>
            <Group>
              {selectedItem?.length > 0 && (
                <BButton
                  loading={deleteMutation.isPending}
                  disabled={!selectedItem || selectedItem?.length === 0}
                  onClick={() => {
                    if (selectedItem && selectedItem?.length > 0) {
                      deleteMutation.mutate({ ids: selectedItem });
                    }
                  }}
                >
                  Xóa tất cả
                </BButton>
              )}
              <Button
                onClick={handleRefresh}
                size='xs'
                radius={'xl'}
                variant='subtle'
                leftSection={<IconRefresh className={`${isRefreshing ? 'animate-spin' : ''}`} size={14} />}
              >
                <Text size='xs' c='dimmed' className='flex items-center gap-1'>
                  Đồng bộ
                </Text>
              </Button>
            </Group>
          </Group>

          <Box className='mt-2'>
            <ActivityFeed filters={filters} checkedList={selectedItem} onSeleted={handleSelectedItem} />
          </Box>
        </Stack>
      </Card>
    </Box>
  );
}
