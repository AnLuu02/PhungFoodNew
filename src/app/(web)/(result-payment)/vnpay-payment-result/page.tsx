'use client';
import { Badge, Button, Card, Flex, Group, Paper, Text, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconArrowLeft, IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LoadingComponent from '~/components/Loading/Loading';
import { formatCustomTimestamp } from '~/lib/func-handler/formatDate';
import { getStatusColor, getStatusIcon, getStatusText } from '~/lib/func-handler/get-status-order';

export default function PaymentResult() {
  const searchParams = useSearchParams();
  const { data: user, status } = useSession();
  const [, , resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [, , resetVoucher] = useLocalStorage<any[]>({ key: 'vouchers', defaultValue: [] });
  const [queryParams, setQueryParams] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    resetCart();
    resetVoucher();

    if (searchParams && !hasFetched.current) {
      const params: Record<string, any> = {
        transactionStatus: searchParams.get('vnp_TransactionStatus'),
        orderId: searchParams.get('vnp_TxnRef') || searchParams.get('orderId'),
        amount: Number(searchParams.get('vnp_Amount')) / 100,
        bankCode: searchParams.get('vnp_BankCode'),
        payDate: searchParams.get('vnp_PayDate') || searchParams.get('transDate'),
        responseCode: searchParams.get('vnp_ResponseCode'),
        error: searchParams.get('error'),
        message: searchParams.get('message'),
        statusOrder: searchParams.get('statusOrder')
      };

      const hasOtherFields = Object.keys(params).some(
        key => key !== 'orderId' && key !== 'payDate' && key !== 'statusOrder' && key !== 'message' && params[key]
      );
      if (params.orderId && params.payDate && !hasOtherFields) {
        hasFetched.current = true;
        fetch('/api/vnpay/querydr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: params.orderId, transDate: params.payDate })
        })
          .then(res => res.json())
          .then(data => {
            setQueryParams({
              ...params,
              transactionStatus: data.vnp_TransactionStatus,
              amount: Number(data.vnp_Amount) / 100,
              bankCode: data.vnp_BankCode,
              payDate: data.vnp_PayDate,
              responseCode: data.vnp_ResponseCode,
              error: data.vnp_Message
            });
          })
          .catch(err => {
            console.error('Lỗi fetch trạng thái đơn hàng:', err);
          })
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }
  }, [searchParams, resetCart, resetVoucher]);

  if (isLoading || status === 'loading') {
    return <LoadingComponent />;
  }

  const { transactionStatus, orderId, amount, bankCode, payDate, responseCode, error, message, statusOrder } =
    queryParams;
  const isSuccess = responseCode === '00' && transactionStatus === '00';

  const TransactionInfo = () => (
    <Card shadow='sm' padding='lg' radius='md' withBorder className='flex h-full flex-col'>
      <Text>
        Mã đơn hàng: <b>{orderId || 'N/A'}</b>
      </Text>
      <Text>
        Số tiền: <b>{amount ? amount.toLocaleString() + ' VND' : 'N/A'}</b>
      </Text>
      <Text>
        Ngân hàng: <b>{bankCode || 'N/A'}</b>
      </Text>
      {payDate && (
        <Text>
          Thời gian: <b>{formatCustomTimestamp(payDate)}</b>
        </Text>
      )}
    </Card>
  );

  return (
    <Paper shadow='md' p='lg' radius='md' w='100%'>
      <Flex direction='column' justify='center' align='center' gap={10}>
        {isSuccess ? (
          <>
            <Title order={3} className='text-mainColor font-quicksand'>
              {message || 'Đặt hàng thành công.'}
            </Title>
            <IconCircleCheck size={50} color='green' />
            <Title order={3} className='font-quicksand'>
              Chào, {user?.user?.name || 'Khách'}
            </Title>
            <Badge size='md' p={'xs'} color={getStatusColor(statusOrder)}>
              <Flex>
                <Text size='10px' fw={700}>
                  {getStatusText(statusOrder)}
                </Text>
                {getStatusIcon(statusOrder)}
              </Flex>
            </Badge>
            <Text>Bạn vừa đặt hàng thành công, hàng sẽ được gửi đến bạn thời gian sớm nhất.</Text>
            <Text>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</Text>
          </>
        ) : (
          <>
            <Title order={3} className='font-quicksand text-[#d32f2f]'>
              {message || 'Thanh toán thất bại.'}
            </Title>
            <IconCircleX size={50} color='red' />
            <Title order={3} className='font-quicksand'>
              Xin chào, {user?.user?.name || 'Khách'}
            </Title>
            <Text>Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.</Text>
            <Text>Lý do: {error || 'Không rõ nguyên nhân'}</Text>
          </>
        )}

        {error ? (
          ' '
        ) : (
          <>
            <Title order={4}>Thông tin giao dịch</Title>
            <TransactionInfo />
          </>
        )}
        <Group justify='center' mt='md'>
          <Link href='/'>
            <Button variant='outline' leftSection={<IconArrowLeft size={16} />}>
              Quay về trang chủ
            </Button>
          </Link>
        </Group>
      </Flex>
    </Paper>
  );
}
