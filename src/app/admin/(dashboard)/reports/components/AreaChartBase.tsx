import { AreaChart } from '@mantine/charts';
import { ActionIcon, Box, Card, Flex, Group, Text, Title, Tooltip } from '@mantine/core';
import { IconRotateClockwise } from '@tabler/icons-react';
import dayjs from '~/lib/dayjs';

export const AreaChartBase = ({
  dataChart,
  contentHeader,
  startDate,
  periodSize
}: {
  dataChart: { label: string; current: number; previous: number }[];
  startDate: Date | number;
  periodSize: number;
  contentHeader: {
    title: string;
    sub: string | React.ReactNode;
  };
}) => {
  const data: { label: string; current: number; previous: number }[] =
    dataChart?.length > 0
      ? dataChart
      : Array.from({ length: periodSize || 1 }, (_, index) => {
          return {
            current: 0,
            previous: 0,
            label: dayjs(startDate).tz().add(index, 'day').format('DD-MM-YYYY')
          };
        });
  return (
    <Card withBorder shadow='md' className='transition duration-300 ease-in-out dark:bg-transparent'>
      <Flex align={'center'} justify={'space-between'} mb={'xl'}>
        <Box>
          <Title order={5} className='font-quicksand'>
            {contentHeader.title}
          </Title>
          <Text size='sm' c={'dimmed'}>
            {contentHeader.sub}
          </Text>
        </Box>
        <Group>
          <Tooltip label={'Cập nhật'}>
            <ActionIcon variant='light' size={'lg'}>
              <IconRotateClockwise size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Flex>

      <AreaChart
        h={300}
        data={data}
        dataKey='label'
        type='stacked'
        withLegend
        series={[
          { name: 'current', label: 'Hiện tại', color: 'indigo.6' },
          { name: 'previous', label: 'Kỳ trước', color: 'gray.6' }
        ]}
      />
    </Card>
  );
};
