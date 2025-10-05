'use client';
import { AreaChart } from '@mantine/charts';
import { Box, Card, Flex, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
const overview = [
  {
    title: 'All User',
    value: 10.234,
    color: '#DEE2E6'
  },
  {
    title: 'Event Count',
    value: 536,
    color: '#FD7E14'
  },
  {
    title: 'Conversations',
    value: 21,
    color: '#40C057'
  },
  {
    title: 'New Users',
    value: 3.321,
    color: '#228BE6'
  }
];

export default function ReportSnapshotChart() {
  return (
    <Card radius={'md'} withBorder h='100%'>
      <Stack gap={'lg'}>
        <Flex align={'center'} justify={'space-between'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={3}>
              Reports Snapshot
            </Title>
            <Text size='xs' c={'dimmed'}>
              Demographic properties of your customer
            </Text>
          </Box>
          <DatePickerInput size='xs' leftSection={<IconCalendar size={20} />} placeholder='Select date' />
        </Flex>
        <SimpleGrid cols={4}>
          {overview.map((item, index) => (
            <>
              <Card radius={'md'} h={80} px={'md'} py={'xs'} style={{ backgroundColor: item.color }}>
                <Flex direction={'column'} justify={'space-between'} align={'flex-start'} h={'100%'}>
                  <Text className='dark:text-black' size='sm' fw={600}>
                    {item.title}
                  </Text>
                  <Text className='dark:text-black' fw={700} size='lg'>
                    {item.value}
                  </Text>
                </Flex>
              </Card>
            </>
          ))}
        </SimpleGrid>
        <AreaChart
          pr='md'
          withDots={false}
          w='100%'
          h={220}
          fillOpacity={0.6}
          curveType='bump'
          gridColor='rgba(119,136,153,0.3)'
          strokeDasharray={9}
          data={data}
          strokeWidth={3}
          dataKey='date'
          yAxisProps={{ domain: [0, 100] }}
          series={[{ name: 'Apples', color: 'indigo.6' }]}
        />
      </Stack>
    </Card>
  );
}

const data = [
  {
    date: 'Jan',
    Apples: 31
  },
  {
    date: 'Feb',
    Apples: 200
  },
  {
    date: 'March',
    Apples: 28
  },
  {
    date: 'April',
    Apples: 100
  },
  {
    date: 'May',
    Apples: 42
  },
  {
    date: 'June',
    Apples: 109
  },
  {
    date: 'July',
    Apples: 100
  },
  {
    date: 'Aug',
    Apples: 45
  },
  {
    date: 'Sep',
    Apples: 89
  },

  {
    date: 'Oct',
    Apples: 100
  },
  {
    date: 'Nov',
    Apples: 23
  },
  {
    date: 'Dec',
    Apples: 67
  }
];
