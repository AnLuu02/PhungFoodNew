'use client';
import { ActionIcon, Box, Button, Collapse, Divider, Group, Stack } from '@mantine/core';

import { Badge, Flex, Paper, Text, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { OrderStatus } from '@prisma/client';
import {
  IconAlertCircle,
  IconArrowRight,
  IconChevronDown,
  IconClock,
  IconCreditCard,
  IconReceipt
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { GetOverviewUser } from '~/shared/type-trpc/user.type-trpc';

export const AlertUnpaidOrder = ({ orders }: { orders: NonNullable<GetOverviewUser['user']>['order'] }) => {
  const [openedUnpaidOrders, { toggle: toggleUnpaidOrders }] = useDisclosure(false);
  const unpaidOrders = orders.filter(order => order.status === OrderStatus.UNPAID);
  const unpaidOrdersCount = unpaidOrders.length;
  const unpaidTotal = unpaidOrders.reduce((sum, order) => {
    return sum + order.finalTotal;
  }, 0);
  return (
    <>
      {unpaidOrdersCount > 0 && (
        <Paper
          radius='xl'
          p={{ base: 'md', sm: 'lg' }}
          className='relative overflow-hidden border border-orange-500/20 bg-orange-50/90 shadow-[0_14px_40px_rgba(249,115,22,0.12)] dark:border-orange-400/20 dark:bg-orange-400/10 dark:shadow-none'
        >
          <Box className='absolute -right-14 -top-14 h-36 w-36 rounded-full bg-orange-400/20 blur-3xl' />

          <Stack gap='md' className='relative z-10'>
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              align={{ base: 'stretch', sm: 'center' }}
              justify='space-between'
              gap='md'
            >
              <Group gap='md' wrap='nowrap'>
                <ThemeIcon
                  radius='xl'
                  size={48}
                  className='bg-orange-500/12 shrink-0 text-orange-600 dark:text-orange-300'
                >
                  <IconCreditCard size={23} />
                </ThemeIcon>

                <Box className='min-w-0'>
                  <Group gap='xs' wrap='wrap'>
                    <Text fw={900} className='text-orange-800 dark:text-orange-100'>
                      Bạn có {unpaidOrdersCount} đơn chưa thanh toán
                    </Text>

                    <Badge
                      radius='xl'
                      variant='light'
                      className='bg-orange-500/10 text-orange-700 dark:text-orange-200'
                    >
                      {formatPriceLocaleVi(unpaidTotal)}
                    </Badge>
                  </Group>

                  <Text size='sm' className='mt-1 text-orange-700/75 dark:text-orange-100/70'>
                    Các đơn này chưa được tính vào chi tiêu, tổng đơn và điểm thưởng.
                  </Text>
                </Box>
              </Group>

              <Group gap='xs' justify='flex-end' wrap='nowrap'>
                {unpaidOrders.length === 1 && (
                  <Button
                    component={Link}
                    href={`/thanh-toan/${unpaidOrders?.[0]?.id}`}
                    radius='xl'
                    className='bg-orange-500 px-5 text-white hover:bg-orange-600'
                    rightSection={<IconArrowRight size={16} />}
                  >
                    Thanh toán
                  </Button>
                )}

                <ActionIcon
                  variant='light'
                  radius='xl'
                  size={42}
                  onClick={toggleUnpaidOrders}
                  className='bg-orange-500/10 text-orange-700 hover:bg-orange-500/15 dark:text-orange-200'
                  aria-label='Xem đơn chưa thanh toán'
                >
                  <IconChevronDown
                    size={20}
                    className={`transition duration-300 ${openedUnpaidOrders ? 'rotate-180' : ''}`}
                  />
                </ActionIcon>
              </Group>
            </Flex>

            <Collapse in={openedUnpaidOrders}>
              <Divider className='border-orange-500/15 dark:border-orange-300/15' />

              <Stack gap='sm' mt='md'>
                {unpaidOrders.map(order => (
                  <Paper
                    key={order.id}
                    radius='lg'
                    p='md'
                    className='border border-orange-500/15 bg-white/75 shadow-sm backdrop-blur-md dark:border-orange-300/10 dark:bg-white/5'
                  >
                    <Flex
                      direction={{ base: 'column', sm: 'row' }}
                      align={{ base: 'stretch', sm: 'center' }}
                      justify='space-between'
                      gap='md'
                    >
                      <Group gap='sm' wrap='nowrap'>
                        <ThemeIcon
                          radius='xl'
                          size={40}
                          className='shrink-0 bg-orange-500/10 text-orange-600 dark:text-orange-300'
                        >
                          <IconReceipt size={20} />
                        </ThemeIcon>

                        <Box className='min-w-0'>
                          <Group gap='xs' wrap='wrap'>
                            <Text fw={900} className='text-slate-950 dark:text-white'>
                              Đơn #{order.id}
                            </Text>

                            <Badge
                              size='sm'
                              radius='xl'
                              variant='light'
                              className='bg-orange-500/10 text-orange-700 dark:text-orange-200'
                            >
                              Chưa thanh toán
                            </Badge>
                          </Group>

                          <Group gap='xs' mt={5} className='text-slate-500 dark:text-slate-400'>
                            <IconClock size={14} />

                            <Text size='xs'>Tạo lúc {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</Text>

                            <Text size='xs'>•</Text>

                            <Text size='xs'>{order?.orderItems?.length ?? 0} món</Text>
                          </Group>
                        </Box>
                      </Group>

                      <Group justify='space-between' wrap='nowrap'>
                        <Box ta={{ base: 'left', sm: 'right' }}>
                          <Text size='xs' c='dimmed'>
                            Cần thanh toán
                          </Text>

                          <Text fw={950} className='font-quicksand text-lg text-orange-700 dark:text-orange-200'>
                            {formatPriceLocaleVi(order.finalTotal)}
                          </Text>
                        </Box>

                        <Button
                          component={Link}
                          href={`/thanh-toan/${order?.id}`}
                          radius='xl'
                          size='sm'
                          fullWidth
                          className='bg-orange-500 text-white hover:bg-orange-600 sm:w-auto sm:flex-none'
                          rightSection={<IconArrowRight size={15} />}
                        >
                          Thanh toán
                        </Button>
                      </Group>
                    </Flex>
                  </Paper>
                ))}

                <Group
                  gap='xs'
                  wrap='nowrap'
                  className='bg-orange-500/8 rounded-2xl px-3 py-2 text-orange-700 dark:text-orange-100'
                >
                  <IconAlertCircle size={16} className='shrink-0' />

                  <Text size='xs'>
                    Sau khi thanh toán thành công, đơn sẽ chuyển sang trạng thái chờ xác nhận và được xử lý bởi nhà
                    hàng.
                  </Text>
                </Group>
              </Stack>
            </Collapse>
          </Stack>
        </Paper>
      )}
    </>
  );
};
