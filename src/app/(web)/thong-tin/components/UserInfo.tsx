'use client';
import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  List,
  Paper,
  Progress,
  SimpleGrid,
  Spoiler,
  Stack,
  Text,
  ThemeIcon,
  Tooltip
} from '@mantine/core';
import { IconCircleCheck, IconUpload } from '@tabler/icons-react';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { UpdateUserButton } from '~/app/admin/user/components/Button';
import { caculateLevelUser } from '~/lib/FuncHandler/calculateLevel';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { getTotalOrderStatus, ORDER_STATUS_UI } from '~/lib/FuncHandler/status-order';
import { INFO_LEVEL_USER } from '~/shared/constants/user.constants';
import { GetOverviewUser } from '~/shared/type-trpc/user.type-trpc';

export function UserInfo({ user, session }: { user: NonNullable<GetOverviewUser>['user']; session: Session | null }) {
  const userInfor = user;
  const [opened, setOpened] = useState(false);
  const { statusObj } = useMemo(() => {
    const orderData =
      userInfor?.order?.map((order: NonNullable<GetOverviewUser['user']>['order'][number]) => {
        if (!order) return {};
        return {
          id: order.id,
          date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : new Date('yyyy-mm-dd'),
          finalAmount: order?.finalAmount,
          status: order.status
        };
      }) || [];
    const statusObj = getTotalOrderStatus(orderData);
    return { statusObj };
  }, [userInfor]);
  const { currentLevel, benefit, levelText, nextLevel, progressRemainingValue } = caculateLevelUser({
    level: userInfor?.level,
    pointUser: userInfor?.pointUser
  });

  return (
    <Grid p={0} grow>
      <GridCol span={{ base: 12, sm: 12, md: 12, lg: 6 }}>
        <Card shadow='lg' pos='relative' bg={`${currentLevel.color}22`} className='h-full pt-10 sm:p-7'>
          <Box pos='absolute' top={10} right={4}>
            <UpdateUserButton
              email={userInfor?.email || ''}
              openedFromClient={opened}
              setOpenedFromClient={setOpened}
            />
          </Box>
          <Group mb='md' align='flex-start'>
            <Tooltip label='Đổi ảnh đại diện'>
              <Box w={90} h={90} pos='relative' className='group cursor-pointer overflow-hidden rounded-full'>
                <Image
                  className='rounded-full object-cover'
                  width={90}
                  height={90}
                  src={userInfor?.imageForEntity?.image?.url || '/images/webp/user-default.webp'}
                  alt='User avatar'
                />
                <Flex
                  onClick={() => setOpened(true)}
                  className='absolute inset-0 hidden cursor-pointer group-hover:block group-hover:bg-[rgba(0,0,0,0.4)]'
                >
                  <Center className='h-full w-full' component='label'>
                    <IconUpload size={26} stroke={1.5} color='white' />
                  </Center>
                </Flex>
              </Box>
            </Tooltip>
            <Stack gap={6}>
              <Group align='center'>
                <Text size='xl' fw={700}>
                  {userInfor?.name}
                </Text>
              </Group>
              <Flex align='center' gap={10} pos={'relative'}>
                <Box pos={'relative'}>
                  <Image src={`/images/png/${currentLevel.thumbnail}`} width={120} height={40} alt='vip' />
                  <Badge
                    size='md'
                    pos={'absolute'}
                    bottom={10}
                    bg={currentLevel.color}
                    className='left-[50%] w-[max-content] translate-x-[-50%] rounded-b-full font-bold tracking-widest text-white'
                  >
                    {currentLevel.viName}
                  </Badge>
                </Box>

                <Badge size='md' ml={5} variant='outline' color={currentLevel.color}>
                  {userInfor?.pointUser} điểm
                </Badge>
              </Flex>
            </Stack>
          </Group>
          <Divider mb={16} color={`${currentLevel.color}20`} />
          <Grid>
            <Grid.Col span={6}>
              <Text size='sm' fw={700}>
                Email
              </Text>
              <Text size='sm' c='dimmed'>
                {userInfor?.email}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={700} size='sm'>
                Ngày sinh
              </Text>
              <Text size='sm' c='dimmed'>
                {userInfor?.dateOfBirth ? formatDateViVN(userInfor?.dateOfBirth) : 'Đang cập nhật'}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={700} size='sm'>
                Số điện thoại
              </Text>
              <Text size='sm' c='dimmed'>
                {userInfor?.phone || 'Đang cập nhật'}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={700} size='sm'>
                Vai trò
              </Text>
              <Text size='sm' c='dimmed'>
                {userInfor?.role?.viName || 'Đang cập nhật'}
              </Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text fw={700} size='sm'>
                Địa chỉ
              </Text>
              <Text size='sm' c='dimmed'>
                {userInfor?.address?.fullAddress || 'Đang cập nhật'}
              </Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Paper withBorder p='md' shadow='xs' bg={`${currentLevel.color}10`}>
                <Text size='sm' fw={700} mb={8}>
                  Đặc quyền hạng {currentLevel.viName}
                </Text>
                <Spoiler
                  maxHeight={50}
                  showLabel='Xem thêm'
                  hideLabel='Ẩn bớt'
                  classNames={{
                    control: 'w-full text-right text-sm font-bold text-mainColor'
                  }}
                >
                  <List
                    spacing='xs'
                    size='xs'
                    center
                    icon={
                      <ThemeIcon color={currentLevel.color} size={16} radius='xl'>
                        <IconCircleCheck size={12} />
                      </ThemeIcon>
                    }
                  >
                    {benefit.features.map(f => (
                      <List.Item>{f}</List.Item>
                    ))}
                    <List.Item>Quà tặng sinh nhật bất ngờ</List.Item>
                  </List>
                </Spoiler>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>
      </GridCol>

      <GridCol span={{ base: 12, sm: 12, md: 6 }}>
        <Card shadow='sm' className='sm:p-7'>
          <Stack gap='md'>
            <Flex align='center' justify='space-between'>
              <Text fw={700} size='md' mb={4}>
                Tổng quan các đơn hàng
              </Text>
              <Link href='/don-hang-cua-toi'>
                <Button size='xs' variant='transparent'>
                  Chi tiết
                </Button>
              </Link>
            </Flex>
            <SimpleGrid cols={2}>
              {ORDER_STATUS_UI.map(status => (
                <Paper
                  m={0}
                  bg={`${status.color}10`}
                  className={`flex min-w-[120px] items-center gap-[10px] px-4 py-3 shadow-md`}
                  key={status.key}
                >
                  <ThemeIcon size={32} radius='xl' color={status.color} variant='light'>
                    {status.icon}
                  </ThemeIcon>
                  <Box>
                    <Text fw={700} size='md' style={{ color: status.color }}>
                      {statusObj[status.key] ?? 0}
                    </Text>
                    <Text size='xs' c='dimmed'>
                      {status.label}
                    </Text>
                  </Box>
                </Paper>
              ))}
            </SimpleGrid>
            <Divider my={12} />
            <Box>
              <Text fw={700} size='md' mb='xs'>
                Tỷ lệ hoàn thành đơn hàng
              </Text>
              <Progress value={statusObj.completionRate} size='md' radius='xl' color='green' />
              <Text size='sm' c='dimmed' mt='xs'>
                {statusObj.completionRate.toFixed(2)}% đơn đặt hàng của bạn đã được hoàn thành thành công
              </Text>
            </Box>
          </Stack>
        </Card>
      </GridCol>
      <GridCol span={{ base: 12, sm: 12, md: 6 }}>
        <Card shadow='sm' className='sm:p-7' mt={'md'}>
          <Stack gap='lg' className='relative z-10'>
            <Box>
              <Text fw={900} className='font-quicksand text-xl text-slate-950 dark:text-white'>
                Tiến trình thành viên
              </Text>

              <Text size='sm' c='dimmed' mt={4}>
                Tích điểm qua các đơn hàng hoàn thành để nâng hạng.
              </Text>
            </Box>

            <Paper p='md' className='border border-slate-100 bg-slate-50/70 dark:border-white/10 dark:bg-white/5'>
              <Stack gap='sm'>
                <Flex justify='space-between' align='flex-start' gap='md'>
                  <Box>
                    <Text size='sm' c='dimmed'>
                      Tiến độ lên hạng <b>{nextLevel?.viName}</b>
                    </Text>

                    <Text mt={4} fw={900} className='font-quicksand text-lg text-slate-950 dark:text-white'>
                      {userInfor?.pointUser || 0} điểm
                    </Text>
                  </Box>

                  <Badge radius='xl' variant='light' color='gray'>
                    {currentLevel.viName}
                  </Badge>
                </Flex>

                <Progress value={progressRemainingValue} color={currentLevel.color} size='lg' radius='xl' />

                <Flex justify='space-between' gap='md'>
                  <Text size='xs' c='dimmed'>
                    {currentLevel.viName}
                  </Text>

                  <Text size='xs' c='dimmed' ta='right'>
                    {levelText}
                  </Text>
                </Flex>
              </Stack>
            </Paper>

            <Center mt='xl'>
              <Box w='100%'>
                <Box className='overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                  <Box className='relative min-w-[560px] px-4 py-5'>
                    <Box className='absolute left-[64px] right-[64px] top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-slate-200 dark:bg-white/10' />

                    <Box
                      className='absolute left-[64px] top-1/2 h-[3px] -translate-y-1/2 rounded-full transition-all duration-500'
                      style={{
                        width: `calc((100% - 128px) * ${
                          Object.values(INFO_LEVEL_USER).findIndex(level => level.key === currentLevel.key) /
                          Math.max(Object.values(INFO_LEVEL_USER).length - 1, 1)
                        })`,
                        backgroundColor: currentLevel.color
                      }}
                    />

                    <Flex align='center' justify='space-between' w='100%' className='relative z-10'>
                      {Object.values(INFO_LEVEL_USER).map((level, idx) => {
                        const levels = Object.values(INFO_LEVEL_USER);
                        const currentIndex = levels.findIndex(item => item.key === currentLevel.key);
                        const isCurrent = level.key === currentLevel.key;
                        const isPassed = idx < currentIndex;

                        return (
                          <Stack key={level.key + idx} align='center' gap={8} className='shrink-0'>
                            <Tooltip label={`Tối thiểu: ${level.minPoint} điểm`}>
                              <Center
                                w={isCurrent ? 112 : 78}
                                h={isCurrent ? 112 : 78}
                                className={[
                                  'relative rounded-full border bg-white shadow-sm transition-all duration-300 dark:bg-dark-card',
                                  isCurrent
                                    ? 'scale-105 border-mainColor shadow-[0_16px_40px_rgba(15,23,42,0.14)]'
                                    : isPassed
                                      ? 'border-slate-200'
                                      : 'border-slate-100 opacity-70 dark:border-white/10'
                                ].join(' ')}
                                style={{
                                  borderColor: isCurrent || isPassed ? level.color : undefined,
                                  backgroundColor: isCurrent ? `${level.color}18` : undefined
                                }}
                              >
                                <Center
                                  className='absolute -top-1 right-1 rounded-full border-2 border-white dark:border-dark-card'
                                  w={22}
                                  h={22}
                                  style={{
                                    backgroundColor: isPassed || isCurrent ? level.color : '#CBD5E1'
                                  }}
                                >
                                  {isPassed ? (
                                    <IconCircleCheck size={14} color='white' />
                                  ) : (
                                    <Box className='h-1.5 w-1.5 rounded-full bg-white' />
                                  )}
                                </Center>

                                <Box
                                  w={isCurrent ? 92 : 58}
                                  h={isCurrent ? 58 : 38}
                                  pos='relative'
                                  className='overflow-hidden'
                                >
                                  <Image src={`/images/png/${level.thumbnail}`} fill alt='vip' />
                                </Box>
                              </Center>
                            </Tooltip>

                            <Text
                              size='xs'
                              fw={isCurrent ? 900 : 700}
                              ta='center'
                              style={{
                                color: isCurrent ? level.color : undefined
                              }}
                              className='max-w-[90px]'
                              lineClamp={1}
                            >
                              {level.viName}
                            </Text>
                          </Stack>
                        );
                      })}
                    </Flex>
                  </Box>
                </Box>

                <Center mt='md'>
                  <Text size='sm' c='dimmed' ta='center'>
                    <b>{userInfor?.pointUser || 0}</b> điểm tích lũy · <b>{currentLevel.viName}</b>
                  </Text>
                </Center>
              </Box>
            </Center>
          </Stack>
        </Card>
      </GridCol>
    </Grid>
  );
}
