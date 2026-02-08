'use client';

import { Badge, Box, Divider, Group, Highlight, Table, Text } from '@mantine/core';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { DeleteReviewButton, UpdateReviewButton } from '../Button';

import { ActionIcon, Card, Flex, Paper, Select, SimpleGrid, Title } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { CommentsList } from '~/components/Comments/CommentsList';
import { SearchInput } from '~/components/Search/SearchInput';
import { api } from '~/trpc/react';
import { ReviewAll, ReviewFind } from '~/types/client-type-trpc';

export default function TableReview({ s, data, allData }: { s: string; data: ReviewFind; allData: ReviewAll }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const sortArr = searchParams.getAll('sort');

  const { data: dataClient } = api.Review.find.useQuery(
    { skip: +page, take: +limit, s, sort: sortArr },
    { initialData: data }
  );
  const { data: allDataClient } = api.Review.getAll.useQuery(undefined, { initialData: allData });

  const currentItems = dataClient.reviews || [];
  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];

    const summary = allDataClient.reduce(
      (
        acc: { total: number; gte4star: number; from2to4: number; poorStar: number },
        item: NonNullable<ReviewAll>[0]
      ) => {
        acc.total += 1;
        if (item.rating > 4) {
          acc.gte4star += 1;
        } else if (item.rating >= 2 && item.rating <= 4) {
          acc.from2to4 += 1;
        } else {
          acc.poorStar += 1;
        }
        return acc;
      },
      { total: 0, gte4star: 0, from2to4: 0, poorStar: 0 }
    );

    return [
      {
        label: 'Tổng số đánh giá',
        value: summary.total,
        icon: IconStar,
        key: '1-star',
        color: '#446DAE'
      },
      {
        label: 'Trên 4 sao',
        value: summary.gte4star,
        icon: IconStar,
        key: '2-star',
        color: '#499764'
      },
      {
        label: 'Từ 2 => 4 sao',
        value: summary.from2to4,
        icon: IconStar,
        key: '3-star',
        color: '#C0A453'
      },
      {
        label: '1 sao',
        value: summary.poorStar,
        icon: IconStar,
        key: '4-star',
        color: '#CA041D'
      }
    ];
  }, [allDataClient]);

  return (
    <>
      <SimpleGrid cols={4}>
        {dataFilter?.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card
              shadow='md'
              radius={'lg'}
              pos={'relative'}
              key={index}
              p={'md'}
              style={{ backgroundColor: item.color + 10 }}
            >
              <Flex align={'center'} gap={'md'}>
                <ActionIcon variant='light' size={'xl'} radius={'md'} color={item.color}>
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
      <Paper radius={'lg'} withBorder shadow='md' p={'md'}>
        <Group justify='space-between'>
          <SearchInput width={500} />
          <Group>
            <Select
              allowDeselect={false}
              placeholder='Sắp xếp'
              radius='md'
              value={searchParams.get('sort') || 'all'}
              onChange={value => {
                if (value === 'all') params.delete('sort');
                else {
                  params.set('sort', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url);
              }}
              data={[
                { value: 'all', label: 'Tất cả đánh giá' },
                { value: 'rating-asc', label: 'Tăng dần' },
                { value: 'rating-desc', label: 'Giảm dần' }
              ]}
            />

            <Select
              allowDeselect={false}
              placeholder='Bộ lọc'
              radius='md'
              value={searchParams.get('s') || 'all'}
              onChange={value => {
                if (value === 'all') params.delete('s');
                else {
                  params.set('s', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url);
              }}
              data={[
                { value: 'all', label: 'Tất cả đánh giá (sao)' },
                {
                  value: '1-star',
                  label: '⭐'
                },
                {
                  value: '2-star',
                  label: '⭐⭐'
                },
                {
                  value: '3-star',
                  label: '⭐⭐⭐'
                },
                {
                  value: '4-star',
                  label: '⭐⭐⭐⭐'
                },
                {
                  value: '5-star',
                  label: '⭐⭐⭐⭐⭐'
                }
              ]}
            />
          </Group>
        </Group>
      </Paper>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Khách hàng</Table.Th>
              <Table.Th>Sản phẩm</Table.Th>
              <Table.Th>Đánh giá</Table.Th>
              <Table.Th>Bình luận</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map(item => (
                <Table.Tr key={item.id}>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {item.user?.name || ''}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {item.product?.name}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Badge color='blue'>{item.rating} ⭐</Badge>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {item.comment || ''}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'> {formatDateViVN(item.createdAt)} </Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Group>
                      <UpdateReviewButton id={item.id} />
                      <DeleteReviewButton id={item.id} />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6} className='bg-gray-100 text-center dark:bg-dark-card'>
                  <Text size='md' c='dimmed'>
                    Không có bản ghi phù hợp.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Group justify='space-between' align='center' my={'md'}>
        <PageSizeSelector />
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>

      <Divider my={'xl'} />
      <SimpleGrid cols={2}>
        <CommentsList data={currentItems} />
      </SimpleGrid>
    </>
  );
}
