'use client';
import {
  Avatar,
  Badge,
  Box,
  Card,
  Center,
  Flex,
  Grid,
  GridCol,
  Group,
  Progress,
  Stack,
  Text,
  Tooltip
} from '@mantine/core';
import { UserLevel } from '@prisma/client';
import { IconUpload } from '@tabler/icons-react';
import LoadingComponent from '~/app/_components/Loading/Loading';
import { UpdateUserButton } from '~/app/admin/user/components/Button';
import { formatDate } from '~/app/lib/utils/func-handler/formatDate';
import { getColorLevelUser, getLevelUser } from '~/app/lib/utils/func-handler/get-level-user';
import { getStatusColor, getTotalOrderStatus } from '~/app/lib/utils/func-handler/get-status-order';
import { LocalGender, LocalOrderStatus } from '~/app/lib/utils/zod/EnumType';
export const mockOrders = [
  { id: '1', date: '2023-05-01', total: 99.99, status: 'completed' },
  { id: '2', date: '2023-05-15', total: 149.99, status: 'processing' },
  { id: '3', date: '2023-05-20', total: 79.99, status: 'canceled' },
  { id: '4', date: '2023-06-01', total: 189.99, status: 'completed' },
  { id: '5', date: '2023-06-10', total: 59.99, status: 'processing' },
  { id: '6', date: '2023-06-15', total: 129.99, status: 'completed' }
];

