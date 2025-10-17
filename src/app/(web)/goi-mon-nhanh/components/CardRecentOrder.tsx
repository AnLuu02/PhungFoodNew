'use client';

import { Box, Button, Card, Stack, Text } from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { useMemo, useState } from 'react';
import BButton from '~/components/Button/Button';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getStatusInfo } from '~/lib/func-handler/status-order';

export default function CardRecentOrder({ order }: { order: any }) {
  const [selectedOrder, setSelectedOrder] = useState<{ type: 'edit' | 'reorder'; data: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const statusInfo = useMemo(() => {
    return getStatusInfo(order?.status || OrderStatus.CANCELLED);
  }, [order]);
  return (
    <>
      <Card withBorder radius={'md'} key={order.id} className='overflow-hidden bg-gray-100 dark:bg-dark-card'>
        <Stack>
          <Box>
            <Box className='flex items-start justify-between'>
              <Box className='flex-1'>
                <Text lineClamp={1} className='text-lg' fw={700}>
                  {order?.id || 'Đang cập nhật'}
                </Text>
                <Text lineClamp={2} size='sm'>
                  Trạng thái: <b> {statusInfo.label || 'Đang cập nhật'}</b>
                </Text>
              </Box>
            </Box>
          </Box>

          <Box className='flex items-center justify-between'>
            <Box className='flex items-center gap-2'>
              <Text fw={700}>
                Tổng đơn: <b className='text-mainColor'>{formatPriceLocaleVi(order?.finalTotal || 0)}</b>
              </Text>
            </Box>
            <Text fw={700}>
              Đã giảm: <b className='text-mainColor'>{formatPriceLocaleVi(order?.discountAmount || 0)}</b>
            </Text>{' '}
          </Box>
          <Box className='grid grid-cols-2 gap-4 text-sm'>
            <Box>
              <Text size='sm'>Đặt ngày</Text>
              <Text size='sm' fw={700}>
                {formatDateViVN(order?.createdAt || new Date())}
              </Text>
            </Box>
            <Box>
              <Text size='sm'>Số lượng sản phẩm</Text>
              <Text size='sm' fw={700}>
                {order?.orderItems?.length || 0} sản phẩm
              </Text>
            </Box>
          </Box>
          <Box className='flex justify-end gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                setSelectedOrder({ type: 'edit', data: order });
              }}
              styles={{
                root: {
                  border: '1px solid '
                }
              }}
              classNames={{
                root: `!rounded-md !border-gray-300 !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
              }}
            >
              Tùy chỉnh
            </Button>
            <BButton
              size='sm'
              radius='md'
              children='Đặt lại đơn hàng'
              loading={loading}
              onClick={() => {
                setLoading(true);
                window.location.href = `/thanh-toan/${order?.id}`;
              }}
            />
          </Box>
        </Stack>
      </Card>
    </>
  );
}
