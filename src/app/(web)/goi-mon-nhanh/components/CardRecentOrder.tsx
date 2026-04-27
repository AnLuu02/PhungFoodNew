'use client';

import { Badge, Box, Button, Card, Divider, Group, Stack, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { OrderStatus } from '@prisma/client';
import { IconCalendarEvent, IconPackage, IconReceipt } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getStatusInfo } from '~/lib/FuncHandler/status-order';

export default function CardRecentOrder({ order }: { order: any }) {
  const [_, setCart] = useLocalStorage<any>({ key: 'cart', defaultValue: [] });
  const [loading, setLoading] = useState(false);
  const statusInfo = useMemo(() => {
    return getStatusInfo(order?.status || OrderStatus.CANCELLED);
  }, [order]);
  return (
    <>
      <Card
        bg={statusInfo.color + 10}
        withBorder
        shadow='sm'
        key={order.id}
        className='bg-white transition-shadow hover:shadow-md dark:bg-dark-card'
        padding='lg'
      >
        <Stack gap='sm'>
          <Group justify='space-between' align='center'>
            <Group gap='xs'>
              <IconReceipt size={20} className='text-gray-500' />
              <Text className='text-base' fw={700}>
                {order?.id?.slice(-8).toUpperCase() || 'ĐANG CẬP NHẬT'}
              </Text>
            </Group>
            <Badge color={statusInfo.color} variant='light' radius='sm'>
              {statusInfo.label || 'Đang cập nhật'}
            </Badge>
          </Group>

          <Divider variant='dashed' color='gray.3' />

          <Box className='grid grid-cols-2 gap-4 py-2'>
            <Group gap='sm' wrap='nowrap'>
              <Box className='flex h-10 w-10 items-center justify-center rounded-full'>
                <IconCalendarEvent size={18} className='text-gray-500' />
              </Box>
              <Box>
                <Text size='xs' c='dimmed'>
                  Ngày đặt
                </Text>
                <Text size='sm' fw={600}>
                  {formatDateViVN(order?.createdAt || new Date())}
                </Text>
              </Box>
            </Group>

            <Group gap='sm' wrap='nowrap'>
              <Box className='flex h-10 w-10 items-center justify-center rounded-full'>
                <IconPackage size={18} className='text-gray-500' />
              </Box>
              <Box>
                <Text size='xs' c='dimmed'>
                  Số lượng
                </Text>
                <Text size='sm' fw={600}>
                  {order?.orderItems?.length || 0} sản phẩm
                </Text>
              </Box>
            </Group>
          </Box>

          <Box className='dark:bg-dark-body rounded-lg p-3' bg={statusInfo.color + 20}>
            <Group justify='space-between' mb={4}>
              <Text size='sm' c='dimmed' fw={600}>
                Tạm tính
              </Text>
              <Text size='sm' fw={500}>
                {formatPriceLocaleVi((order?.finalTotal || 0) + (order?.discountAmount || 0))}
              </Text>
            </Group>
            <Group justify='space-between' mb={4}>
              <Text size='sm' c='dimmed' fw={600}>
                Đã giảm
              </Text>
              <Text size='sm' fw={500} className='text-green-600'>
                -{formatPriceLocaleVi(order?.discountAmount || 0)}
              </Text>
            </Group>
            <Divider my='xs' />
            <Group justify='space-between'>
              <Text size='sm' fw={700}>
                Tổng đơn
              </Text>
              <Text size='lg' fw={800} className='text-mainColor'>
                {formatPriceLocaleVi(order?.finalTotal || 0)}
              </Text>
            </Group>
          </Box>

          <Group justify='flex-end' gap='sm' mt='xs'>
            <Button
              loading={loading}
              variant='outline'
              onClick={() => {
                setLoading(true);
                setCart(
                  order?.orderItems?.map((item: any) => ({
                    ...item?.product,
                    quantity: item?.quantity || 1,
                    note: item?.note || ''
                  }))
                );
                window.location.href = `/gio-hang`;
              }}
            >
              Tùy chỉnh
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true);
                window.location.href = `/thanh-toan/${order?.id}`;
              }}
            >
              Đặt lại đơn hàng
            </Button>
          </Group>
        </Stack>
      </Card>
    </>
  );
}
