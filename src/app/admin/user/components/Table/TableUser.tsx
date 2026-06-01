'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Flex,
  Group,
  Highlight,
  Paper,
  Select,
  SimpleGrid,
  Spoiler,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { UserLevel } from '@prisma/client';
import { IconAlertTriangle, IconCircleCheck, IconForbid2, IconUserPlus } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import CustomPagination from '~/components/Pagination';
import PageSizeSelector from '~/components/Perpage';
import { SearchInput } from '~/components/Search/SearchInput';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { INFO_LEVEL_USER, UserRole } from '~/shared/constants/user.constants';
import { FindUser, GetAllUser } from '~/shared/type-trpc/user.type-trpc';
import { api } from '~/trpc/react';
import { DeleteUserButton, UpdatePermissions, UpdateUserButton } from '../Button';
export default function TableUser() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();

  const s = searchParams?.get('s') || '';
  const page = searchParams?.get('page') || '1';
  const limit = searchParams?.get('limit') ?? '5';
  const filter = searchParams?.get('filter') ? searchParams?.get('filter') + '@#@$@@' : undefined;
  const sortArr = searchParams?.getAll('sort');

  const { data: dataClient, isLoading } = api.User.find.useQuery({
    page: +page,
    limit: +limit,
    s,
    sort: sortArr,
    filter
  });
  const { data: allDataClient } = api.User.getAll.useQuery(undefined);
  const currentItems = dataClient?.users || [];

  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];
    const summary = allDataClient.reduce(
      (acc: { total: number; customers: number; staff: number; block: number }, item: GetAllUser[number]) => {
        acc.total += 1;
        if (item.role?.name === UserRole.CUSTOMER) {
          acc.customers += 1;
        }
        if (item.role?.name === UserRole.STAFF) {
          acc.staff += 1;
        }
        if (!item.isActive) {
          acc.block += 1;
        }

        return acc;
      },
      { total: 0, customers: 0, staff: 0, block: 0 }
    );

    return [
      {
        label: 'Tổng tài khoản',
        value: summary.total,
        icon: IconUserPlus,
        color: '#446DAE'
      },
      {
        label: 'Khách hàng',
        value: summary.customers,
        icon: IconCircleCheck,
        color: '#499764'
      },
      {
        label: 'Nhân viên',
        value: summary.staff,
        icon: IconAlertTriangle,
        color: '#C0A453'
      },
      {
        label: 'Bị cấm',
        value: summary.block,
        icon: IconForbid2,
        color: '#CA041D'
      }
    ];
  }, [allDataClient]);

  const utils = api.useUtils();
  useEffect(() => {
    if (dataClient?.pagination.hasNext) {
      void utils.User.find.prefetch({ page: +page + 1, limit: +limit, s });
    }
  }, [page]);

  return (
    <>
      <SimpleGrid cols={4}>
        {dataFilter?.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card style={{ backgroundColor: item.color + 10 }} shadow='md' pos={'relative'} key={index} p={'md'}>
              <Flex align={'center'} gap={'md'}>
                <ActionIcon variant='light' size={'xl'} color={item.color}>
                  <IconR size={20} />
                </ActionIcon>
                <Box>
                  <Title order={6} className='font-quicksand'>
                    {item.label}
                  </Title>
                  <Title order={3} className='font-quicksand'>
                    {item.value}
                  </Title>
                </Box>
              </Flex>
            </Card>
          );
        })}
      </SimpleGrid>
      <Paper withBorder shadow='md' p={'md'}>
        <Group justify='space-between'>
          <SearchInput width={500} />
          <Group>
            <Select
              allowDeselect={false}
              placeholder='Sắp xếp'
              value={searchParams.get('sort') || 'all'}
              onChange={value => {
                if (value === 'all') params.delete('sort');
                else {
                  params.set('sort', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url, { scroll: false });
              }}
              data={[
                { value: 'all', label: 'Tất cả đánh giá' },
                { value: 'pointUser-asc', label: 'Điểm tăng dần' },
                { value: 'pointUser-desc', label: 'Điểm giảm dần' },
                { value: 'name-asc', label: 'Tên từ a-z' },
                { value: 'name-desc', label: 'Tên từ z-a' }
              ]}
            />

            <Select
              allowDeselect={false}
              placeholder='Bộ lọc'
              value={searchParams.get('filter') || 'all'}
              onChange={value => {
                if (value === 'all') params.delete('filter');
                else {
                  params.set('filter', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url, { scroll: false });
              }}
              data={[
                { value: 'all', label: 'Tất cả' },
                {
                  value: 'ACTIVE',
                  label: 'Hoaạt động'
                },
                {
                  value: 'INACTIVE',
                  label: 'Tạm khóa'
                },
                {
                  value: 'STAFF',
                  label: 'Nhân viên'
                },
                {
                  value: 'CUSTOMER',
                  label: 'Khách hàng'
                }
              ]}
            />
          </Group>
        </Group>
      </Paper>
      <Stack gap='md'>
        {isLoading ? (
          <CommonSkeleton.Table count={5} />
        ) : currentItems.length > 0 ? (
          currentItems.map((item: FindUser['users'][number]) => (
            <Paper
              key={item.id}
              withBorder
              radius='xl'
              p='md'
              pos={'relative'}
              className={`shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                item.role?.name !== UserRole.CUSTOMER ? 'bg-red-100 dark:bg-transparent' : 'bg-white dark:bg-dark-card'
              }`}
            >
              <Stack className='min-w-0 flex-1'>
                <Group justify='space-between' align='flex-start' wrap='wrap'>
                  <Stack gap={3}>
                    <Highlight size='sm' fw={700} highlight={s}>
                      {item.name || 'Đang cập nhật...'}
                    </Highlight>

                    <Highlight size='xs' c='dimmed' highlight={s}>
                      {item.email || 'Đang cập nhật...'}
                    </Highlight>
                  </Stack>
                </Group>

                <Group gap='80px' wrap='wrap' align='flex-start'>
                  <Stack gap={2}>
                    <Text size='xs' c='dimmed' fw={600}>
                      Điện thoại
                    </Text>
                    <Highlight size='sm' highlight={s}>
                      {item.phone || 'Đang cập nhật...'}
                    </Highlight>
                  </Stack>

                  <Stack gap={2}>
                    <Text size='xs' c='dimmed' fw={600}>
                      Ngày tạo
                    </Text>
                    <Text size='sm'>{formatDateViVN(item.createdAt)}</Text>
                  </Stack>

                  <Stack gap={2}>
                    <Text size='xs' c='dimmed' fw={600}>
                      Điểm
                    </Text>
                    <Text size='sm'>{item.pointUser}</Text>
                  </Stack>

                  <Stack gap={2}>
                    <Text size='xs' c='dimmed' fw={600}>
                      Cấp điểm
                    </Text>
                    <Text size='sm'>{INFO_LEVEL_USER[item.level || UserLevel.BRONZE]?.viName}</Text>
                  </Stack>
                  <Stack gap={2} flex={1}>
                    <Text size='xs' c='dimmed' fw={600}>
                      Địa chỉ
                    </Text>

                    <Spoiler
                      maxHeight={22}
                      showLabel={'Xem tất cả'}
                      hideLabel={'Thu gọn'}
                      p={0}
                      m={0}
                      mb={10}
                      classNames={{
                        control: 'flex w-full justify-end text-xs text-mainColor'
                      }}
                    >
                      <Highlight size='sm' highlight={s}>
                        {item.address?.fullAddress || 'Đang cập nhật...'}
                      </Highlight>
                    </Spoiler>
                  </Stack>
                  <Group gap={8}>
                    <Badge p='sm' color={item.role?.name !== UserRole.ADMIN ? '#195EFE' : 'red'}>
                      {' '}
                      {item.role?.viName || 'Đang cập nhật...'}{' '}
                    </Badge>

                    <Badge variant='filled' color={item.isActive ? 'blue' : 'red'} radius='md' px='sm'>
                      {item.isActive ? 'Hoạt động' : 'Bị cấm'}
                    </Badge>
                  </Group>
                </Group>
              </Stack>

              <Group gap='xs' wrap='nowrap' pos={'absolute'} top={16} right={20}>
                <UpdatePermissions email={item.email} />
                <UpdateUserButton email={item.email} />
                <DeleteUserButton id={item.id} />
              </Group>
            </Paper>
          ))
        ) : (
          <Paper withBorder radius='lg' p='xl' className='bg-gray-100 text-center dark:bg-dark-card'>
            <Text size='md' c='dimmed'>
              Không có bản ghi phù hợp.
            </Text>
          </Paper>
        )}
      </Stack>

      <Group justify='space-between' align='center' my={'md'}>
        <PageSizeSelector />
        <CustomPagination totalPages={dataClient?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
