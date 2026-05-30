'use client';

import { ActionIcon, Box, Button, Group, Paper, SegmentedControl, Select, Stack, Text, Tooltip } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconBuildingStore,
  IconCalendar,
  IconCategory,
  IconDeviceMobile,
  IconRefresh,
  IconTrendingUp
} from '@tabler/icons-react';
import { useState } from 'react';
import { AnalyticsFilters } from '~/shared/types/analysis.types';

interface AnalyticsHeaderProps {
  filters: AnalyticsFilters;
  setFilters: (filters: AnalyticsFilters) => void;
  onRefresh: () => void;
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
}

const DATE_PRESETS = [
  { label: 'Hôm nay', value: 'today' },
  { label: '7 ngày', value: 'last7' },
  { label: '30 ngày', value: 'last30' },
  { label: 'Quý này', value: 'lastQuarter' },
  { label: 'Năm nay', value: 'thisYear' }
];

export function AnalyticsHeader({ filters, setFilters, onRefresh, onExport }: AnalyticsHeaderProps) {
  const [datePreset, setDatePreset] = useState<string>('last30');

  const handleDatePreset = (preset: string) => {
    setDatePreset(preset);

    const now = new Date();
    const from = new Date();

    switch (preset) {
      case 'today':
        from.setHours(0, 0, 0, 0);
        break;
      case 'last7':
        from.setDate(now.getDate() - 7);
        break;
      case 'last30':
        from.setDate(now.getDate() - 30);
        break;
      case 'lastQuarter':
        from.setMonth(now.getMonth() - 3);
        break;
      case 'thisYear':
        from.setMonth(0, 1);
        from.setHours(0, 0, 0, 0);
        break;
      default:
        from.setDate(now.getDate() - 30);
    }

    setFilters({
      ...filters,
      dateRange: {
        from,
        to: new Date()
      }
    });
  };

  return (
    <Paper
      withBorder
      radius='xl'
      p={{ base: 'md', sm: 'lg', lg: 'xl' }}
      className='relative overflow-hidden bg-white shadow-sm dark:bg-dark-card'
    >
      <Box className='pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl' />
      <Box className='pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-teal-500/10 blur-3xl' />

      <Stack gap='lg' className='relative z-10'>
        <Stack gap='md'>
          <Group justify='space-between' align='center' wrap='wrap'>
            <Stack gap={2}>
              <Text size='sm' fw={700}>
                Bộ lọc dữ liệu
              </Text>
              <Text size='xs' c='dimmed'>
                Tùy chỉnh khoảng thời gian, chi nhánh, danh mục và kênh bán hàng
              </Text>
            </Stack>

            <Group gap='xs'>
              <Tooltip label='So sánh với kỳ liền trước'>
                <Button
                  radius='xl'
                  size='xs'
                  variant={filters.comparePeriod ? 'filled' : 'default'}
                  color={filters.comparePeriod ? 'blue' : 'gray'}
                  leftSection={filters.comparePeriod ? <IconTrendingUp size={14} /> : undefined}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      comparePeriod: !filters.comparePeriod
                    })
                  }
                >
                  {filters.comparePeriod ? 'Đang so sánh' : 'Bật so sánh'}
                </Button>
              </Tooltip>
              <Tooltip label='Làm mới dữ liệu'>
                <ActionIcon variant='light' size='lg' radius='xl' onClick={() => {}}>
                  <IconRefresh size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          <Box className='grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_0.9fr]'>
            <Paper withBorder p='sm' className='shadow-xs bg-white dark:bg-dark-background'>
              <Stack gap={8}>
                <Text size='xs' fw={700} c='dimmed' tt='uppercase'>
                  Khoảng thời gian nhanh
                </Text>

                <SegmentedControl
                  value={datePreset}
                  onChange={handleDatePreset}
                  data={DATE_PRESETS}
                  radius='xl'
                  size='sm'
                  fullWidth
                  classNames={{
                    root: 'bg-gray-100 p-1 dark:bg-dark-card',
                    indicator: 'shadow-sm',
                    label: 'font-medium'
                  }}
                />
              </Stack>
            </Paper>

            <Paper withBorder p='sm' className='shadow-xs bg-white dark:bg-dark-background'>
              <DatePickerInput
                type='range'
                label='Khoảng ngày tùy chỉnh'
                placeholder='Chọn ngày bắt đầu - kết thúc'
                value={[filters.dateRange.from, filters.dateRange.to]}
                onChange={val => {
                  if (!val) return;

                  const [from, to] = val;

                  if (from && to) {
                    setFilters({
                      ...filters,
                      dateRange: { from, to }
                    });
                  }
                }}
                leftSection={<IconCalendar size={16} />}
                radius='lg'
                size='sm'
                clearable
                classNames={{
                  label: 'mb-1 text-xs font-bold uppercase text-gray-500',
                  input: 'bg-gray-50 dark:bg-dark-card'
                }}
              />
            </Paper>
          </Box>

          <Box className='grid grid-cols-1 gap-3 md:grid-cols-3'>
            <Select
              label='Chi nhánh'
              placeholder='Chọn chi nhánh'
              data={[
                { value: 'all', label: 'Tất cả chi nhánh' },
                { value: 'downtown', label: 'Downtown' },
                { value: 'uptown', label: 'Uptown' }
              ]}
              value={filters.branch}
              onChange={val => setFilters({ ...filters, branch: val || 'all' })}
              radius='lg'
              size='sm'
              leftSection={<IconBuildingStore size={16} />}
              classNames={{
                label: 'mb-1 text-xs font-bold uppercase text-gray-500',
                input: 'bg-white dark:bg-dark-card'
              }}
            />

            <Select
              label='Danh mục'
              placeholder='Chọn danh mục'
              data={[
                { value: 'all', label: 'Tất cả danh mục' },
                { value: 'main', label: 'Món chính' },
                { value: 'beverage', label: 'Đồ uống' }
              ]}
              value={filters.category}
              onChange={val => setFilters({ ...filters, category: val || 'all' })}
              radius='lg'
              size='sm'
              leftSection={<IconCategory size={16} />}
              classNames={{
                label: 'mb-1 text-xs font-bold uppercase text-gray-500',
                input: 'bg-white dark:bg-dark-card'
              }}
            />

            <Select
              label='Kênh bán'
              placeholder='Chọn kênh'
              data={[
                { value: 'all', label: 'Tất cả kênh' },
                { value: 'online', label: 'Online' },
                { value: 'dinein', label: 'Tại quán' }
              ]}
              value={filters.channel}
              onChange={val => setFilters({ ...filters, channel: val || 'all' })}
              radius='lg'
              size='sm'
              leftSection={<IconDeviceMobile size={16} />}
              classNames={{
                label: 'mb-1 text-xs font-bold uppercase text-gray-500',
                input: 'bg-white dark:bg-dark-card'
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
