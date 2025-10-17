'use client';
import { Box, Modal, SimpleGrid, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import Empty from '~/components/Empty';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { api } from '~/trpc/react';
import CardRecentOrder from '../../app/(web)/goi-mon-nhanh/components/CardRecentOrder';

export const ModalRecentOrder = ({ opened, onClose }: any) => {
  const { data: session } = useSession();
  const { data: orders, isLoading: isLoadingOrders } = api.Order.getFilter.useQuery(
    { s: session?.user.email || '', period: 30 },
    { enabled: !!session?.user.email }
  );

  const orderData = orders || [];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size={'80%'}
      radius={'md'}
      title={
        <Title order={2} className='font-quicksand'>
          Đơn đặt hàng gần đây
        </Title>
      }
    >
      {isLoadingOrders ? (
        <LoadingSpiner />
      ) : (
        <Box className='space-y-4'>
          {orderData?.length > 0 ? (
            <SimpleGrid cols={3}>
              {orderData.map(order => (
                <CardRecentOrder key={order.id} order={order} />
              ))}
            </SimpleGrid>
          ) : (
            <Empty
              title={'Không có đơn hàng phù hợp'}
              content={'Bạn không có đơn hàng nào được đặt trong 30 ngày qua.'}
              onClick={() => onClose()}
            />
          )}
        </Box>
      )}
    </Modal>
  );
};
