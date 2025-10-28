'use client';

import { PieChart } from '@mantine/charts';
import {
  Box,
  Card,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title
} from '@mantine/core';
import { useMemo } from 'react';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getStatusInfo } from '~/lib/FuncHandler/status-order';
import { LocalOrderStatus } from '~/lib/ZodSchema/enum';
const colors = ['blue.6', 'green.6', 'orange.6', 'red.6', 'gray.6'];
export default function ReportRevenuePageClient({
  topUsers,
  revenueByCategories,
  revenueByOrderStatus,
  topProducts,
  distributionProducts
}: any) {
  const revenueByCategoriesRender = useMemo(() => {
    const revenueByCategoriesArr = Object.entries(revenueByCategories || {});
    return revenueByCategoriesArr.map(([label, value]: any, index: number) => {
      return {
        name: label,
        value: value,
        color: colors[index] || 'gray.6'
      };
    });
  }, [revenueByCategories]);
  const distributionProductsRender = useMemo(() => {
    const distributionProductsArr = Object.entries(distributionProducts || {});
    return distributionProductsArr.map(([label, value]: any, index: number) => {
      return {
        name: label,
        value: value,
        color: colors[index] || 'gray.6'
      };
    });
  }, [revenueByCategories]);
  const revenueByOrderStatusRender = useMemo(() => {
    const revenueByOrderStatusArr = Object.entries(LocalOrderStatus || {});
    return revenueByOrderStatusArr.map(([label]: any, index: number) => {
      const existed = revenueByOrderStatus.find((item: any) => item.status === label);
      if (existed) {
        return {
          name: getStatusInfo(label).label,
          value: existed.profit || 0,
          color: colors[index] || 'gray.6'
        };
      }
      return {
        name: getStatusInfo(label).label,
        value: 0,
        color: colors[index] || 'gray.6'
      };
    });
  }, [revenueByOrderStatus]);

  return (
    <>
      <Stack>
        <Paper radius={'lg'} withBorder shadow='md' py={'xl'} px={'xl'}>
          <Title order={4} mb={'lg'} className='font-quicksand'>
            Biểu đồ doanh thu
          </Title>
          <Grid>
            <GridCol span={12} className='h-fit'>
              <Card withBorder shadow='sm' radius={'lg'}>
                <Title order={5} mb={'md'} className='font-quicksand'>
                  Top khách hàng
                </Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Khách hàng</Table.Th>
                      <Table.Th>Tổng chi</Table.Th>
                      <Table.Th>Đơn hàng</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {topUsers?.length > 0 ? (
                      topUsers.map((customer: any, index: number) => (
                        <Table.Tr key={index}>
                          <Table.Td>{customer?.user?.name || 'Đang cập nhật'}</Table.Td>
                          <Table.Td>{formatPriceLocaleVi(customer?.totalSpent || 0)}</Table.Td>
                          <Table.Td>{customer?.totalOrders || 0}</Table.Td>
                        </Table.Tr>
                      ))
                    ) : (
                      <>
                        <Table.Tr>
                          <Table.Td colSpan={3} className='bg-gray-100 text-center dark:bg-dark-card'>
                            <Text size='md' c='dimmed'>
                              Hôm nay chưa có thanh toán nào được thực hiện./
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      </>
                    )}
                  </Table.Tbody>
                </Table>
              </Card>
              <Divider my={'md'} />
              <Card withBorder shadow='sm' radius={'lg'}>
                <Title order={5} mb={'md'} className='font-quicksand'>
                  Top sản phẩm
                </Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Tên</Table.Th>
                      <Table.Th>Danh mục</Table.Th>
                      <Table.Th>Giá</Table.Th>
                      <Table.Th>Đã bán</Table.Th>
                      <Table.Th>Tổng thu</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {topProducts?.length > 0 ? (
                      topProducts.map((product: any, index: number) => (
                        <Table.Tr key={index}>
                          <Table.Td>{product?.product?.name || 'Đang cập nhật'}</Table.Td>
                          <Table.Td>{product?.product?.subCategory?.name || 'Đang cập nhật'}</Table.Td>
                          <Table.Td>{formatPriceLocaleVi(product?.product?.price || 0)}</Table.Td>
                          <Table.Td>{product?.soldQuantity || 0}</Table.Td>
                          <Table.Td>{formatPriceLocaleVi(product?.profit || 0)}</Table.Td>
                        </Table.Tr>
                      ))
                    ) : (
                      <>
                        <Table.Tr>
                          <Table.Td colSpan={5} className='bg-gray-100 text-center dark:bg-dark-card'>
                            <Text size='md' c='dimmed'>
                              Hôm nay chưa có thanh toán nào được thực hiện./
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      </>
                    )}
                  </Table.Tbody>
                </Table>
              </Card>
            </GridCol>
            <GridCol span={12} className='h-fit'>
              <SimpleGrid cols={2}>
                <Card withBorder shadow='sm' radius={'lg'}>
                  <Title order={5} mb={'md'} className='font-quicksand'>
                    Doanh thu theo danh mục
                  </Title>
                  <Group align='center' gap={'xl'}>
                    <PieChart
                      data={revenueByCategoriesRender}
                      withLabels
                      withTooltip
                      size={200}
                      valueFormatter={value => formatPriceLocaleVi(value)}
                    />
                    <Stack>
                      {colors.map((color, index) => (
                        <Group key={index}>
                          <Paper w={50} h={20} bg={color}></Paper>
                          <Text size='xs' fw={600}>
                            {revenueByCategoriesRender?.[index]?.name || 'Đang cập nhật'}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  </Group>
                </Card>
                <Card withBorder shadow='sm' radius={'lg'}>
                  <Title order={5} mb={'md'} className='font-quicksand'>
                    Doanh thu theo trang thái đơn hàng
                  </Title>
                  <Flex align='center' gap={'xl'}>
                    <PieChart
                      data={revenueByOrderStatusRender}
                      withLabels
                      withTooltip
                      size={200}
                      valueFormatter={value => formatPriceLocaleVi(value)}
                    />
                    <Stack>
                      {colors.map((color, index) => (
                        <Flex key={index} gap={'xs'} align={'center'}>
                          <Paper w={50} h={20} bg={color}></Paper>
                          <Text size='xs' fw={600} flex={1}>
                            {revenueByOrderStatusRender?.[index]?.name || 'Đang cập nhật'}
                          </Text>
                        </Flex>
                      ))}
                    </Stack>
                  </Flex>
                </Card>
              </SimpleGrid>
            </GridCol>
            <GridCol span={12} className='h-fit'>
              <SimpleGrid cols={2}>
                <Card withBorder shadow='sm' radius={'lg'}>
                  <Box>
                    <Title order={5} className='font-quicksand'>
                      Phân bổ sản phẩm
                    </Title>
                    <Text size='sm' c={'dimmed'}>
                      Theo danh mục
                    </Text>
                  </Box>
                  <Flex align='center' gap={'xl'}>
                    <PieChart data={distributionProductsRender} withLabels withTooltip size={200} />
                    <Stack>
                      {colors.map((color, index) => (
                        <Group key={index}>
                          <Paper w={50} h={20} bg={color}></Paper>
                          <Text size='xs' fw={600}>
                            {distributionProductsRender?.[index]?.name || 'Đang cập nhật'}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  </Flex>
                </Card>
                <Card withBorder shadow='sm' radius={'lg'}>
                  <Title order={5} mb={'md'} className='font-quicksand'>
                    Top sản phẩm
                  </Title>
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Tên</Table.Th>
                        <Table.Th>Danh mục</Table.Th>
                        <Table.Th>Giá</Table.Th>
                        <Table.Th>Đã bán</Table.Th>
                        <Table.Th>Tổng thu</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {topProducts?.length > 0 ? (
                        topProducts.map((product: any, index: number) => (
                          <Table.Tr key={index}>
                            <Table.Td>{product?.product?.name || 'Đang cập nhật'}</Table.Td>
                            <Table.Td>{product?.product?.subCategory?.name || 'Đang cập nhật'}</Table.Td>
                            <Table.Td>{formatPriceLocaleVi(product?.product?.price || 0)}</Table.Td>
                            <Table.Td>{product?.soldQuantity || 0}</Table.Td>
                            <Table.Td>{formatPriceLocaleVi(product?.profit || 0)}</Table.Td>
                          </Table.Tr>
                        ))
                      ) : (
                        <>
                          <Table.Tr>
                            <Table.Td colSpan={5} className='bg-gray-100 text-center dark:bg-dark-card'>
                              <Text size='md' c='dimmed'>
                                Hôm nay chưa có thanh toán nào được thực hiện./
                              </Text>
                            </Table.Td>
                          </Table.Tr>
                        </>
                      )}
                    </Table.Tbody>
                  </Table>
                </Card>
              </SimpleGrid>
            </GridCol>
          </Grid>
        </Paper>
      </Stack>
    </>
  );
}
