'use client';

import { Badge, Box, Button, Card, Center, Flex, Text, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconArrowBack, IconCreditCard } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { statusConfig } from '~/lib/func-handler/status-order';

interface OrderStatusPageProps {
  customerName: string;
  orderId?: string;
  amount?: number;
  status:
    | 'COMPLETED'
    | 'UNPAID'
    | 'PENDING'
    | 'CONFIRMED'
    | 'SHIPPING'
    | 'CANCELLED'
    | 'ERROR'
    | 'PAYMENT_FAILED'
    | 'NOT_FOUND';
  customTitle?: string;
  customMessage?: string;
  onRetryPayment?: () => void;
  onBackToHome?: () => void;
  onReturnHome?: () => void;
}

export function OrderStatusPage({
  customerName,
  orderId,
  amount,
  status,
  customTitle,
  customMessage,
  onRetryPayment,
  onBackToHome,
  onReturnHome
}: OrderStatusPageProps) {
  const [, , resetVoucher] = useLocalStorage<any[]>({ key: 'applied-vouchers', defaultValue: [] });

  useEffect(() => {
    const isSuccessState = ['SHIPPING', 'COMPLETED', 'CONFIRMED'].includes(status);
    if (isSuccessState) {
      resetVoucher();
    }
  }, []);

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  const isErrorState = ['ERROR', 'PAYMENT_FAILED', 'CANCELLED', 'NOT_FOUND'].includes(status);

  const displayTitle =
    customTitle ||
    (isErrorState
      ? status === 'PAYMENT_FAILED'
        ? 'Thanh toán thất bại'
        : status === 'CANCELLED'
          ? 'Đơn hàng đã hủy'
          : status === 'NOT_FOUND'
            ? 'Đơn hàng không tồn tại'
            : 'Có lỗi xảy ra'
      : 'Đơn hàng đã được thanh toán');

  const displayMessage = customMessage || currentStatus.message;

  const handleBackToHome = onBackToHome || onReturnHome || (() => {});
  console.log(currentStatus);

  return (
    <Card
      withBorder
      radius={'lg'}
      shadow='xl'
      className={`mx-auto w-full max-w-md`}
      style={{
        backgroundColor: currentStatus.color + '10'
      }}
    >
      <Box className='space-y-6 p-8 text-center'>
        <Box className='flex justify-center'>
          <Box
            className={`flex h-20 w-20 items-center justify-center rounded-full`}
            style={{ backgroundColor: currentStatus.color + '22' }}
          >
            <StatusIcon className={`h-12 w-12`} style={{ color: currentStatus.color }} />
          </Box>
        </Box>

        <Box className='space-y-2'>
          <Title order={2} className='font-quicksand text-2xl font-bold text-gray-900'>
            {displayTitle}
          </Title>
          <Text size='lg' c={'dimmed'} fw={600}>
            Chào, {customerName}
          </Text>
        </Box>

        <Center>
          <Badge
            fw={700}
            size='xl'
            className={`text-white`}
            style={{ backgroundColor: currentStatus.color }}
            leftSection={<StatusIcon className='h-5 w-5' />}
          >
            {currentStatus.label}
          </Badge>
        </Center>

        <Box className='space-y-3 text-gray-600'>
          <Text className='text-base leading-relaxed'>{displayMessage}</Text>
          {!isErrorState && !customMessage && (
            <>
              <Text size='sm'>Bạn vừa đặt hàng thành công, hàng sẽ được gửi đến bạn thời gian sớm nhất.</Text>
              <Text size='sm' className='font-medium text-green-600'>
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
              </Text>
            </>
          )}
        </Box>

        {orderId || amount ? (
          <Box className='space-y-2 rounded-lg bg-gray-50 p-3'>
            {orderId ? (
              <Box>
                <Text size='sm' c={'dimmed'}>
                  Mã đơn hàng
                </Text>
                <Text size='sm' className='font-mono font-semibold text-gray-900'>
                  {orderId}
                </Text>
              </Box>
            ) : null}
            {amount ? (
              <Flex align={'center'} justify={'center'} gap={'xs'}>
                <Text size='sm' c={'dimmed'}>
                  Số tiền:
                </Text>
                <Text size='lg' className='font-semibold text-gray-900'>
                  {formatPriceLocaleVi(amount)}
                </Text>
              </Flex>
            ) : null}
          </Box>
        ) : null}

        <Box className='space-y-3'>
          {status === 'PAYMENT_FAILED' && onRetryPayment && (
            <Button
              onClick={onRetryPayment}
              leftSection={<IconCreditCard className='h-4 w-4' />}
              className='flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 font-semibold text-white transition-colors hover:bg-red-700'
            >
              Thử thanh toán lại
            </Button>
          )}

          {status === 'UNPAID' && onRetryPayment && (
            <Button
              onClick={onRetryPayment}
              leftSection={<IconCreditCard className='h-4 w-4' />}
              className='flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 font-semibold text-white transition-colors hover:bg-red-700'
            >
              <Link href={`/thanh-toan/${orderId}`}> Tiếp tục thanh toán</Link>
            </Button>
          )}

          <Button
            onClick={handleBackToHome}
            leftSection={<IconArrowBack className='h-4 w-4' />}
            className={`w-full ${isErrorState ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} gap-2 rounded-lg font-semibold text-white transition-colors`}
          >
            Quay về trang chủ
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

export default OrderStatusPage;
