'use client';
import { ActionIcon, Box, Card, Flex, Group, Highlight, SimpleGrid, Table, Text, Title } from '@mantine/core';
import { IconBrandCashapp, IconDumpling, IconMeat, IconMoneybag, IconMushroomFilled } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { SendOrderButton } from '~/app/admin/order/components/Button';
import PageSizeSelector from '~/components/Admin/Perpage';
import InvoiceToPrint from '~/components/InvoceToPrint';
import CustomPagination from '~/components/Pagination';
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
    const summary = allDataClient.data.reduce(
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
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                ID
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Đơn hàng
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Người tạo
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Mã hóa đơn
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Trạng thái
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Tiền tệ
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Mã số thuế
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Ngày tạo
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Thao tác
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.id}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.orderId}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.saler.name}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.invoiceNumber}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.status}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.currency}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.taxCode}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>{formatDateViVN(row.createdAt)}</Table.Td>
                  <Table.Td className='text-sm'>
                    <Group>
                      <ViewInvoiceButton data={row} />
                      <UpdateInvoiceButton id={row.id} />
                      <DeleteInvoiceButton id={row.id} />
                      <InvoiceToPrint id={row.id} />
                      <SendOrderButton id={row.id} />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={9} className='bg-gray-100 text-center dark:bg-dark-card'>
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
