import {
  ActionIcon,
  Badge,
  Card,
  CardSection,
  Group,
  ScrollArea,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  Tooltip
} from '@mantine/core';
import { IconEye, IconPencil } from '@tabler/icons-react';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getStatusInfo } from '~/lib/func-handler/status-order';

interface Order {
  id: string;
  customer: string;
  date: string;
  finalTotal: string;
  originalTotal?: string;
  discountAmount?: string;
  status: string;
}

interface RecentOrdersProps {
  orders?: any[];
}

const mockOrders: Order[] = [
  { id: '#ORD-5531', customer: 'Nguyễn Văn A', date: '2024-03-15', finalTotal: '450.000đ', status: 'Completed' },
  { id: '#ORD-5530', customer: 'Trần Thị B', date: '2024-03-15', finalTotal: '862.500đ', status: 'UNPAID' },
  { id: '#ORD-5529', customer: 'Lê Văn C', date: '2024-03-14', finalTotal: '328.000đ', status: 'Completed' },
  { id: '#ORD-5528', customer: 'Phạm Thị D', date: '2024-03-14', finalTotal: '1.240.000đ', status: 'Shipping' },
  { id: '#ORD-5527', customer: 'Hoàng Văn E', date: '2024-03-13', finalTotal: '657.500đ', status: 'Cancelled' }
];

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const displayOrders = orders?.slice(0, 5) || mockOrders;

  return (
    <Card withBorder padding='md' radius='md' className='h-full'>
      <CardSection withBorder inheritPadding py='xs' className='bg-gray-50'>
        <Group justify='space-between'>
          <Text fw={700} className='text-gray-800 dark:text-dark-text'>
            Đơn đặt hàng gần đây
          </Text>
          <Text size='sm' c='dimmed' className='text-gray-600 dark:text-dark-text'>
            Hôm nay
          </Text>
        </Group>
      </CardSection>

      <ScrollArea className='h-80'>
        <Table striped highlightOnHover withTableBorder withColumnBorders className='min-w-full'>
          <TableThead>
            <TableTr className='bg-gray-50'>
              <TableTh className='font-semibold text-gray-700 dark:text-dark-text'>Mã đơn</TableTh>
              <TableTh className='font-semibold text-gray-700 dark:text-dark-text'>Khách hàng</TableTh>
              <TableTh className='font-semibold text-gray-700 dark:text-dark-text'>Ngày đặt</TableTh>
              <TableTh className='font-semibold text-gray-700 dark:text-dark-text'>Tổng tiền</TableTh>
              <TableTh className='font-semibold text-gray-700 dark:text-dark-text'>Trạng thái</TableTh>
              <TableTh className='font-semibold text-gray-700 dark:text-dark-text'>Thao tác</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {displayOrders.map(order => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <TableTr key={order.id} className='transition-colors hover:bg-mainColor/10'>
                  <TableTd w={100} style={{ maxWidth: 100, overflow: 'hidden' }}>
                    <Tooltip label={order.id} withArrow>
                      <span className='block cursor-help truncate font-medium text-blue-600'>{order.id}</span>
                    </Tooltip>
                  </TableTd>
                  <TableTd className='text-gray-800 dark:text-dark-text'>{order.user?.name}</TableTd>
                  <TableTd className='text-gray-600 dark:text-dark-text'>{formatDateViVN(order.createdAt)}</TableTd>
                  <TableTd className='font-medium text-mainColor'>{formatPriceLocaleVi(order.total)}</TableTd>
                  <TableTd>
                    <Badge color={statusInfo.color} variant='light' className='font-medium'>
                      {order.status}
                    </Badge>
                  </TableTd>
                  <TableTd>
                    <Group gap='xs'>
                      <ActionIcon size='sm' variant='subtle' className='text-blue-600 hover:bg-blue-50'>
                        <IconEye size='1rem' stroke={1.5} />
                      </ActionIcon>
                      <ActionIcon size='sm' variant='subtle' className='text-mainColor hover:bg-green-50'>
                        <IconPencil size='1rem' stroke={1.5} />
                      </ActionIcon>
                    </Group>
                  </TableTd>
                </TableTr>
              );
            })}
          </TableTbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
