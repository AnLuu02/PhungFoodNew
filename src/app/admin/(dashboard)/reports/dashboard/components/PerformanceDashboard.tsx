'use client';

import { RadarChart } from '@mantine/charts';
import { ActionIcon, Box, Card, Flex, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconUserPlus } from '@tabler/icons-react';
import { formatDateViVN, formatMoneyShort } from '~/lib/func-handler/Format';
import { ChangeRate } from '../../components/ChangeRate';
export function PerformanceDashboard({ dataRevenue, period, startTimeToNum, endTimeToNum }: any) {
  return (
    <>
      <Stack>
        <Card withBorder shadow='sm' radius={'md'}>
          <Flex align={'center'} justify={'space-between'} mb={'xl'}>
            <Box>
              <Title order={5} className='font-quicksand'>
                Radar hiệu suất tổng thể
              </Title>
              <Text size='sm' c={'dimmed'}>
                Số lượng người dùng đăng kí mới{' '}
                <b>
                  {period >= 0
                    ? !period
                      ? 'hôm nay'
                      : `từ ${formatDateViVN(startTimeToNum)} đến ${formatDateViVN(endTimeToNum)}`
                    : ' kể từ đơn hàng đầu tiên'}
                </b>
              </Text>
            </Box>
            <ActionIcon variant='light' size={'lg'}>
              <IconUserPlus size={16} />
            </ActionIcon>
          </Flex>
          <RadarChart
            h={300}
            data={[
              {
                product: 'Apples',
                sales: 120
              },
              {
                product: 'Oranges',
                sales: 98
              },
              {
                product: 'Tomatoes',
                sales: 86
              },
              {
                product: 'Grapes',
                sales: 99
              },
              {
                product: 'Bananas',
                sales: 85
              },
              {
                product: 'Lemons',
                sales: 65
              }
            ]}
            dataKey='product'
            withPolarRadiusAxis
            series={[{ name: 'sales', color: 'blue.4', opacity: 0.2 }]}
          />
        </Card>
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
      </Stack>
    </>
  );
}
