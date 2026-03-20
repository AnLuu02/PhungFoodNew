'use client';
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Flex,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { IconBrandCashapp, IconDumpling, IconMeat, IconMoneybag, IconMushroomFilled } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { SendOrderButton } from '~/app/admin/order/components/Button';
import InvoiceToPrint from '~/components/InvoceToPrint';
import CustomPagination from '~/components/Pagination';
import PageSizeSelector from '~/components/Perpage';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { api } from '~/trpc/react';
import { DeleteInvoiceButton, UpdateInvoiceButton, ViewInvoiceButton } from '../Button';

export default function TableInvoice({ s, data, allData }: { s: string; data: any; allData: any }) {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const { data: dataClient } = api.Invoice.find.useQuery({ skip: +page, take: +limit, s }, { initialData: data });

  const { data: allDataClient } = api.Invoice.getAll.useQuery(undefined, { initialData: allData });
  const currentItems = dataClient?.invoices || [];
  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];
    const summary = allDataClient.reduce(
      (acc: any, item: any) => {
        item.status === 'PAID' && (acc['PAID'] += 1);
        item.status === 'PENDING' && (acc['PENDING'] += 1);
        item.status === 'CANCELLED' && (acc['CANCELLED'] += 1);
        item.currency !== 'VND' && (acc['ForeignCurrency'] += 1);
        item.currency === 'VND' && (acc['VND'] += 1);
        return acc;
      },
      { PAID: 0, PENDING: 0, CANCELLED: 0, ForeignCurrency: 0, VND: 0 }
    );
    return [
      {
        label: 'Hoàn thành',
        value: summary['PAID'],
        icon: IconMeat,
        color: '#446DAE'
      },
      {
        label: 'Đang chờ ',
        value: summary['PENDING'],
        icon: IconDumpling,
        color: '#499764'
      },
      {
        label: 'Đã hủy',
        value: summary['CANCELLED'],
        icon: IconMushroomFilled,
        color: '#C0A453'
      },
      {
        label: 'Việt Nam đồng',
        value: summary['VND'],
        icon: IconBrandCashapp,
        color: '#CA041D'
      },
      {
        label: 'Ngoại tệ',
        value: summary['ForeignCurrency'],
        icon: IconMoneybag,
        color: '#228AE5'
      }
    ];
  }, [allDataClient]);

  return (
    <>
      <SimpleGrid cols={5}>
        {dataFilter?.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card
              style={{ backgroundColor: item.color + 10 }}
              shadow='md'
              radius={'lg'}
              pos={'relative'}
              key={index}
              p={'md'}
            >
              <Flex align={'center'} gap={'md'}>
                <ActionIcon variant='light' size={'xl'} radius={'md'} color={item.color}>
                  <IconR size={20} />
                </ActionIcon>
                <Box>
                  <Title order={6} className='font-quicksand'>
                    {item.label}
                  </Title>
                  <Title order={3} className='font-quicksand'>
                    {item.value}
                  </Title>
                </Box>
              </Flex>
            </Card>
          );
        })}
      </SimpleGrid>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders verticalSpacing='sm'>
          <Table.Thead className='bg-gray-50 text-sm uppercase leading-normal dark:bg-dark-card'>
            <Table.Tr>
              <Table.Th w={150}>Mã hóa đơn</Table.Th>
              <Table.Th>Đơn hàng</Table.Th>
              <Table.Th>Khách hàng</Table.Th>
              <Table.Th>Tổng tiền</Table.Th>
              <Table.Th w={120}>Trạng thái</Table.Th>
              <Table.Th w={120}>Phương thức</Table.Th>
              <Table.Th w={150}>Ngày phát hành</Table.Th>
              <Table.Th className='text-center'>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row: any, index: number) => (
                <Table.Tr key={row.id}>
                  <Table.Td>
                    <Text fw={700} size='sm' c='blue'>
                      {row.invoiceNumber}
                    </Text>
                  </Table.Td>

                  <Table.Td>
                    <Text size='sm'>#{row?.orderId?.slice(-6)?.toUpperCase() || 'Đang cập nhật'}</Text>
                  </Table.Td>

                  <Table.Td>
                    <Stack gap={0}>
                      <Text size='sm' fw={500}>
                        {row.buyerName}
                      </Text>
                      <Text size='xs' c='dimmed'>
                        {row.buyerPhone}
                      </Text>
                    </Stack>
                  </Table.Td>

                  <Table.Td>
                    <Text size='sm' fw={700} c='red'>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: row.currency }).format(
                        row.totalAmount
                      )}
                    </Text>
                  </Table.Td>

                  <Table.Td>
                    <Badge
                      variant='light'
                      color={row.status === 'PAID' ? 'green' : row.status === 'PENDING' ? 'yellow' : 'red'}
                      fullWidth
                    >
                      {row.status}
                    </Badge>
                  </Table.Td>

                  <Table.Td>
                    <Text size='xs' fw={500}>
                      {row.paymentMethod}
                    </Text>
                  </Table.Td>

                  <Table.Td>
                    <Text size='sm'>{formatDateViVN(row.createdAt)}</Text>
                  </Table.Td>

                  <Table.Td>
                    <Group justify='center' gap='xs' wrap='nowrap'>
                      <Tooltip label='Xem chi tiết'>
                        <ViewInvoiceButton data={row} />
                      </Tooltip>
                      <Tooltip label='Sửa'>
                        <UpdateInvoiceButton id={row.id} />
                      </Tooltip>
                      <Tooltip label='In hóa đơn'>
                        <InvoiceToPrint id={row?.order?.id} />
                      </Tooltip>
                      <Tooltip label='Gửi mail'>
                        <SendOrderButton id={row?.order?.id} />
                      </Tooltip>
                      <Tooltip label='Xóa'>
                        <DeleteInvoiceButton id={row.id} />
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8} className='bg-gray-100 text-center dark:bg-dark-card' py={40}>
                  <Text size='md' c='dimmed'>
                    Không có bản ghi phù hợp.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Group justify='space-between' align='center' my={'md'}>
        <PageSizeSelector />
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
