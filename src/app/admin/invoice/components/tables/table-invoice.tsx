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
import { IconDumpling, IconMeat, IconMoneybag, IconMushroomFilled } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { DeleteInvoiceButton, UpdateInvoiceButton, ViewInvoiceButton } from '~/app/admin/invoice/components/button';
import { SendOrderButton } from '~/app/admin/order/components/button';
import CustomPagination from '~/components/common/pagination';
import PageSizeSelector from '~/components/common/per-page';
import InvoiceToPrint from '~/components/domain/invoice-to-print';
import { CommonSkeleton } from '~/components/loading/loading-skeleton';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/utils/format';
import { renderShortId } from '~/lib/utils/render-short-id';
import { FindInvoice } from '~/shared/types/trpc/invoice.types';
import { api } from '~/trpc/react';

export default function TableInvoice() {
  const searchParams = useSearchParams();

  const s = searchParams.get('s') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') ?? '5';

  const { data: dataClient, isLoading } = api.Invoice.find.useQuery({ page: +page, limit: +limit, s });
  const { data: summary } = api.Invoice.admin.getSummary.useQuery();

  const currentItems = dataClient?.invoices || [];
  const dataFilter = useMemo(() => {
    if (!summary) return [];

    const byStatusMap = new Map(summary.byStatus.map(b => [b.status, b]));

    const byCurrencyArr = summary.byCurrency.map(b => ({
      label: b.currency?.toUpperCase(),
      value: b.count ?? 0,
      icon: IconMoneybag,
      color: '#228AE5'
    }));

    return [
      {
        label: 'Hoàn thành',
        value: byStatusMap.get('PAID')?.count ?? 0,
        icon: IconMeat,
        color: '#446DAE'
      },
      {
        label: 'Đang chờ ',
        value: byStatusMap.get('DRAFT')?.count ?? 0,
        icon: IconDumpling,
        color: '#499764'
      },
      {
        label: 'Đã hủy',
        value: byStatusMap.get('CANCELLED')?.count ?? 0,
        icon: IconMushroomFilled,
        color: '#C0A453'
      },
      ...byCurrencyArr
    ];
  }, [summary]);

  const utils = api.useUtils();
  useEffect(() => {
    if (dataClient?.pagination.hasNext) {
      void utils.Invoice.find.prefetch({ page: +page + 1, limit: +limit, s });
    }
  }, [page]);

  return (
    <>
      <SimpleGrid cols={5}>
        {dataFilter.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card style={{ backgroundColor: item.color + 10 }} shadow='md' pos={'relative'} key={index} p={'md'}>
              <Flex align={'center'} gap={'md'}>
                <ActionIcon variant='light' size={'xl'} color={item.color}>
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
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <CommonSkeleton.Table count={5} />
                </Table.Td>
              </Table.Tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((row: FindInvoice['invoices'][number], index: number) => (
                <Table.Tr key={row.id + index}>
                  <Table.Td>
                    <Text fw={700} size='sm' c='blue'>
                      {row.invoiceNumber}
                    </Text>
                  </Table.Td>

                  <Table.Td>
                    <Text size='sm'>{renderShortId('HD', 6, row?.id)}</Text>
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
                      {formatPriceLocaleVi(row.totalAmount)}
                    </Text>
                  </Table.Td>

                  <Table.Td>
                    <Badge
                      variant='light'
                      color={row.status === 'PAID' ? 'green' : row.status === 'DRAFT' ? 'yellow' : 'red'}
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
                        <InvoiceToPrint orderId={row?.order?.id || ''} />
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
        <CustomPagination totalPages={dataClient?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
