'use client';

import { Alert, Button, Card, Group, Text, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { OrderStatus } from '@prisma/client';
import { IconArrowLeft, IconCheck, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '~/trpc/react';

export default function PaymentResult() {
  const searchParams = useSearchParams();
  const [cart, setCart, resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [voucher, setVoucher, resetVOucher] = useLocalStorage<any[]>({ key: 'vouchers', defaultValue: [] });

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    resetCart();
    resetVOucher();
  }, []);

  const responseCode = searchParams.get('vnp_ResponseCode');
  const transactionStatus = searchParams.get('vnp_TransactionStatus');
  const orderId = searchParams.get('vnp_TxnRef');
  const amount = Number(searchParams.get('vnp_Amount')) / 100;
  const bankCode = searchParams.get('vnp_BankCode');
  const payDate = searchParams.get('vnp_PayDate');
  const isSuccess = responseCode === '00' && transactionStatus === '00';
  const mutation = api.Order.update.useMutation();
  useEffect(() => {
    const updateOrder = async () => {
      await mutation.mutateAsync({
        where: {
          id: orderId
        },
        data: {
          status: isSuccess ? OrderStatus.COMPLETED : OrderStatus.FAILED,
          transactionId: orderId
        }
      });
    };
    updateOrder();
    setIsClient(true);
    resetCart();
  }, []);
  if (!isClient) return null;

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Card shadow='md' padding='lg' radius='md' className='w-[400px]'>
        <Alert
          icon={isSuccess ? <IconCheck size={16} /> : <IconX size={16} />}
          title={isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
          color={isSuccess ? 'green' : 'red'}
          className='mb-4'
        />

        <Title order={4}>Thông tin giao dịch</Title>
        <Text>
          Mã đơn hàng: <b>{orderId || 'N/A'}</b>
        </Text>
        <Text>
          Số tiền: <b>{amount ? amount.toLocaleString() + ' VND' : 'N/A'}</b>
        </Text>
        <Text>
          Ngân hàng: <b>{bankCode || 'N/A'}</b>
        </Text>
        <Text>
          Thời gian: <b>{payDate || 'N/A'}</b>
        </Text>

        <Group justify='center' mt='md'>
          <Link href='/'>
            <Button variant='outline' leftSection={<IconArrowLeft size={16} />}>
              Quay về trang chủ
            </Button>
          </Link>
        </Group>
      </Card>
    </div>
  );
}
