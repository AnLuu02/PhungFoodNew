import { PieChart, PieChartCell } from '@mantine/charts';
import { Card, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { EmptyChart } from './EmptyChart';
const colors = ['blue.6', 'green.6', 'orange.6', 'red.6', 'gray.6'];

export const PieChartBase = ({
  title,
  loading,
  dataChart,
  valueFormatter = value => formatPriceLocaleVi(value)
}: {
  title: string;
  loading: boolean;
  dataChart?: PieChartCell[];
  valueFormatter?: ((value: number) => string) | undefined;
}) => {
  return (
    <Card withBorder shadow='sm'>
      <Title order={5} mb={'md'} className='font-quicksand'>
        {title}
      </Title>
      {loading ? (
        <>
          <CommonSkeleton.Chart />
        </>
      ) : dataChart && dataChart?.length > 0 ? (
        <Group align='center' gap={'xl'}>
          <PieChart data={dataChart} withLabels withTooltip size={200} valueFormatter={valueFormatter} />
          <Stack>
            {colors.map((color, index) => (
              <Group key={index}>
                <Paper w={50} h={20} bg={color}></Paper>
                <Text size='xs' fw={600}>
                  {dataChart?.[index]?.name || 'Đang cập nhật'}
                </Text>
              </Group>
            ))}
          </Stack>
        </Group>
      ) : (
        <EmptyChart />
      )}
    </Card>
  );
};
