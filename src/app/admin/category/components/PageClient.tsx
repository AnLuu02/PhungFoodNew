'use client';
import { ActionIcon, Box, Card, Flex, Group, Paper, Select, SimpleGrid, Tabs, Title } from '@mantine/core';
import { IconCategory, IconCategoryPlus, IconCircleCheck } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SearchInput } from '~/components/Search/SearchInput';
import { GetAllCategory } from '~/shared/type-trpc/category.type-trpc';
import { api } from '~/trpc/react';
import { CreateCategoryButton, CreateSubCategoryButton } from './Button';
import TableCategory from './Table/TableCategory';
import TableSubCategory from './Table/TableSubCategory';

export default function CategoryClientManagementPage() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'category' | 'subCategory'>('category');
  const { data: allDataClient } = api.Category.getAll.useQuery(undefined);
  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];
    const summary = allDataClient?.reduce(
      (
        acc: {
          totalCate: number;
          activeCate: number;
          totalSubCate: number;
          activeSubCate: number;
        },
        item: GetAllCategory[number]
      ) => {
        acc.totalCate += 1;
        acc.totalSubCate += item.subCategory?.length || 0;
        if (item.isActive) {
          acc.activeCate += 1;
        }
        item.subCategory?.forEach((subCategory: GetAllCategory[number]['subCategory'][number]) => {
          if (subCategory.isActive) {
            acc.activeSubCate += 1;
          }
        });
        return acc;
      },
      { totalCate: 0, activeCate: 0, totalSubCate: 0, activeSubCate: 0 }
    );

    return [
      {
        label: 'Tổng số danh mục',
        value: summary.totalCate,
        icon: IconCategory,
        color: '#446DAE'
      },
      {
        label: 'Danh mục hoạt động',
        value: summary.activeCate,
        icon: IconCircleCheck,
        color: '#499764'
      },
      {
        label: 'Tổng số danh mục con',
        value: summary.totalSubCate,
        icon: IconCategoryPlus,
        color: '#C0A453'
      },
      {
        label: 'Danh mục con hoạt động',
        value: summary.activeSubCate,
        icon: IconCircleCheck,
        color: '#CA041D'
      }
    ];
  }, [allDataClient]);

  return (
    <>
      <SimpleGrid cols={4}>
        {dataFilter.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card
              shadow='md'
              pos={'relative'}
              key={index}
              p={'md'}
              style={{
                backgroundColor: item.color + 10
              }}
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
          );
        })}
      </SimpleGrid>

      <Tabs
        variant='pills'
        value={activeTab}
        onChange={value => {
          setActiveTab(value as any);
          router.push(`/admin/category`, { scroll: false });
        }}
        styles={{
          tab: {
            border: '1px solid ',
            marginRight: 6
          }
        }}
        classNames={{
          tab: `!border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
        }}
      >
        <Paper withBorder shadow='md' p={'md'}>
          <Tabs.List className='flex items-center justify-between sm:items-start md:items-center'>
            <Group gap={0}>
              <Tabs.Tab size={'md'} fw={700} value={'category'}>
                Danh mục
              </Tabs.Tab>
              <Tabs.Tab size={'md'} fw={700} value={'subCategory'}>
                Danh mục con
              </Tabs.Tab>
            </Group>
            <Group>
              <SearchInput width={300} />

              {activeTab === 'category' ? (
                <CreateCategoryButton />
              ) : (
                <>
                  <Select
                    allowDeselect={false}
                    placeholder='Trạng thái'
                    value={searchParams.get('status') || null}
                    onChange={value => {
                      if (value === 'all') params.delete('status');
                      else params.set('status', value as string);
                      const url = `${location.pathname}?${params.toString()}`;
                      router.push(url, { scroll: false });
                    }}
                    data={[
                      { value: 'all', label: 'Tất cả' },
                      { value: 'active', label: 'Hoạt động' },
                      { value: 'inactive', label: 'Tạm khóa' }
                    ]}
                  />
                  <Select
                    allowDeselect={false}
                    placeholder='Danh mục'
                    value={searchParams.get('category') || null}
                    onChange={value => {
                      if (value === 'all') params.delete('category');
                      else params.set('category', value as string);
                      const url = `${location.pathname}?${params.toString()}`;
                      router.push(url, { scroll: false });
                    }}
                    data={[
                      { value: 'all', label: 'Tất cả' },
                      ...(allDataClient ?? []).map((item: GetAllCategory[number]) => {
                        return {
                          label: item.name,
                          value: item.tag
                        };
                      })
                    ]}
                  />
                  <CreateSubCategoryButton />
                </>
              )}
            </Group>
          </Tabs.List>
        </Paper>

        <Tabs.Panel value={activeTab} mt={'md'}>
          {activeTab === 'category' ? <TableCategory /> : <TableSubCategory />}
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
