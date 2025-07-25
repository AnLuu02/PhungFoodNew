import { useLocalStorage } from '@mantine/hooks';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BButton from '~/components/Button';
import { NotifyError } from '~/lib/func-handler/toast';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
import { api } from '~/trpc/react';
type IStylesButtonCheckout = {
  title?: string;
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  w?: any;
  h?: any;
  variant?: 'filled' | 'light' | 'outline' | 'default';
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
};
export const ButtonCheckout = ({
  stylesButtonCheckout,
  data,
  total,
  onClick
}: {
  stylesButtonCheckout: IStylesButtonCheckout;
  data: any;
  total: any;
  onClick?: any;
}) => {
  const [seletedVouchers] = useLocalStorage<any[]>({
    key: 'vouchers',
    defaultValue: []
  });
  const { data: user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const mutationOrder = api.Order.create.useMutation();
  const order: any = data ?? [];
  const handleCreateOrder = async () => {
    setLoading(true);
    if (order?.length > 0) {
      const resp: any = await mutationOrder.mutateAsync({
        total: total,
        status: LocalOrderStatus.PROCESSING,
        userId: user?.user?.id || '',
        orderItems: order?.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
          price: Number(item.price) || 0
        })),
        vouchers: seletedVouchers?.map((item: any) => item.id) || []
      });

      if (resp.success) {
        router.push(`/thanh-toan/${resp.record.id}`);
      } else {
        NotifyError('Lỗi!', 'Đã có lỗi xảy ra trong quá trình thanh toán, thử lại sau.');
      }
    } else {
      NotifyError('Lỗi!', 'Đơn hàng không hợp lệ.');
    }
  };
  return (
    <BButton
      loading={loading}
      disabled={loading || order?.length === 0}
      {...stylesButtonCheckout}
      onClick={() => {
        if (user?.user?.email) {
          onClick?.();
          handleCreateOrder();
        } else {
          NotifyError('Chưa đăng nhập', 'Vui lòng đăng nhập để tiến hành thanh toán.');
        }
      }}
    />
  );
};
