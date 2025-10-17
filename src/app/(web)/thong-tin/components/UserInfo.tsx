'use client';
import {
  Avatar,
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
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Tooltip
} from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { UpdateUserButton } from '~/app/admin/user/components/Button';
import { getInfoLevelUser, infoUserLevel } from '~/constants';
import { formatDateViVN } from '~/lib/func-handler/Format';
import { getTotalOrderStatus, ORDER_STATUS_UI } from '~/lib/func-handler/status-order';
import { LocalGender, LocalUserLevel } from '~/lib/zod/EnumType';

export function UserInfo({ userInfor }: { userInfor: any }) {
  const [opened, setOpened] = useState(false);
  const { statusObj }: any = useMemo(() => {
    const orderData =
      userInfor?.order?.map((order: any) => ({
        id: order.id,
        date: new Date(order.createdAt).toISOString().split('T')[0] || new Date('yyyy-mm-dd'),
        finalTotal: order?.finalTotal || 0,
        status: order.status
      })) || [];
    const statusObj = getTotalOrderStatus(orderData);
    return { statusObj };
  }, [userInfor]);
  const levelInfo = getInfoLevelUser(userInfor?.level as LocalUserLevel);

  return (
    <Grid p={0}>
      <GridCol span={{ base: 12, sm: 12, md: 12, lg: 6 }}>
        <Card shadow='lg' radius='lg' withBorder pos='relative' bg={`${levelInfo.color}22`} className='pt-10 sm:p-7'>
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
                <Avatar src={userInfor?.image?.url} size={90} radius={45} />
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
                  <Image src={`/images/png/${levelInfo.thumbnail}`} width={120} height={40} alt='vip' />
                  <Badge
                    size='md'
                    radius='md'
                    pos={'absolute'}
                    bottom={10}
                    bg={levelInfo.color}
                    className='left-[50%] w-[max-content] translate-x-[-50%] rounded-b-full font-bold tracking-widest text-white'
                  >
                    {levelInfo.viName}
                  </Badge>
                </Box>

                <Badge size='md' radius='md' ml={5} variant='outline' color={levelInfo.color}>
                  {userInfor?.pointUser} điểm
                </Badge>
              </Flex>
            </Stack>
          </Group>
          <Divider mb={16} color={`${levelInfo.color}20`} />
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
                Giới tính
              </Text>
              <Text size='sm' c='dimmed'>
                {userInfor?.gender === LocalGender.MALE
                  ? 'Nam'
                  : userInfor?.gender === LocalGender.FEMALE
                    ? 'Nữ'
                    : userInfor?.gender === LocalGender.OTHER
                      ? 'Khác'
                      : 'Đang cập nhật'}
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
          </Grid>
        </Card>
      </GridCol>

      <GridCol span={{ base: 12, sm: 12, md: 6 }}>
        <Card shadow='sm' className='sm:p-7' radius='lg' withBorder>
          <Stack gap='md'>
            <Flex align='center' justify='space-between'>
              <Text fw={700} size='md' mb={4}>
                Tổng quan các đơn hàng
              </Text>
              <Link href='/don-hang-cua-toi'>
                <Button size='xs' variant='subtle'>
                  Chi tiết
                </Button>
              </Link>
            </Flex>
            <SimpleGrid cols={2}>
              {ORDER_STATUS_UI.map(status => (
                <Box
                  bg={`${status.color}10`}
                  className={`flex min-w-[120px] items-center gap-[10px] rounded-md px-4 py-3 shadow-md`}
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
                </Box>
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
        <Card shadow='sm' className='sm:p-7' radius='lg' withBorder mt={'md'}>
          <Text fw={700} size='md' mb={4}>
            Tiến trình cấp độ thành viên
          </Text>

          <Box className='mt-4 space-y-3'>
            <Box className='flex items-center justify-between text-sm'>
              <span className='text-gray-600 dark:text-dark-text'>
                Tiến độ lên hạng<b> {getInfoLevelUser(levelInfo.nextLevel).viName}</b>
              </span>
              <span className='font-medium text-gray-900'>{userInfor?.pointUser || 0 / levelInfo.maxPoint} điểm</span>
            </Box>
            <Progress
              value={((userInfor?.pointUser || 0) / (levelInfo.maxPoint + 1)) * 100}
              color={levelInfo.color}
              size='md'
              radius='xl'
            />
            <Box className='flex items-center justify-between'>
              <Text size='xs' c={'dimmed'} className='max-w-[45%] sm:max-w-[30%]'>
                {levelInfo.viName} - ({userInfor?.pointUser || 0} điểm)
              </Text>
              <Text size='xs' c={'dimmed'} className='max-w-[45%] sm:max-w-[60%]'>
                Cần thêm {levelInfo.maxPoint + 1 - (userInfor?.pointUser || 0)} điểm để lên{' '}
                {getInfoLevelUser(levelInfo.nextLevel as LocalUserLevel).viName}
              </Text>
            </Box>
          </Box>

          <Center mt={'xl'}>
            <Box>
              <Flex gap={8} align='center' wrap={'wrap'} justify={'center'}>
                {infoUserLevel.map((level, idx) => {
                  const isCurrent = level.key === levelInfo.key;
                  return (
                    <Center
                      key={level.key}
                      w={80}
                      h={80}
                      bg={isCurrent ? `${level.color}22` : 'transparent'}
                      className={`relative overflow-hidden rounded-full transition-all duration-300`}
                    >
                      <Tooltip label={`Tối thiểu: ${level.minPoint} điểm`}>
                        <Image src={`/images/png/${level.thumbnail}`} width={60} height={40} alt='vip' />
                      </Tooltip>
                    </Center>
                  );
                })}
              </Flex>
              <Center mt={'md'}>
                <Text size='sm' c='dimmed'>
                  <b>{userInfor?.pointUser}</b> điểm tích lũy |<b> {levelInfo.viName}</b>
                </Text>
              </Center>
            </Box>
          </Center>
        </Card>
      </GridCol>
    </Grid>
  );
}
