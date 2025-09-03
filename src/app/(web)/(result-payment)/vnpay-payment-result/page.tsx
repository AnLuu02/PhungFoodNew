'use client';
import { useLocalStorage } from '@mantine/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getVietnameseStatusMessage, mapOrderStatusToUIStatus } from '~/lib/func-handler/Payment';
import { api } from '~/trpc/react';
import OrderStatusPage from './components/OrderStatusPage';
import { PaymentStatusCardSkeleton } from './components/SkeletonLoading';

export default function PaymentResult() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('vnp_TxnRef') || searchParams.get('orderId');
  const { data: order, isLoading: loadingOrder } = api.Order.getOne.useQuery({ s: orderId || '' });
  const [, , resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [queryParams, setQueryParams] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    resetCart();
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
      setQueryParams(params);
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
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [searchParams, resetCart]);

  if (loading || loadingOrder) {
    return <PaymentStatusCardSkeleton />;
  }

  if (queryParams) {
    const uiStatus = mapOrderStatusToUIStatus(
      queryParams.statusOrder,
      queryParams.responseCode,
      queryParams.transactionStatus
    );
    const { title, message } = getVietnameseStatusMessage(uiStatus, queryParams.responseCode);

    return (
      <OrderStatusPage
        status={uiStatus}
        customerName={order?.user?.name || 'Khách hàng'}
        orderId={queryParams.orderId}
        amount={queryParams.amount}
        customTitle={title}
        customMessage={message}
        onRetryPayment={() => {
          window.location.href = `/thanh-toan/${queryParams.orderId}`;
        }}
        onBackToHome={() => {
          window.location.href = '/';
        }}
      />
    );
  }

  return (
    <OrderStatusPage
      status='error'
      customerName={order?.user?.name || 'Khách hàng'}
      customTitle='Không tìm thấy thông tin đơn hàng'
      customMessage='Vui lòng kiểm tra lại đường dẫn hoặc liên hệ hỗ trợ khách hàng.'
      onBackToHome={() => {
        window.location.href = '/';
      }}
    />
  );
}
