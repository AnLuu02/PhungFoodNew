import { useLocalStorage } from '@mantine/hooks';
import { OrderStatus } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BButton from '~/app/_components/Button';
import { NotifyError } from '~/app/lib/utils/func-handler/toast';
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
  total
}: {
  stylesButtonCheckout: IStylesButtonCheckout;
  data: any;
  total: any;
}) => {
  const [seletedVouchers, setSelectedVouchers, resetSelectedVouchers] = useLocalStorage<any[]>({
    key: 'vouchers',
    defaultValue: []
  });
  const { data: user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const mutationOrder = api.Order.create.useMutation();
  const order: any = data ?? {};
  const handleCreateOrder = async () => {
    setLoading(true);
    if (order) {
      const resp: any = await mutationOrder.mutateAsync({
        total: total,
        status: OrderStatus.PENDING,
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
    }
  };
  return (
    <BButton
      loading={loading}
      disabled={loading}
      {...stylesButtonCheckout}
      onClick={() => {
        if (user?.user?.email) {
          handleCreateOrder();
        } else {
          NotifyError('Chưa đăng nhập', 'Vui lòng đăng nhập để tiến hành thanh toán.');
        }
      }}
    />
  );
};
