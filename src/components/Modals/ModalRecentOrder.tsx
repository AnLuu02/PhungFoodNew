'use client';
import { Box, Button, Center, Drawer, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { api } from '~/trpc/react';
import CardRecentOrder from '../../app/(web)/goi-mon-nhanh/components/CardRecentOrder';

export const ModalRecentOrder = ({ opened, onClose }: { opened: boolean; onClose: () => void }) => {
  const { data: session } = useSession();
  const { data: orders, isLoading: isLoadingOrders } = api.Order.getFilter.useQuery(
    { s: session?.user.email || '', period: 30 },
    { enabled: !!session?.user.email }
  );

  const orderData = orders || [];

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position='right'
      size='min(100vw, 460px)'
      padding={0}
      title={
        <Box>
          <Title order={3} className='font-quicksand text-xl font-black text-slate-950 dark:text-white'>
            Đơn đặt hàng gần đây
          </Title>

          <Text size='sm' c='dimmed' mt={3}>
            Xem nhanh các đơn mới nhất của bạn.
          </Text>
        </Box>
      }
      classNames={{
        content: 'flex h-dvh flex-col overflow-hidden bg-backgroundAdmin dark:bg-dark-card',
        header: 'shrink-0 border-b border-slate-200 px-5 py-4 dark:border-white/10',
        body: 'min-h-0 flex-1 overflow-hidden p-0'
      }}
    >
      {isLoadingOrders ? (
        <Center h='100%'>
          <LoadingSpiner />
        </Center>
      ) : (
        <Stack h='100%' gap={0}>
          <Box className='shrink-0 px-4 pt-4'>
            <Paper p='sm'>
              <Group gap='sm' wrap='nowrap' align='flex-start'>
                <Box className='min-w-0 flex-1'>
                  <Text size='sm' fw={900} className='text-slate-950 dark:text-white'>
                    Chỉ hiển thị 30 ngày gần nhất
                  </Text>

                  <Text size='xs' c='dimmed' mt={2}>
                    Muốn xem đầy đủ, vào trang đơn hàng của tôi.
                  </Text>
                </Box>

                <Button
                  component={Link}
                  href='/don-hang-cua-toi'
                  onClick={onClose}
                  size='xs'
                  rightSection={<IconArrowRight size={14} />}
                  className='shrink-0'
                >
                  Xem tất cả
                </Button>
              </Group>
            </Paper>
          </Box>

          <Box className='min-h-0 flex-1 overflow-y-auto px-4 py-4'>
            {orderData?.length > 0 ? (
              <Stack gap='sm'>
                {orderData.map(order => (
                  <CardRecentOrder key={order.id} order={order} />
                ))}
              </Stack>
            ) : (
              <Paper
                p='xl'
                className='border border-dashed border-slate-300 bg-white text-center dark:border-white/10 dark:bg-dark-card'
              >
                <Text fw={900} className='font-quicksand text-lg text-slate-950 dark:text-white'>
                  Không có đơn hàng gần đây
                </Text>

                <Text size='sm' c='dimmed' mt={8} className='mx-auto max-w-xs leading-6'>
                  Bạn chưa có đơn hàng nào trong 30 ngày qua.
                </Text>

                <Button
                  component={Link}
                  href='/don-hang-cua-toi'
                  onClick={onClose}
                  mt='lg'
                  rightSection={<IconArrowRight size={16} />}
                  className='bg-mainColor text-white hover:bg-mainColor/90'
                >
                  Xem lịch sử đơn hàng
                </Button>
              </Paper>
            )}
          </Box>
        </Stack>
      )}
    </Drawer>
  );
};
