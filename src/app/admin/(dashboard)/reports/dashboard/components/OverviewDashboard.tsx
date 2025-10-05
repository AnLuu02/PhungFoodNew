'use client';

import { BarChart, LineChart } from '@mantine/charts';
import { ActionIcon, Box, Card, Flex, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconRotateClockwise, IconUserPlus } from '@tabler/icons-react';
import { formatDateViVN, formatMoneyShort, formatPriceLocaleVi } from '~/lib/func-handler/Format';
export function OverviewDashboard({ dataRevenue, period, startTimeToNum, endTimeToNum, dataOverviewChart }: any) {
  return (
    <>
      <Stack>
        <SimpleGrid cols={4}>
          {dataRevenue.map((item: any, index: number) => {
            const IconR = item.icon;
            return (
              <Card key={index} radius={'lg'} withBorder shadow='md' py={'lg'} style={{ backgroundColor: item.color }}>
                <Flex align={'center'} justify={'space-between'}>
                  <Stack gap={3}>
                    <Text size='sm' fw={700} className='text-white'>
                      {item.label}
                    </Text>
                    <Title className='font-quicksand text-white' order={3}>
                      {formatMoneyShort(item.currentValue)}
                    </Title>
                  </Stack>
                  <ActionIcon w={50} h={50} color={'black'} variant='light' radius={'md'}>
                    <IconR size={24} color={'white'} />
                  </ActionIcon>
                </Flex>
              </Card>
            );
          })}
        </SimpleGrid>
        <SimpleGrid cols={4}>
          {dataRevenue.map((item: any, index: number) => {
            const IconR = item.icon;
            return (
              <Card key={index} radius={'lg'} withBorder shadow='md' py={'lg'}>
                <Flex align={'center'} justify={'space-between'}>
                  <Stack gap={3}>
                    <Text size='sm' fw={700}>
                      {item.label}
                    </Text>
                    <Title className='font-quicksand' order={3}>
                      {formatMoneyShort(item.currentValue)}
                    </Title>
                  </Stack>
                  <ActionIcon w={50} h={50} color={item.color} variant='light' radius={'md'}>
                    <IconR size={24} color={item.color} />
                  </ActionIcon>
                </Flex>
              </Card>
            );
          })}
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <Card radius={'md'} withBorder shadow='md'>
            <Flex align={'center'} justify={'space-between'} mb={'xl'}>
              <Box>
                <Title order={5} className='font-quicksand'>
                  Doanh thu theo thời gian
                </Title>
                <Text size='sm' className='text-white'>
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
          </Card>
          <Card withBorder shadow='sm' radius={'md'}>
            <Flex align={'center'} justify={'space-between'} mb={'xl'}>
              <Box>
                <Title order={5} className='font-quicksand'>
                  Người dùng mới
                </Title>
                <Text size='sm' className='text-white'>
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
            <BarChart
              h={300}
              data={dataOverviewChart.users}
              dataKey='label'
              type='stacked'
              series={[{ name: 'users', label: 'Người dùng mới', color: 'violet.6' }]}
              gridAxis='xy'
            />
          </Card>
        </SimpleGrid>
      </Stack>
    </>
  );
}
