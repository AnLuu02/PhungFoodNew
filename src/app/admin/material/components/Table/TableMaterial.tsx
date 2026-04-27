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
  Table,
  Text,
  Title
} from '@mantine/core';
import { IconMeat } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import CustomPagination from '~/components/Pagination';
import PageSizeSelector from '~/components/Perpage';
import { SearchInput } from '~/components/Search/SearchInput';
import { categoryMaterials } from '~/constants';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { randomColorHex } from '~/lib/FuncHandler/RandomColorHex';
import { api } from '~/trpc/react';
import { CreateManyMaterialButton, DeleteMaterialButton, UpdateMaterialButton } from '../Button';

export default function TableMaterial({ s, data, allData }: { s: string; data: any; allData: any }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const { data: dataClient } = api.Material.find.useQuery({ skip: +page, take: +limit, s }, { initialData: data });

  const { data: allDataClient } = api.Material.getAll.useQuery(undefined, { initialData: allData });
  const currentItems = dataClient?.materials || [];
  const dataFilter = useMemo(() => {
    let keys: any = {};
    Object.keys(categoryMaterials)?.map(k => {
      keys[k] = 0;
    });
    if (!allDataClient) return [];
    const summary = allDataClient.reduce((acc: any, item: any) => {
      acc[item.category] += 1;
      return acc;
    }, keys);

    return Object.entries(categoryMaterials).map(([key, value]) => ({
      label: value,
      tag: key,
      value: summary?.[key],
      icon: IconMeat,
      color: randomColorHex()
    }));
  }, [allDataClient]);

  return (
    <>
      <SimpleGrid cols={5}>
        {dataFilter?.map((item, index) => {
          const IconR = item.icon;
          return (
            <Link href={`/admin/material?s=${item.tag}`}>
              <Card
                style={{ backgroundColor: item.color + 10 }}
                shadow='md'
                radius={'lg'}
                pos={'relative'}
                key={index}
                p={'md'}
              >
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
            </Link>
          );
        })}
      </SimpleGrid>
      <Paper radius={'lg'} withBorder shadow='md' p={'md'}>
        <Group justify='space-between'>
          <SearchInput width={400} />
          <Group>
            <Select
              allowDeselect={false}
              value={searchParams.get('s') || 'all'}
              onChange={value => {
                if (value === 'all') params.delete('s');
                else {
                  params.set('s', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url, { scroll: false });
              }}
              data={[
                { value: 'all', label: 'Tất cả danh mục' },
                ...Object.entries(categoryMaterials)?.map(([value, label]) => ({
                  value,
                  label
                }))
              ]}
              nothingFoundMessage='Không tìm thấy'
            />
            <CreateManyMaterialButton />
          </Group>
        </Group>
      </Paper>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Tên
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Mô tả
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Danh mục
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Ngày tạo
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Thao tác
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.name}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.description}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Badge>{row.category}</Badge>
                  </Table.Td>
                  <Table.Td className='text-sm'>{formatDateViVN(row.createdAt)}</Table.Td>
                  <Table.Td className='text-sm'>
                    <Group className='text-center'>
                      <Group>
                        <UpdateMaterialButton id={row.id} />
                        <DeleteMaterialButton id={row.id} />
                      </Group>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3} className='bg-gray-100 text-center dark:bg-dark-card'>
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
    </>
  );
}
