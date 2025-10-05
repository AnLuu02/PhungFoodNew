import { useLocalStorage } from '@mantine/hooks';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import BButton from '~/components/Button';
import { NotifyError, NotifyWarning } from '~/lib/func-handler/toast';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
import { api } from '~/trpc/react';
import { IStylesButtonCheckout } from '~/types/other';

export const ButtonCheckout = ({
  stylesButtonCheckout,
  data,
  finalTotal,
  originalTotal,
  discountAmount,
  onClick
}: {
  stylesButtonCheckout: IStylesButtonCheckout;
  data: any;
  finalTotal: number;
  originalTotal: number;
  discountAmount: number;
  onClick?: any;
}) => {
  const [appliedVouchers] = useLocalStorage<any[]>({
    key: 'applied-vouchers',
    defaultValue: []
  });
  const { data: user } = useSession();
  const [loading, setLoading] = useState(false);
  const mutationOrder = api.Order.create.useMutation();
  const orderItems: any = data ?? [];
  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      if (orderItems?.length > 0) {
        const resp = await mutationOrder.mutateAsync({
          finalTotal: finalTotal,
          originalTotal: originalTotal,
          discountAmount: discountAmount,
          status: LocalOrderStatus.UNPAID,
          userId: user?.user?.id || '',
          orderItems: orderItems?.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            note: item.note,
            price: Number(item.price) || 0
          })),
          vouchers: appliedVouchers?.map((item: any) => item.id).filter(Boolean) || []
        });

        if (resp.code === 'OK') {
          setLoading(true);
          window.location.href = `/thanh-toan/${resp.data.id}`;
        } else {
          NotifyError('Lỗi!', 'Đã có lỗi xảy ra trong quá trình thanh toán, thử lại sau.');
        }
      } else {
        NotifyError('Đơn hàng không tồn tại.', 'Đơn hàng không hợp lệ.');
      }
    } catch (e) {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <BButton
      loading={loading}
      disabled={loading || orderItems?.length === 0}
      {...stylesButtonCheckout}
      onClick={() => {
        if (user?.user?.email) {
          onClick?.();
          handleCreateOrder();
        } else {
          NotifyWarning('Chưa đăng nhập', 'Vui lòng đăng nhập để tiến hành thanh toán.');
        }
      }}
    />
  );
};
