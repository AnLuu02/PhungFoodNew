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
import { useDisclosure } from '@mantine/hooks';
import { Gender, OrderStatus, UserLevel } from '@prisma/client';
import { IconUpload } from '@tabler/icons-react';
import LoadingComponent from '~/app/_components/Loading';
import { UpdateUserButton } from '~/app/admin/user/components/Button';
import { formatDate } from '~/app/lib/utils/format/formatDate';
import { getLevelUser } from '~/app/lib/utils/func-handler/get-level-user';
export const mockOrders = [
  { id: '1', date: '2023-05-01', total: 99.99, status: 'completed' },
  { id: '2', date: '2023-05-15', total: 149.99, status: 'processing' },
  { id: '3', date: '2023-05-20', total: 79.99, status: 'canceled' },
  { id: '4', date: '2023-06-01', total: 189.99, status: 'completed' },
  { id: '5', date: '2023-06-10', total: 59.99, status: 'processing' },
  { id: '6', date: '2023-06-15', total: 129.99, status: 'completed' }
];
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, Anytown, USA',
  avatar: '/placeholder.svg',
  vipLevel: 'Gold'
};

export default function UserInfo({ user, isLoading }: any) {
  const [opened, { open, close }] = useDisclosure(false);
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      mockUser.avatar = imageUrl;
      close();
      open();
    }
  };
  const getVIPProgress = (userDb: any) => {
    return (userDb?.pointLevel || 0) * 100;
  };

  const mockOrders =
    user?.order?.map((order: any) => ({
      id: order.id,
      date: new Date(order.createdAt).toISOString().split('T')[0] || new Date('yyyy-mm-dd'),
      total: order.total,
      status: order.status
    })) || [];

  const getOrderStats = () => {
    const completed = mockOrders.filter((order: any) => order.status === OrderStatus.COMPLETED).length || 0;
    const processing = mockOrders.filter((order: any) => order.status === OrderStatus.PENDING).length || 0;
    const canceled = mockOrders.filter((order: any) => order.status === OrderStatus.CANCELLED).length || 0;
    const total = mockOrders.length || 0;
    const completionRate = (completed / total) * 100 || 0;
    return { completed, processing, canceled, completionRate };
  };

  const stats = getOrderStats();

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <Grid p={0}>
      <GridCol span={{ base: 12, sm: 6, md: 6 }}>
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <Group mb='xs'>
            <Tooltip label={'Change Avatar'}>
              <Box w={80} h={80} pos={'relative'} className='group cursor-pointer overflow-hidden rounded-full'>
                <Avatar src={user?.image?.url} size={'100%'} radius={40} />
                <Flex className='absolute inset-0 hidden cursor-pointer group-hover:block group-hover:bg-[rgba(0,0,0,0.4)]'>
                  <Center className='h-full w-full' component='label'>
                    <IconUpload size={24} stroke={1.5} color='white' />
                    <input type='file' hidden accept='image/*' onChange={handleAvatarChange} />
                  </Center>
                </Flex>
              </Box>
            </Tooltip>
            <div>
              <Text size='xl' fw={700}>
                {user?.name}
              </Text>
              <Badge color='gray' variant='transparent' bg={'gray.2'}>
                Cấp V.I.P: <b className='text-[#F8C144]'>{getLevelUser(user?.level)}</b>
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
                {user?.gender || Gender.OTHER}
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
      <GridCol span={{ base: 12, sm: 6, md: 6 }}>
        <Card shadow='sm' padding='lg' radius='md' withBorder>
          <Stack gap='md'>
            <Grid p={0} m={0}>
              <GridCol span={{ base: 12, sm: 12, md: 12, lg: 4 }}>
                <Badge color='green' size='lg' w={'100%'}>
                  <Text ta='center' fw={700} size={'sm'}>
                    <Text component='span' fw={700} mr={5}>
                      {stats.completed}
                    </Text>
                    Hoàn thành
                  </Text>
                </Badge>
              </GridCol>
              <GridCol span={{ base: 12, sm: 12, md: 12, lg: 4 }}>
                <Badge color='yellow.9' size='lg' w={'100%'}>
                  <Text ta='center' fw={700} size={'sm'}>
                    <Text component='span' fw={700} mr={5}>
                      {stats.processing}
                    </Text>
                    Đang xử lý
                  </Text>
                </Badge>
              </GridCol>
              <GridCol span={{ base: 12, sm: 12, md: 12, lg: 4 }}>
                <Badge color='red' size='lg' w={'100%'}>
                  <Text ta='center' fw={700} size={'sm'}>
                    <Text component='span' fw={700} mr={5}>
                      {stats.canceled}
                    </Text>
                    Đã hủy
                  </Text>
                </Badge>
              </GridCol>
            </Grid>

            <Box>
              <Text fw={700} size='sm' mb='xs'>
                Tỷ lệ hoàn thành đơn hàng
              </Text>
              <Progress value={stats.completionRate} size='sm' radius='xl' />
              <Text size='sm' color='dimmed' mt='xs'>
                {stats.completionRate.toFixed(2)}% đơn đặt hàng của bạn đã được hoàn thành thành công
              </Text>
            </Box>

            <Box>
              <Text fw={700} size='sm' mb='xs'>
                Cấp V.I.P: {getLevelUser(user?.level as UserLevel)}
              </Text>
              {/* <Progress value={getVIPProgress(user)} size='sm' radius='xl' /> */}
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

              {/* <Group mt='xs'>
                {vipLevels.map(level => (
                  <Text key={level} size='sm' color='dimmed'>
                    {level}
                  </Text>
                ))}
              </Group> */}
            </Box>
          </Stack>
        </Card>
      </GridCol>
    </Grid>
  );
}
