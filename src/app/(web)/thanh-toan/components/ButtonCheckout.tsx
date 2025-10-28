import { useLocalStorage } from '@mantine/hooks';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import BButton, { IBButton } from '~/components/Button/Button';
import { generateGuestCredentials } from '~/lib/FuncHandler/generateGuestCredentials';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { LocalOrderStatus } from '~/lib/ZodSchema/enum';
import { api } from '~/trpc/react';

export const ButtonCheckout = ({
  stylesButtonCheckout,
  data,
  finalTotal,
  originalTotal,
  discountAmount,
  onClick
}: {
  stylesButtonCheckout: IBButton;
  data: any;
  finalTotal: number;
  originalTotal: number;
  discountAmount: number;
  onClick?: () => void;
}) => {
  const [appliedVouchers] = useLocalStorage<any[]>({
    key: 'applied-vouchers',
    defaultValue: []
  });
  const { data: user } = useSession();
  const [loading, setLoading] = useState(false);
  const mutationOrder = api.Order.create.useMutation({
    onSuccess: resp => {
      if (resp.code === 'OK') {
        onClick?.();
        window.location.href = `/thanh-toan/${resp.data.id}`;
      } else {
        NotifyError(resp.message, 'Đã có lỗi xảy ra trong quá trình thanh toán, thử lại sau.');
      }
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const orderItems: any = data ?? [];
  const guestCreateMutation = api.User.create.useMutation();
  const handleCreateOrder = async () => {
    let userId = user?.user?.id;
    setLoading(true);
    if (!userId) {
      const guest = generateGuestCredentials();
      const responseGuest = await guestCreateMutation.mutateAsync({
        email: guest.email || '',
        name: guest.email || '',
        password: guest.password || '',
        image: { fileName: '', base64: '' }
      });
      userId = responseGuest.data.id;
    }
    try {
      if (orderItems?.length > 0) {
        await mutationOrder.mutateAsync({
          finalTotal: finalTotal,
          originalTotal: originalTotal,
          discountAmount: discountAmount,
          status: LocalOrderStatus.UNPAID,
          userId: userId || '',
          orderItems: orderItems?.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            note: item.note,
            price: Number(item.price) || 0
          })),
          vouchers: appliedVouchers?.map((item: any) => item.id).filter(Boolean) || []
        });
      } else {
        NotifyError('Đơn hàng không tồn tại.', 'Đơn hàng không hợp lệ.');
      }
    } catch (e) {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
    <BButton
      loading={loading}
      disabled={loading || orderItems?.length === 0}
      {...stylesButtonCheckout}
      onClick={() => {
        handleCreateOrder();
      }}
    />
  );
};
