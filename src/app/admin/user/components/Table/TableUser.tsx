'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Divider,
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
import { FindUser } from '~/shared/type-trpc/user.type-trpc';
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
  const { data: allDataClient } = api.User.getUsersWithRelationBase.useQuery(undefined);
  const currentItems = dataClient?.users || [];

  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];
    const summary = allDataClient.reduce(
      (acc: { total: number; customers: number; staff: number; block: number }, item) => {
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
          <SearchInput w={500} />
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
              radius='lg'
              p='lg'
              pos='relative'
              className={`overflow-hidden border-slate-200/80 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-dark-card ${
                item.role?.name !== UserRole.CUSTOMER ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-blue-500'
              }`}
            >
              <Group
                gap={4}
                pos='absolute'
                top={16}
                right={16}
                className='backdrop-blur-xs shadow-2xs z-10 rounded-lg border border-slate-100 bg-white/80 p-1 dark:bg-dark-card/80'
              >
                <UpdatePermissions email={item.email} />
                <UpdateUserButton email={item.email} />
                <DeleteUserButton id={item.id} />
              </Group>

              <Stack gap='md'>
                <div className='flex flex-col justify-between gap-3 pr-28 sm:flex-row sm:items-center'>
                  <Stack gap={2}>
                    <Highlight
                      size='md'
                      fw={700}
                      highlight={s}
                      className='tracking-tight text-slate-900 dark:text-white'
                    >
                      {item.name || 'Đang cập nhật...'}
                    </Highlight>
                    <Highlight size='xs' c='dimmed' highlight={s} className='font-medium'>
                      {item.email || 'Đang cập nhật...'}
                    </Highlight>
                  </Stack>

                  <Group gap={6} wrap='wrap'>
                    <Badge
                      size='sm'
                      variant='light'
                      color={item.role?.name !== UserRole.ADMIN ? 'blue' : 'red'}
                      className='px-2.5 font-semibold'
                    >
                      {item.role?.viName || 'Đang cập nhật...'}
                    </Badge>

                    <Badge
                      size='sm'
                      variant='dot'
                      color={item.isActive ? 'teal' : 'red'}
                      className='bg-slate-50 font-medium dark:bg-slate-800'
                    >
                      {item.isActive ? 'Hoạt động' : 'Bị cấm'}
                    </Badge>
                  </Group>
                </div>

                <Divider className='my-0 border-slate-100 dark:border-slate-800' />

                <div className='grid grid-cols-2 items-start gap-4 sm:grid-cols-3 lg:grid-cols-5'>
                  <Stack gap={2}>
                    <Text size='xs' c='dimmed' fw={600} className='text-[11px] uppercase tracking-wider'>
                      Điện thoại
                    </Text>
                    <Highlight size='sm' highlight={s} className='font-medium text-slate-700 dark:text-slate-200'>
                      {item.phone || 'Đang cập nhật...'}
                    </Highlight>
                  </Stack>

                  <Stack gap={2}>
                    <Text size='xs' c='dimmed' fw={600} className='text-[11px] uppercase tracking-wider'>
                      Ngày tạo
                    </Text>
                    <Text size='sm' className='font-medium text-slate-700 dark:text-slate-200'>
                      {formatDateViVN(item.createdAt)}
                    </Text>
                  </Stack>

                  <Stack gap={2}>
                    <Text size='xs' c='dimmed' fw={600} className='text-[11px] uppercase tracking-wider'>
                      Điểm tích lũy
                    </Text>
                    <Text size='sm' className='font-semibold text-blue-600 dark:text-blue-400'>
                      {item.pointUser} pts
                    </Text>
                  </Stack>

                  <Stack gap={2}>
                    <Text size='xs' c='dimmed' fw={600} className='text-[11px] uppercase tracking-wider'>
                      Cấp điểm
                    </Text>
                    <Text size='sm' fw={600} className='text-amber-600 dark:text-amber-400'>
                      {INFO_LEVEL_USER[item.level || UserLevel.BRONZE]?.viName}
                    </Text>
                  </Stack>

                  <Stack gap={2} className='col-span-2 sm:col-span-3 lg:col-span-1'>
                    <Text size='xs' c='dimmed' fw={600} className='text-[11px] uppercase tracking-wider'>
                      Địa chỉ
                    </Text>
                    <Spoiler
                      maxHeight={22}
                      showLabel={'Xem tất cả'}
                      hideLabel={'Thu gọn'}
                      p={0}
                      m={0}
                      classNames={{
                        control: 'mt-0.5 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400'
                      }}
                    >
                      <Highlight size='sm' highlight={s} className='leading-snug text-slate-700 dark:text-slate-200'>
                        {item.address?.fullAddress || 'Đang cập nhật...'}
                      </Highlight>
                    </Spoiler>
                  </Stack>
                </div>
              </Stack>
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
