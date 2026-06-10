import { Avatar, Badge, Box, Flex, Group, Paper, Progress, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { IconStar } from '@tabler/icons-react';
import { Session } from 'next-auth';
import { caculateLevelUser } from '~/lib/FuncHandler/calculateLevel';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { GetOverviewUser } from '~/shared/type-trpc/user.type-trpc';
import { AlertUnpaidOrder } from './AlertUnpaidOrder';

export const OverviewUser = ({
  overviewUser,
  session
}: {
  overviewUser: NonNullable<GetOverviewUser>;
  session: Session | null;
}) => {
  const user = overviewUser?.user;
  const orders = user?.order ?? [];
  const overview = overviewUser?.overview;

  const { currentLevel, nextLevel, progressRemainingValue } = caculateLevelUser({
    level: user?.level,
    pointUser: user?.pointUser
  });

  const completedOrders = orders.filter(order => order.status === OrderStatus.COMPLETED);

  const completedOrdersCount = completedOrders.length;

  const totalCompletedSpent = completedOrders.reduce((sum, order) => {
    return sum + order.finalTotal;
  }, 0);

  const completedOrdersThisMonth = completedOrders.filter(order => {
    const now = new Date();
    return order?.createdAt?.getMonth() === now.getMonth() && order.createdAt.getFullYear() === now.getFullYear();
  }).length;

  const overviewCards = [
    {
      label: 'Đơn hoàn tất',
      value: completedOrdersCount.toLocaleString('vi-VN'),
      sub: 'Không tính đơn chưa thanh toán',
      badge: completedOrdersThisMonth > 0 ? `+${completedOrdersThisMonth} tháng này` : undefined
    },
    {
      label: 'Đã ghi nhận',
      value: formatPriceLocaleVi(totalCompletedSpent),
      sub: 'Chỉ tính từ đơn đã hoàn tất'
    },
    {
      label: 'Điểm khả dụng',
      value: user?.pointUser?.toLocaleString('vi-VN'),
      sub: `Còn ${(100).toLocaleString('vi-VN')} điểm để lên hạng`
    }
  ];
  return (
    <>
      <Paper
        p={{ base: 'md', sm: 'xl' }}
        className='relative overflow-hidden border border-slate-200/70 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-dark-card dark:shadow-[0_18px_55px_rgba(0,0,0,0.36)]'
      >
        <Box className='absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mainColor/10 blur-3xl' />
        <Box
          className='absolute -bottom-28 left-16 h-64 w-64 rounded-full blur-3xl'
          style={{
            backgroundColor: `${currentLevel.color}22`
          }}
        />

        <Stack gap='lg' className='relative z-10'>
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            justify='space-between'
            align={{ base: 'stretch', lg: 'center' }}
            gap='xl'
          >
            <Group gap='md' align='center' wrap='nowrap'>
              <Box className='relative shrink-0'>
                <Avatar
                  size={84}
                  src={session?.user?.image || '/images/webp/user-default.webp'}
                  className='ring-4 ring-mainColor/10'
                />

                <Box className='absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-mainColor text-white dark:border-dark-card'>
                  <IconStar size={15} />
                </Box>
              </Box>

              <Box className='min-w-0'>
                <Group gap='xs' mb={6} wrap='wrap'>
                  <Title
                    order={2}
                    className='font-quicksand text-2xl font-black leading-tight text-slate-950 dark:text-white sm:text-3xl'
                  >
                    Xin chào, {session?.user?.name?.split(' ')?.at(-1) ?? 'Khách hàng'}
                  </Title>

                  <Badge
                    radius='xl'
                    variant='light'
                    style={{
                      color: currentLevel?.color,
                      backgroundColor: `${currentLevel?.color}16`
                    }}
                  >
                    {currentLevel?.viName}
                  </Badge>
                </Group>

                <Text c='dimmed' size='sm' className='max-w-xl leading-6'>
                  Theo dõi đơn hàng đã hoàn tất, chi tiêu đã ghi nhận và tiến độ hạng thành viên của bạn.
                </Text>

                <Box mt='md' maw={430}>
                  <Group justify='space-between' mb={6}>
                    <Text size='xs' fw={800} className='uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400'>
                      Tiến độ lên hạng {nextLevel?.viName}
                    </Text>

                    <Text size='xs' fw={800} style={{ color: currentLevel?.color }}>
                      {progressRemainingValue}%
                    </Text>
                  </Group>

                  <Progress
                    value={progressRemainingValue}
                    radius='xl'
                    size='sm'
                    color={currentLevel?.color}
                    className='bg-slate-100 dark:bg-white/10'
                  />

                  <Text mt={6} size='xs' c='dimmed'>
                    Chỉ cộng điểm sau khi đơn hàng được hoàn tất.
                  </Text>
                </Box>
              </Box>
            </Group>

            <Paper
              radius='xl'
              p={{ base: 'md', sm: 'lg' }}
              className='w-full border border-slate-200/70 bg-white/80 shadow-sm dark:border-white/10 dark:bg-white/[0.03] lg:max-w-2xl'
            >
              <SimpleGrid cols={{ base: 1, xs: 3 }} spacing={0}>
                {overviewCards.map((item, index) => (
                  <Box key={item.label} className='relative px-1 py-4 xs:px-5'>
                    {index !== 0 && (
                      <>
                        <Box className='absolute left-0 top-3 hidden h-[calc(100%-24px)] w-px bg-slate-200/80 dark:bg-white/10 xs:block' />
                        <Box className='absolute left-0 top-0 h-px w-full bg-slate-200/80 dark:bg-white/10 xs:hidden' />
                      </>
                    )}

                    <Group justify='space-between' align='center' wrap='nowrap' mb={8}>
                      <Text
                        size='xs'
                        fw={800}
                        className='uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400'
                      >
                        {item.label}
                      </Text>
                    </Group>
                    <Group>
                      <Text fw={950} className='font-quicksand text-2xl leading-none text-slate-950 dark:text-white'>
                        {item.value}
                      </Text>
                      {item?.badge && (
                        <Text size='xs' fw={800} className='text-mainColor'>
                          {item?.badge}
                        </Text>
                      )}
                    </Group>

                    <Text mt={8} size='xs' c='dimmed' lineClamp={2} className='leading-5'>
                      {item.sub}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Paper>
          </Flex>

          <AlertUnpaidOrder orders={orders} />
        </Stack>
      </Paper>
    </>
  );
};
