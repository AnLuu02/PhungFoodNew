'use client';
import { Box, Flex, Group, Paper, Select, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconReport } from '@tabler/icons-react';
import { ManipulateType } from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import dayjs from '~/lib/dayjs';
import { toNumber } from '~/lib/FuncHandler/Format';
import { Period } from '~/shared/types';
import { ExportReports } from './ExportReportsBtn';
const dataSelect: { value: Period; label: string; disabled?: boolean }[] = [
  {
    value: '_all',
    label: 'Tất cả'
  },
  {
    value: '_today',
    label: 'Hôm nay'
  },
  {
    value: '7_day',
    label: '7 ngày qua'
  },
  {
    value: '15_day',
    label: '15 ngày qua'
  },
  {
    value: '1_month',
    label: '30 ngày qua'
  },
  {
    value: '3_month',
    label: '3 tháng qua'
  },
  {
    value: '6_month',
    label: '6 tháng qua'
  },
  {
    value: '1_year',
    label: 'Năm vừa rồi'
  },
  {
    value: '_custom',
    label: 'Tùy chỉnh',
    disabled: true
  }
];
export const FilterSectionReport = () => {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const startTimeToNum = toNumber(params.get('startTime') ?? undefined);
  const endTimeToNum = toNumber(params.get('endTime') ?? undefined);
  const period = params?.get('period') ?? '_all';

  const valueSelect = useMemo(() => {
    return dataSelect.some(item => item.value === period.toString()) ? period.toString() : '_all';
  }, [period]);

  useEffect(() => {
    if (value[0] && value[1]) {
      const endTime = dayjs(value[1]).toDate().getTime();
      const startTime = dayjs(value[0]).toDate().getTime();
      params.set('startTime', startTime.toString());
      params.set('endTime', endTime.toString());
      params.set('period', '_custom');
      router.push('/admin/reports?' + params.toString(), { scroll: false });
    }
  }, [value[1]]);

  useEffect(() => {
    if (period !== '_custom') {
      setValue([null, null]);
    } else {
      if (startTimeToNum && endTimeToNum) {
        setValue([dayjs(startTimeToNum).tz().toDate(), dayjs(endTimeToNum).tz().toDate()]);
      }
    }
  }, [period]);

  return (
    <>
      <Paper
        withBorder
        shadow='md'
        py={'xl'}
        px={'xl'}
        className='light:bg-gradient-to-br light:from-blue-50 light:via-white light:to-indigo-50 relative overflow-hidden border border-blue-50 shadow-sm dark:border-dark-dimmed dark:bg-dark-card'
      >
        <Box className='absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl' />
        <Flex align={'center'} justify={'space-between'}>
          <Box>
            <Title className='flex items-center gap-2 font-quicksand' order={3}>
              <IconReport size={20} />
              Báo cáo thống kê
            </Title>
            <Text fw={600} size={'sm'} c={'dimmed'}>
              Theo dõi hiệu suất và phân tích dữ liệu hệ thống PhungFood
            </Text>
          </Box>
          <Group>
            <Select
              allowDeselect={false}
              value={valueSelect}
              onChange={value => {
                let url = '';
                if (value === '_all') {
                  params.delete('startTime');
                  params.delete('endTime');
                  params.delete('period');
                  url = '/admin/reports?' + params.toString();
                } else if (value && value !== '_custom') {
                  const arr = value?.split('_') ?? [0, 'day'];
                  const periodSize = arr[0] ? Number(arr[0]) : 0;
                  const unit = (arr[1] !== 'today' ? arr[1] : 'day') as ManipulateType | undefined;
                  const endTime = dayjs().toDate().getTime();
                  const startTime = dayjs()
                    .subtract(unit !== 'month' ? periodSize : periodSize - 1, unit)
                    .startOf(unit as any)
                    .toDate()
                    .getTime();
                  params.set('startTime', startTime.toString());
                  params.set('endTime', endTime.toString());
                  params.set('period', value.toString());
                  url = '/admin/reports?' + params.toString();
                }

                router.push(url, { scroll: false });
              }}
              defaultValue={'7day'}
              data={dataSelect}
            />
            <Group>
              <DatePickerInput
                type='range'
                placeholder={`${(!value && !period) || period === '_all' ? 'Tất cả' : period === '_today' ? 'Hôm nay' : 'Chọn ngày'}`}
                value={value}
                onChange={value => {
                  if (value && value.length == 2) {
                    setValue(value);
                  }
                }}
                miw={200}
              />
            </Group>

            <ExportReports />
          </Group>
        </Flex>
      </Paper>
    </>
  );
};
