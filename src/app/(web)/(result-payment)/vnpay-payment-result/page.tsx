'use client';
import { useLocalStorage } from '@mantine/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { formatTransDate } from '~/lib/func-handler/Format';
import { getVietnameseStatusMessage, mapOrderStatusToUIStatus } from '~/lib/func-handler/Payment';
import { api } from '~/trpc/react';
import OrderStatusPage from './components/OrderStatusPage';
import { PaymentStatusCardSkeleton } from './components/SkeletonLoading';

export default function PaymentResult() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('vnp_TxnRef') || searchParams.get('orderId');
  const { data: order, isLoading: loadingOrder } = api.Order.getOne.useQuery(
    { s: orderId || '' },
    {
      enabled: !!orderId
    }
  );
  const [, , resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [queryParams, setQueryParams] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const hasSent = useRef(false);
  useEffect(() => {
    resetCart();
    if (searchParams && !hasFetched.current) {
      const params: Record<string, any> = {
        transactionStatus: searchParams.get('vnp_TransactionStatus'),
        orderId: searchParams.get('vnp_TxnRef') || searchParams.get('orderId'),
        amount: Number(searchParams.get('vnp_Amount')) / 100,
        bankCode: searchParams.get('vnp_BankCode'),
        transDate: searchParams.get('vnp_PayDate') || searchParams.get('transDate'),
        responseCode: searchParams.get('vnp_ResponseCode'),
        error: searchParams.get('error'),
        statusOrder: searchParams.get('statusOrder'),
        useLocal: searchParams.get('useLocal') || '1'
      };
      if (
        searchParams.get('vnp_ResponseCode') === '00' &&
        searchParams.get('vnp_TransactionStatus') === '00' &&
        order &&
        !hasSent.current
      ) {
        hasSent.current = true;
        const transDate = formatTransDate(order.transDate ? order.transDate.toString() : '');
        fetch('/api/send-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: order?.delivery?.email,
            subject: 'Hóa đơn mua hàng',
            data: order,
            orderTrackingUrl:
              `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL_DEPLOY}/vnpay-payment-result?orderId=${encodeURIComponent(order?.id?.trim())}` +
              `&transDate=${encodeURIComponent(transDate?.trim())}` +
              `&statusOrder=${encodeURIComponent(order?.status?.trim())}` +
              `&useLocal=1`
          })
        });
      }
      if (params.orderId && params.transDate && !params.useLocal) {
        hasFetched.current = true;
        fetch('/api/vnpay/querydr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: params.orderId, transDate: params.transDate })
        })
          .then(res => res.json())
          .then(data => {
            setQueryParams({
              ...params,
              transactionStatus: data.vnp_TransactionStatus,
              amount: Number(data.vnp_Amount) / 100,
              bankCode: data.vnp_BankCode,
              transDate: data.vnp_PayDate,
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
      setQueryParams(params);
    }
  }, [searchParams, resetCart]);

  if (loading || loadingOrder) {
    return <PaymentStatusCardSkeleton />;
  }

  if (queryParams) {
    const uiStatus = mapOrderStatusToUIStatus(
      queryParams.statusOrder === order?.status ? queryParams.statusOrder : order?.status || 'ERROR',
      queryParams.responseCode,
      queryParams.transactionStatus
    );

    const { title, message } = getVietnameseStatusMessage(uiStatus, queryParams.responseCode);
    return (
      <OrderStatusPage
        status={uiStatus}
        customerName={order?.user?.name || 'Khách hàng'}
        orderId={queryParams.orderId}
        amount={queryParams.amount || order?.finalTotal || 0}
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
      status='ERROR'
      customerName={order?.user?.name || 'Khách hàng'}
      customTitle='Không tìm thấy thông tin đơn hàng'
      customMessage='Vui lòng kiểm tra lại đường dẫn hoặc liên hệ hỗ trợ khách hàng.'
      onBackToHome={() => {
        window.location.href = '/';
      }}
    />
  );
}
