'use client';
import { LineChart } from '@mantine/charts';
import { ActionIcon, Box, Card, Flex, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconRotateClockwise } from '@tabler/icons-react';
import { formatDateViVN, formatMoneyShort, formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { ChangeRate } from '../../components/ChangeRate';
export const RevenuesDashboard = ({ dataRevenue, period, startTimeToNum, endTimeToNum, dataOverviewChart }: any) => {
  return (
    <>
      <Stack>
        <Card radius={'md'} withBorder shadow='md'>
          <Flex align={'center'} justify={'space-between'} mb={'xl'}>
            <Box>
              <Title order={5} className='font-quicksand'>
                Doanh thu theo thời gian
              </Title>
              <Text size='sm' c={'dimmed'}>
                Biểu đồ doanh thu{' '}
                <b>
                  {period >= 0
                    ? !period
                      ? 'trong hôm nay'
                      : `từ ${formatDateViVN(startTimeToNum)} đến ${formatDateViVN(endTimeToNum)}`
                    : ' kể từ đơn hàng đầu tiên'}
                </b>
              </Text>
            </Box>
            <ActionIcon variant='light' size={'lg'}>
              <IconRotateClockwise size={16} />
            </ActionIcon>
          </Flex>
          <LineChart
            h={300}
            data={dataOverviewChart.revenues}
            dataKey='label'
            series={[{ name: 'revenue', label: 'Doanh thu (VNĐ)', color: 'blue.6' }]}
            curveType='bump'
            gridAxis='xy'
            lineProps={{
              isAnimationActive: true,
              animationDuration: 400,
              animationEasing: 'ease-in-out'
            }}
            valueFormatter={value => formatPriceLocaleVi(value)}
          />
          <SimpleGrid cols={4}>
            {dataRevenue.map((item: any, index: number) => {
              const IconR = item.icon;
              return (
                <Card key={index} radius={'md'} withBorder shadow='md'>
                  <Stack gap={'xs'}>
                    <Text size='sm' fw={700} c={'dimmed'}>
                      {item.label}
                    </Text>
                    <Flex align={'center'} justify={'space-between'}>
                      <Title className='font-quicksand' order={3}>
                        {formatMoneyShort(item.currentValue)}
                      </Title>
                      <Paper
                        w={40}
                        h={40}
                        withBorder
                        className='flex items-center justify-center'
                        style={{
                          backgroundColor: item.color + '22'
                        }}
                        radius={'md'}
                      >
                        <IconR size={16} color={item.color} />
                      </Paper>
                    </Flex>

                    <ChangeRate
                      currentValue={item.currentValue}
                      previousValue={item.previousValue}
                      changeRate={item.changeRate}
                    />
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        </Card>
      </Stack>
    </>
  );
};