export default function UserInfo({ user, isLoading }: any) {
  const mockOrders =
    user?.order?.map((order: any) => ({
      id: order.id,
      date: new Date(order.createdAt).toISOString().split('T')[0] || new Date('yyyy-mm-dd'),
      total: order.total,
      status: order.status
    })) || [];

  const statusObj = getTotalOrderStatus(mockOrders);

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <Grid p={0}>
      <GridCol span={{ base: 12, sm: 12, md: 6 }}>
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <Group mb='xs'>
            <Tooltip label={'Change Avatar'}>
              <Box w={80} h={80} pos={'relative'} className='group cursor-pointer overflow-hidden rounded-full'>
                <Avatar src={user?.image?.url} size={'100%'} radius={40} />
                <Flex className='absolute inset-0 hidden cursor-pointer group-hover:block group-hover:bg-[rgba(0,0,0,0.4)]'>
                  <Center className='h-full w-full' component='label'>
                    <IconUpload size={24} stroke={1.5} color='white' />
                    <input type='file' hidden accept='image/*' />
                  </Center>
                </Flex>
              </Box>
            </Tooltip>
            <div>
              <Text size='xl' fw={700}>
                {user?.name}
              </Text>
              <Badge color='gray' variant='transparent' bg={'gray.2'}>
                <Flex align={'center'} gap={5}>
                  <Text fw={700} size='xs'>
                    Cấp V.I.P:
                  </Text>
                  <Text fw={700} size='xs' c={getColorLevelUser(user?.level as UserLevel)}>
                    {getLevelUser(user?.level as UserLevel)}
                  </Text>
                </Flex>
              </Badge>
              <Badge ml={5}>{user?.pointLevel}</Badge>
            </div>
            <UpdateUserButton email={user?.email || ('' as string)} isClient={true} />
          </Group>

          <Grid>
            <Grid.Col span={6}>
              <Text size='sm' fw={700}>
                Email
              </Text>
              <Text size='sm' c='dimmed'>
                {user?.email}
              </Text>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text fw={700} size='sm'>
                Gender
              </Text>
              <Text size='sm' c='dimmed'>
                {user?.gender || LocalGender.OTHER}
              </Text>
            </Grid.Col>

            {user?.date_of_birth && (
              <Grid.Col span={6}>
                <Text fw={700} size='sm'>
                  Date of Birth
                </Text>
                <Text size='sm' c='dimmed'>
                  {formatDate(user?.date_of_birth)}
                </Text>
              </Grid.Col>
            )}

            {user?.phone && (
              <Grid.Col span={6}>
                <Text fw={700} size='sm'>
                  Phone
                </Text>
                <Text size='sm' c='dimmed'>
                  {user?.phone}
                </Text>
              </Grid.Col>
            )}

            {user?.role && (
              <Grid.Col span={6}>
                <Text fw={700} size='sm'>
                  Role
                </Text>
                <Text size='sm' c='dimmed'>
                  {user?.role?.name}
                </Text>
              </Grid.Col>
            )}

            {user?.address?.fullAddress && (
              <Grid.Col span={12}>
                <Text fw={700} size='sm'>
                  Address
                </Text>
                <Text size='sm' c='dimmed'>
                  {user?.address?.fullAddress}
                </Text>
              </Grid.Col>
            )}
          </Grid>
        </Card>
      </GridCol>
      <GridCol span={{ base: 12, sm: 12, md: 6 }}>
        <Card shadow='sm' padding='lg' radius='md' withBorder>
          <Stack gap='md'>
            <Flex wrap={'wrap'} align={'center'} gap={10}>
              <Badge color={getStatusColor(LocalOrderStatus.COMPLETED)} size='lg' w={'max-content'}>
                <Text ta='center' fw={700} size={'sm'}>
                  <Text component='span' fw={700} mr={5}>
                    {statusObj.completed}
                  </Text>
                  Hoàn thành
                </Text>
              </Badge>
              <Badge color={getStatusColor(LocalOrderStatus.PROCESSING)} size='lg' w={'max-content'}>
                <Text ta='center' fw={700} size={'sm'}>
                  <Text component='span' fw={700} mr={5}>
                    {statusObj.processing}
                  </Text>
                  Chưa thanh toán
                </Text>
              </Badge>
              <Badge color={getStatusColor(LocalOrderStatus.PENDING)} size='lg' w={'max-content'}>
                <Text ta='center' fw={700} size={'sm'}>
                  <Text component='span' fw={700} mr={5}>
                    {statusObj.pending}
                  </Text>
                  Chờ xử lý
                </Text>
              </Badge>
              <Badge color={getStatusColor(LocalOrderStatus.DELIVERED)} size='lg' w={'max-content'}>
                <Text ta='center' fw={700} size={'sm'}>
                  <Text component='span' fw={700} mr={5}>
                    {statusObj.delivered}
                  </Text>
                  Đang giao hàng
                </Text>
              </Badge>
              <Badge color={getStatusColor(LocalOrderStatus.CANCELLED)} size='lg' w={'max-content'}>
                <Text ta='center' fw={700} size={'sm'}>
                  <Text component='span' fw={700} mr={5}>
                    {statusObj.canceled}
                  </Text>
                  Đã hủy
                </Text>
              </Badge>
            </Flex>

            <Box>
              <Text fw={700} size='sm' mb='xs'>
                Tỷ lệ hoàn thành đơn hàng
              </Text>
              <Progress value={statusObj.completionRate} size='sm' radius='xl' />
              <Text size='sm' c='dimmed' mt='xs'>
                {statusObj.completionRate.toFixed(2)}% đơn đặt hàng của bạn đã được hoàn thành thành công
              </Text>
            </Box>

            <Box>
              <Flex align={'center'} gap={5} mb='xs'>
                <Text fw={700} size='sm'>
                  Cấp V.I.P:
                </Text>
                <Text fw={700} size='sm' c={getColorLevelUser(user?.level as UserLevel)}>
                  {getLevelUser(user?.level as UserLevel)}
                </Text>
              </Flex>
              <Progress.Root size={'xl'}>
                <Tooltip label='ĐỒNG'>
                  <Progress.Section value={33} color='#CD7F32'>
                    <Progress.Label>ĐỒNG</Progress.Label>
                  </Progress.Section>
                </Tooltip>

                <Tooltip label='BẠC'>
                  <Progress.Section value={28} color=' #C0C0C0'>
                    <Progress.Label>BẠC</Progress.Label>
                  </Progress.Section>
                </Tooltip>

                <Tooltip label='VÀNG'>
                  <Progress.Section value={15} color=' #FFD700'>
                    <Progress.Label>VÀNG</Progress.Label>
                  </Progress.Section>
                </Tooltip>
                <Tooltip label='BẠCH KIM'>
                  <Progress.Section value={15} color='#E5E4E2'>
                    <Progress.Label>BẠCH KIM</Progress.Label>
                  </Progress.Section>
                </Tooltip>
                <Tooltip label='KIM CƯƠNG'>
                  <Progress.Section value={15} color='#B9F2FF'>
                    <Progress.Label>KIM CƯƠNG</Progress.Label>
                  </Progress.Section>
                </Tooltip>
              </Progress.Root>
            </Box>
          </Stack>
        </Card>
      </GridCol>
    </Grid>
  );
}
