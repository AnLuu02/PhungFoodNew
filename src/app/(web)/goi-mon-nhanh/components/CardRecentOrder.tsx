'use client';

import { Badge, Box, Button, Card, Divider, Group, Image, Modal, Paper, ScrollArea, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ImageType, OrderStatus } from '@prisma/client';
import { IconEye, IconRefresh, IconSettings } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { getStatusInfo } from '~/lib/FuncHandler/status-order';
import { TGetFilterOrder } from '~/shared/type-trpc/order.type-trpc';
import { useCartStorage } from '~/stores/cart.store';

export default function CardRecentOrder({ order }: { order: TGetFilterOrder[number] }) {
  const reBuild = useCartStorage(s => s.reBuild);
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const statusInfo = useMemo(() => {
    return getStatusInfo(order?.status || OrderStatus.CANCELLED);
  }, [order]);

  const originalAmount = Number(order?.finalAmount || 0) + Number(order?.discountAmount || 0);

  const handleRebuildCart = () => {
    reBuild(
      order?.orderItems?.map((item: TGetFilterOrder[number]['orderItems'][number]) => ({
        product: {
          id: item?.product?.id,
          name: item?.product?.name,
          price: item?.product?.price,
          discount: item?.product?.discount,
          thumbnail: getImageProduct(item?.product?.imageForEntities ?? [], ImageType.THUMBNAIL) ?? ''
        },
        quantity: item?.quantity || 1,
        note: item?.note || ''
      })) || []
    );
  };
  return (
    <>
      <Card
        withBorder
        padding='md'
        className='group relative overflow-hidden border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-dark-card'
        style={
          {
            '--status-color': statusInfo.color || '#155DFC'
          } as React.CSSProperties
        }
      >
        <Box
          className='pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-20 blur-3xl transition group-hover:opacity-30'
          style={{ backgroundColor: 'var(--status-color)' }}
        />

        <Box
          className='pointer-events-none absolute -bottom-20 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full opacity-10 blur-3xl'
          style={{ backgroundColor: 'var(--status-color)' }}
        />

        <Text
          className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-14deg] select-none whitespace-nowrap font-black uppercase leading-none tracking-[0.1em] opacity-[0.09] transition group-hover:opacity-[0.14] dark:opacity-[0.13] dark:group-hover:opacity-[0.18]'
          style={{
            color: 'transparent',
            fontSize: 'clamp(46px, 8vw, 46px)',
            WebkitTextStroke: '1.4px var(--status-color)'
          }}
        >
          {statusInfo.label || 'Đang cập nhật'}
        </Text>

        <Stack gap='md' className='relative z-[1]'>
          <Stack gap='md' className='relative z-[1]'>
            <Group justify='space-between' align='flex-start' wrap='nowrap'>
              <Box className='min-w-0'>
                <Text size='xs' c='dimmed'>
                  Đơn gần đây
                </Text>

                <Text fw={900} className='text-slate-950 dark:text-white'>
                  #{order?.id?.slice(-8).toUpperCase() || 'ĐANG CẬP NHẬT'}
                </Text>
              </Box>
              <Text size='sm' c='dimmed' mt={2}>
                {formatDateViVN(order?.createdAt || new Date())} · {order?.orderItems?.length || 0} món
              </Text>
            </Group>

            <Box className='rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/5'>
              <Group justify='space-between' gap='md' wrap='nowrap'>
                <Box>
                  <Text size='xs' c='dimmed' fw={700}>
                    Tổng đơn
                  </Text>

                  <Text size='xs' mt={2} className='font-semibold' style={{ color: 'var(--status-color)' }}>
                    {statusInfo.label || 'Đang cập nhật'}
                  </Text>
                </Box>

                <Text fw={900} className='text-lg text-mainColor'>
                  {formatPriceLocaleVi(order?.finalAmount || 0)}
                </Text>
              </Group>
            </Box>

            <Group gap='sm' wrap='nowrap'>
              <Box
                onClick={open}
                className='flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-mainColor/30 hover:text-mainColor dark:border-white/10 dark:bg-white/5 dark:text-dark-text'
              >
                <IconEye size={20} />
              </Box>

              <Group grow flex={1} gap='sm'>
                <Button
                  variant='light'
                  loading={loading}
                  leftSection={<IconSettings size={16} />}
                  className='bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15'
                  onClick={() => {
                    setLoading(true);
                    handleRebuildCart();
                    window.location.href = '/gio-hang';
                  }}
                >
                  Tùy chỉnh
                </Button>

                <Button
                  loading={loading}
                  leftSection={<IconRefresh size={16} />}
                  className='bg-mainColor text-white hover:bg-mainColor'
                  onClick={() => {
                    setLoading(true);
                    window.location.href = `/thanh-toan/${order?.id}`;
                  }}
                >
                  Đặt lại
                </Button>
              </Group>
            </Group>
          </Stack>
        </Stack>
      </Card>

      <Modal
        opened={opened}
        onClose={close}
        centered
        size='lg'
        title={
          <Box>
            <Text fw={900} className='font-quicksand text-lg'>
              Chi tiết đơn hàng
            </Text>
            <Text size='xs' c='dimmed'>
              #{order?.id?.slice(-8).toUpperCase() || 'ĐANG CẬP NHẬT'}
            </Text>
          </Box>
        }
      >
        <Stack gap='md'>
          <Paper p='md' className='border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5'>
            <Group justify='space-between' align='flex-start'>
              <Box>
                <Text size='xs' c='dimmed'>
                  Ngày đặt
                </Text>
                <Text fw={800}>{formatDateViVN(order?.createdAt || new Date(), { hour: true })}</Text>
              </Box>

              <Badge radius='xl' variant='light' style={{ color: statusInfo.color }}>
                {statusInfo.label || 'Đang cập nhật'}
              </Badge>
            </Group>
          </Paper>

          <Box>
            <Group justify='space-between' mb='xs'>
              <Text fw={900}>Món đã đặt</Text>
              <Text size='sm' c='dimmed'>
                {order?.orderItems?.length || 0} món
              </Text>
            </Group>

            <ScrollArea.Autosize mah={340} type='auto'>
              <Stack gap='sm'>
                {order?.orderItems?.map((item: TGetFilterOrder[number]['orderItems'][number], index: number) => {
                  const product = item?.product;
                  const quantity = Number(item?.quantity || 1);
                  const price = Number(item?.price || product?.price || 0);
                  const discount = Number(item?.product?.discount || 0);
                  const total = Math.max(price - discount, 0) * quantity;

                  return (
                    <Paper
                      key={`${item.id}-${index}`}
                      p='sm'
                      className='border border-slate-200 bg-white dark:border-white/10 dark:bg-dark-card'
                    >
                      <Group align='center' wrap='nowrap'>
                        <Box className='h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/10'>
                          <Image
                            src={
                              getImageProduct(item?.product?.imageForEntities || [], ImageType.THUMBNAIL) ||
                              '/images/jpg/food-placeholder.jpg'
                            }
                            alt={product?.name || 'Món ăn'}
                            className='h-full w-full object-cover'
                          />
                        </Box>

                        <Box className='min-w-0 flex-1'>
                          <Text fw={800} lineClamp={1}>
                            {product?.name || 'Món ăn đã đặt'}
                          </Text>

                          <Text size='xs' c='dimmed'>
                            Số lượng: {quantity}
                            {item?.note ? ` · Ghi chú: ${item.note}` : ''}
                          </Text>

                          <Group gap='xs' mt={4}>
                            <Text size='sm' fw={800} className='text-mainColor'>
                              {formatPriceLocaleVi(price - discount)}
                            </Text>

                            {discount > 0 && (
                              <Text size='xs' c='dimmed' td='line-through'>
                                {formatPriceLocaleVi(price)}
                              </Text>
                            )}
                          </Group>
                        </Box>

                        <Text fw={900}>{formatPriceLocaleVi(total)}</Text>
                      </Group>
                    </Paper>
                  );
                })}
              </Stack>
            </ScrollArea.Autosize>
          </Box>

          <Paper p='md' className='border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5'>
            <Stack gap='xs'>
              <Group justify='space-between'>
                <Text size='sm' c='dimmed' fw={700}>
                  Tạm tính
                </Text>
                <Text size='sm' fw={700}>
                  {formatPriceLocaleVi(originalAmount)}
                </Text>
              </Group>

              <Group justify='space-between'>
                <Text size='sm' c='dimmed' fw={700}>
                  Đã giảm
                </Text>
                <Text size='sm' fw={700} className='text-green-600'>
                  -{formatPriceLocaleVi(order?.discountAmount || 0)}
                </Text>
              </Group>

              <Divider my={4} />

              <Group justify='space-between'>
                <Text fw={900}>Tổng đơn</Text>
                <Text fw={900} className='text-xl text-mainColor'>
                  {formatPriceLocaleVi(order?.finalAmount || 0)}
                </Text>
              </Group>
            </Stack>
          </Paper>

          <Group grow>
            <Button
              variant='light'
              className='bg-mainColor/10 text-mainColor hover:bg-mainColor/15'
              onClick={() => {
                setLoading(true);
                handleRebuildCart();
                window.location.href = '/gio-hang';
              }}
            >
              Tùy chỉnh lại đơn
            </Button>

            <Button
              className='bg-mainColor text-white hover:bg-mainColor'
              onClick={() => {
                setLoading(true);
                window.location.href = `/thanh-toan/${order?.id}`;
              }}
            >
              Đặt lại ngay
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
