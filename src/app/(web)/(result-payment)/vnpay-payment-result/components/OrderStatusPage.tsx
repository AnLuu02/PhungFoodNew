'use client';

import { Badge, Box, Button, Card, Center, Flex, Text, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import {
  IconAlertTriangle,
  IconArrowBack,
  IconCircleDashedCheck,
  IconCircleX,
  IconClock,
  IconCreditCard,
  IconTruck
} from '@tabler/icons-react';
import { useEffect } from 'react';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';

interface OrderStatusPageProps {
  customerName: string;
  orderId?: string;
  amount?: number;
  status: 'success' | 'processing' | 'delivered' | 'cancelled' | 'error' | 'payment_failed' | 'not_found';
  customTitle?: string;
  customMessage?: string;
  onRetryPayment?: () => void;
  onBackToHome?: () => void;
  onReturnHome?: () => void;
}

const statusConfig = {
  success: {
    label: 'HOÀN THÀNH',
    color: 'bg-green-500',
    icon: IconCircleDashedCheck,
    message: 'Đơn hàng đã được hoàn thành thành công'
  },
  processing: {
    label: 'CHỜ XỬ LÝ',
    color: 'bg-orange-500',
    icon: IconClock,
    message: 'Đơn hàng của bạn đang được xử lý'
  },
  delivered: {
    label: 'ĐÃ GIAO HÀNG',
    color: 'bg-green-500',
    icon: IconTruck,
    message: 'Đơn hàng đã được giao thành công'
  },
  error: {
    label: 'LỖI XỬ LÝ',
    color: 'bg-red-500',
    icon: IconCircleX,
    message: 'Có lỗi xảy ra khi xử lý đơn hàng của bạn'
  },
  payment_failed: {
    label: 'THANH TOÁN THẤT BẠI',
    color: 'bg-red-500',
    icon: IconCreditCard,
    message: 'Thanh toán không thành công, vui lòng thử lại'
  },
  cancelled: {
    label: 'ĐÃ HỦY',
    color: 'bg-gray-500',
    icon: IconAlertTriangle,
    message: 'Đơn hàng đã được hủy'
  },
  not_found: {
    label: 'KHÔNG TÌM THẤY',
    color: 'bg-gray-500',
    icon: IconAlertTriangle,
    message: 'Đơn hàng không tồn tại.'
  }
};

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
    const isSuccessState = ['delivered', 'success'].includes(status);
    if (isSuccessState) {
      resetVoucher();
    }
  }, []);

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  const isErrorState = ['error', 'payment_failed', 'cancelled', 'not_found'].includes(status);
  const isSuccessState = ['delivered', 'success'].includes(status);

  const displayTitle =
    customTitle ||
    (isErrorState
      ? status === 'payment_failed'
        ? 'Thanh toán thất bại'
        : status === 'cancelled'
          ? 'Đơn hàng đã hủy'
          : status === 'not_found'
            ? 'Đơn hàng không tồn tại'
            : 'Có lỗi xảy ra'
      : 'Đơn hàng đã được thanh toán');

  const displayMessage = customMessage || currentStatus.message;

  const handleBackToHome = onBackToHome || onReturnHome || (() => {});

  return (
    <Card
      withBorder
      radius={'lg'}
      shadow='xl'
      className={`mx-auto w-full max-w-md ${isErrorState ? 'bg-red-50' : isSuccessState ? 'bg-green-50' : 'bg-blue-50'}`}
    >
      <Box className='space-y-6 p-8 text-center'>
        <Box className='flex justify-center'>
          <Box
            className={`h-20 w-20 ${isErrorState ? 'bg-red-100' : isSuccessState ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center rounded-full`}
          >
            <StatusIcon
              className={`h-12 w-12 ${isErrorState ? 'text-red-600' : isSuccessState ? 'text-green-600' : 'text-blue-600'}`}
            />
          </Box>
        </Box>

        <Box className='space-y-2'>
          <Title order={2} className='font-quicksand text-2xl font-bold text-gray-900'>
            {displayTitle}
          </Title>
          <Text size='lg' className='text-gray-700'>
            Chào, {customerName}
          </Text>
        </Box>

        <Center>
          <Badge
            fw={700}
            size='xl'
            className={`${currentStatus.color} text-white`}
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
          {status === 'payment_failed' && onRetryPayment && (
            <Button
              onClick={onRetryPayment}
              className='flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-semibold text-white transition-colors hover:bg-red-700'
            >
              <IconCreditCard className='h-4 w-4' />
              Thử thanh toán lại
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
