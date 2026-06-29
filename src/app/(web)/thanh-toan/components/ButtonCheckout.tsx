import { Button, ButtonProps } from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useVoucherItems } from '~/components/Hooks/use-cart';
import { generateGuestCredentials } from '~/lib/FuncHandler/generateGuestCredentials';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';

export const ButtonCheckout = ({
  stylesButtonCheckout,
  data,
  finalAmount,
  originalAmount,
  taxAmount,
  discountAmount,
  onClick
}: {
  stylesButtonCheckout: ButtonProps;
  data: {
    productId: string;
    quantity: number;
    note: string;
    price: number;
  }[];
  finalAmount: number;
  taxAmount: number;
  originalAmount: number;
  discountAmount: number;
  onClick?: () => void;
}) => {
  const appliedVouchers = useVoucherItems();
  const { data: user } = useSession();
  const [loading, setLoading] = useState(false);
  const mutationOrder = api.Order.upsert.useMutation({
    onSuccess: resp => {
      onClick?.();
      window.location.href = `/thanh-toan/${resp?.metaData?.after?.id}`;
    },
    onError: e => {
      setLoading(false);
      NotifyError(e.message);
    }
  });
  const orderItems = data ?? [];
  const guestCreateMutation = api.User.create.useMutation({
    onError: e => {
      NotifyError(e.message);
    }
  });
  const handleCreateOrder = async () => {
    let userId = user?.user?.id;
    setLoading(true);
    if (!userId) {
      const { email, phone, password } = generateGuestCredentials();
      const responseGuest = await guestCreateMutation.mutateAsync({
        email,
        name: 'Khách hàng - ' + email,
        password,
        imageForEntity: undefined,
        phone
      });
      userId = responseGuest.id;
    }
    try {
      if (orderItems?.length > 0) {
        const vouchers = appliedVouchers.map(({ id, type, discountValue, maxDiscount }) => {
          if (type === 'FIXED') {
            return {
              voucherId: id ?? '',
              discountAmount: discountValue
            };
          }
          let amount = (originalAmount * discountValue) / 100;
          return {
            voucherId: id ?? '',
            discountAmount: amount <= maxDiscount ? amount : maxDiscount
          };
        });
        await mutationOrder.mutateAsync({
          id: undefined,
          finalAmount,
          originalAmount,
          taxAmount,
          discountAmount,
          status: OrderStatus.UNPAID,
          userId: userId || '',
          orderItems: orderItems?.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            note: item.note,
            price: Number(item.price) || 0
          })),
          vouchers
        });
      } else {
        NotifyError('Đơn hàng không tồn tại.', 'Đơn hàng không hợp lệ.');
      }
    } catch (e) {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
    <Button
      loading={loading}
      disabled={loading || orderItems?.length === 0}
      {...stylesButtonCheckout}
      onClick={() => {
        handleCreateOrder();
      }}
    />
  );
};
