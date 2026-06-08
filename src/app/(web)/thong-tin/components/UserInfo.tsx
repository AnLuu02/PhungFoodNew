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
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { UpdateUserButton } from '~/app/admin/user/components/Button';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import { caculateLevelUser } from '~/lib/FuncHandler/calculateLevel';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { getTotalOrderStatus, ORDER_STATUS_UI } from '~/lib/FuncHandler/status-order';
import { INFO_LEVEL_USER } from '~/shared/constants/user.constants';
import { GetOneUser } from '~/shared/type-trpc/user.type-trpc';
import { api } from '~/trpc/react';

export function UserInfo() {
  const { data: session, status } = useSession();
  const { data: userInfor, isLoading } = api.User.getOne.useQuery(
    { key: session?.user?.id || '', include: { order: true } },
    { enabled: !!session?.user?.id }
  );
  const [opened, setOpened] = useState(false);
  const { statusObj } = useMemo(() => {
    const orderData =
      userInfor?.order?.map((order: NonNullable<GetOneUser>['order'][number]) => {
        if (!order) return {};
        return {
          id: order.id,
          date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : new Date('yyyy-mm-dd'),
          finalTotal: order?.finalTotal || 0,
          status: order.status
        };
      }) || [];
    const statusObj = getTotalOrderStatus(orderData);
    return { statusObj };
  }, [userInfor]);
  const { currentLevel, benefit, currentPoint, levelText, nextLevel, progressRemainingValue } = caculateLevelUser({
    level: userInfor?.level,
    pointUser: userInfor?.pointUser
  });
  if (status === 'loading' || isLoading)
    return (
      <Grid p={0} grow>
        <GridCol span={{ base: 12, sm: 12, md: 12, lg: 6 }}>
          <CommonSkeleton.ProfileCard />
        </GridCol>
        <GridCol span={{ base: 12, sm: 12, md: 6 }}>
          <CommonSkeleton.StatsGrid />
        </GridCol>
      </Grid>
    );
  return (
    <Grid p={0} grow>
      <GridCol span={{ base: 12, sm: 12, md: 12, lg: 6 }}>
        <Card shadow='lg' withBorder pos='relative' bg={`${currentLevel.color}22`} className='h-full pt-10 sm:p-7'>
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
        <Card shadow='sm' className='sm:p-7' withBorder>
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
        <Card shadow='sm' className='sm:p-7' withBorder mt={'md'}>
          <Text fw={700} size='md' mb={4}>
            Tiến trình cấp độ thành viên
          </Text>

          <Box className='mt-4 space-y-3'>
            <Box className='flex items-center justify-between text-sm'>
              <span className='text-gray-600 dark:text-dark-text'>
                Tiến độ lên hạng<b> {nextLevel?.viName}</b>
              </span>
              <span className='font-medium text-gray-900 dark:text-dark-text'>
                {userInfor?.pointUser || 0 / currentLevel.maxPoint} điểm
              </span>
            </Box>
            <Progress value={progressRemainingValue} color={currentLevel.color} size='md' radius='xl' />
            <Box className='flex items-center justify-between'>
              <Text size='xs' c={'dimmed'} className='max-w-[45%] sm:max-w-[35%]'>
                {currentLevel.viName} - ({userInfor?.pointUser || 0} điểm)
              </Text>
              <Text size='xs' c={'dimmed'} className='max-w-[45%] sm:max-w-[55%]'>
                {levelText}
              </Text>
            </Box>
          </Box>

          <Center mt={'xl'}>
            <Box>
              <Flex gap={8} align='center' wrap={'wrap'} justify={'center'}>
                {Object.values(INFO_LEVEL_USER).map((level, idx) => {
                  const isCurrent = level.key === currentLevel.key;
                  return (
                    <Center
                      key={level.key + idx}
                      w={80}
                      h={80}
                      bg={isCurrent ? `${level.color}22` : 'transparent'}
                      className={`relative overflow-hidden rounded-full transition-all duration-300`}
                    >
                      <Tooltip label={`Tối thiểu: ${level.minPoint} điểm`}>
                        <Box w={60} h={40} pos={'relative'} className='overflow-hidden'>
                          <Image src={`/images/png/${level.thumbnail}`} fill alt='vip' />
                        </Box>
                      </Tooltip>
                    </Center>
                  );
                })}
              </Flex>
              <Center mt={'md'}>
                <Text size='sm' c='dimmed'>
                  <b>{userInfor?.pointUser}</b> điểm tích lũy |<b> {currentLevel.viName}</b>
                </Text>
              </Center>
            </Box>
          </Center>
        </Card>
      </GridCol>
    </Grid>
  );
}
