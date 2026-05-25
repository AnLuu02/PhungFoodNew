'use client';
import { Box, Flex, Group, Paper, Select, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconReport } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toNumber } from '~/lib/FuncHandler/Format';
import { ExportReports } from './ExportReportsBtn';
const dataSelect = [
  {
    value: 'all',
    label: 'Tất cả'
  },
  {
    value: '0',
    label: 'Hôm nay'
  },
  {
    value: '7',
    label: '7 ngày qua'
  },
  {
    value: '15',
    label: '15 ngày qua'
  },
  {
    value: '30',
    label: '30 ngày qua'
  },
  {
    value: 'range-other',
    label: 'Khác',
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
  const period = Math.floor(((endTimeToNum || -2) - (startTimeToNum || -1)) / (24 * 60 * 60 * 1000));

  const valueSelect = useMemo(() => {
    return dataSelect.some(item => item.value === period.toString())
      ? period.toString()
      : period < 0
        ? 'all'
        : 'range-other';
  }, [period]);

  useEffect(() => {
    if (value[0] && value[1]) {
      params.set('startTime', value[0].getTime().toString());
      params.set('endTime', value[1].getTime().toString());
      router.push('/admin/reports?' + params.toString(), { scroll: false });
    }
  }, [value[1]]);

  useEffect(() => {
    if (period && period >= 0) {
      setValue([new Date(startTimeToNum || -1), new Date(endTimeToNum || -2)]);
    } else {
      setValue([null, null]);
    }
  }, [period]);
  return (
    <>
      <Paper withBorder shadow='md' py={'xl'} px={'xl'}>
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
                if (value === 'all') {
                  params.delete('startTime');
                  params.delete('endTime');
                  url = '/admin/reports?' + params.toString();
                } else {
                  const endTime = new Date().getTime();
                  let startTime = endTime - Number(value) * 24 * 60 * 60 * 1000;
                  if (value === '0') {
                    const d = new Date(startTime);
                    d.setHours(0, 0, 0, 0);
                    startTime = d.getTime();
                  }
                  params.set('startTime', startTime.toString());
                  params.set('endTime', endTime.toString());
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
                placeholder={`${valueSelect === 'all' ? 'Tất cả' : valueSelect === '0' ? 'Hôm nay' : 'Chọn ngày'}`}
                value={value}
                onChange={setValue}
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
