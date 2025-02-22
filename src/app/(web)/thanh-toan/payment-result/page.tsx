'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentResult() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [amountTotal, setAmountTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Không tìm thấy session ID');
      setLoading(false);
      return;
    }

    async function fetchPaymentStatus() {
      try {
        const response = await fetch(`/api/payment-status?session_id=${sessionId}`);
        if (!response.ok) throw new Error('Lỗi khi lấy thông tin thanh toán');

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setPaymentStatus(data.status);
        setCustomerEmail(data.customer_email);
        setAmountTotal(data.amount_total);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    }

    fetchPaymentStatus();
  }, [sessionId]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <div className='rounded-lg bg-white p-6 shadow-lg'>
        <h2 className='mb-4 text-2xl font-bold'>Kết quả thanh toán</h2>

        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          <>
            <p className='text-lg'>
              Trạng thái: <strong>{paymentStatus}</strong>
            </p>
            {customerEmail && (
              <p>
                Email khách hàng: <strong>{customerEmail}</strong>
              </p>
            )}
            {amountTotal && (
              <p>
                Số tiền: <strong>{(amountTotal / 100)?.toFixed(2)} VND</strong>
              </p>
            )}

            {paymentStatus === 'paid' ? (
              <p className='font-bold text-green-500'>Thanh toán thành công! 🎉</p>
            ) : (
              <p className='font-bold text-red-500'>Thanh toán chưa hoàn tất.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
