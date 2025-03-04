'use client';

import {
  Accordion,
  Box,
  Button,
  CheckIcon,
  Divider,
  Drawer,
  Flex,
  Paper,
  Radio,
  ScrollArea,
  ScrollAreaAutosize,
  Skeleton,
  Stack,
  Text
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconFilter } from '@tabler/icons-react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { breakpoints } from '~/app/lib/utils/constants/device';
import { api } from '~/trpc/react';
import FilterPriceMenu from './FilterPrice';
import FilterMenu from './FilterSort';

const priceRanges = [
  {
    value: [0, 50000],
    label: 'Dưới 50.000đ'
  },
  {
    value: [50000, 100000],
    label: 'Từ 50.000đ - 100.000đ'
  },
  {
    value: [100000, 200000],
    label: 'Từ 100.000đ - 200.000đ'
  },
  {
    value: [200000, 500000],
    label: 'Từ 300.000đ - 500.000đ'
  }
];

export function CategoryNav() {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const { data, isLoading } = api.Category.getAll.useQuery();
  const { data: materialData } = api.Material.getAll.useQuery();
  const categories = data ?? [];
  const materials = materialData ?? [];

  const [valuePrice, setValuePrice] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);
  const [valueSort, setValueSort] = useState<any[]>(
    params
      .getAll('sort')
      .join(',')
      .split(',')
      .filter(i => i != '')
  );

  useEffect(() => {
    const query = new URLSearchParams(params);
    if (valuePrice?.length > 0) {
      query.set(
        'price',
        valuePrice
          ?.split(',')
          .filter((i: any) => i != '')
          .join('-')
      );
    } else {
      query.delete('price');
    }
    router.push(`${pathname}?${query.toString()}`);
  }, [valuePrice]);

  const content = (
    <>
      <Paper shadow='md' className='h-[max-content] rounded-md border-green-600' mt={{ base: 'xs', md: 0 }} mb={20}>
        <Box className='rounded-t-md bg-green-600 p-2 text-white'>
          <Text size='sm' fw={700}>
            DANH MỤC SẢN PHẨM
          </Text>
        </Box>

        {isLoading ? (
          [1, 2, 3, 4, 5].map(item => {
            return <Skeleton key={item} height={40} my={6} width='100%' radius='xs' />;
          })
        ) : (
          <Accordion p={0}>
            <Link className='h-full w-full text-white no-underline' href={`/thuc-don`}>
              <Button
                w={'100%'}
                h={'100%'}
                radius={0}
                py={'xs'}
                variant='subtle'
                className='bg-[#f8c144] text-black transition-all duration-200 ease-in-out hover:bg-[#008b4b] hover:text-white'
              >
                Tất cả
              </Button>
            </Link>
            {categories.map(category => (
              <Accordion.Item key={category?.id} value={category?.name}>
                <Accordion.Control
                  c={
                    params.get('danh-muc') === category.tag ||
                    category.subCategory.some(item => item.tag === params.get('loai-san-pham'))
                      ? '#008b4b'
                      : ''
                  }
                >
                  <Text
                    size='sm'
                    fw={
                      params.get('danh-muc') === category.tag ||
                      category.subCategory.some(item => item.tag === params.get('loai-san-pham'))
                        ? 900
                        : 500
                    }
                  >
                    {category?.name}
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap='xs'>
                    {category.subCategory.map(item => (
                      <Link
                        key={item?.id}
                        className='h-full w-full text-white no-underline'
                        href={`/thuc-don?danh-muc=${category.tag}&loai-san-pham=${item.tag}`}
                      >
                        <Button
                          fullWidth
                          py={'xs'}
                          key={item?.id}
                          variant='subtle'
                          className={clsx(
                            'bg-[#008b4b] transition-all duration-200 ease-in-out hover:bg-[#f8c144] hover:text-black',
                            item.tag === params.get('loai-san-pham') ? 'bg-[#f8c144] text-black' : 'text-white'
                          )}
                        >
                          {item?.name}
                        </Button>
                      </Link>
                    ))}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Paper>

      <Paper shadow='md' className='border-1 rounded-md border-green-600' h={'max-content'} pb={'md'}>
        <ScrollArea className='flex-grow'>
          <Box className='rounded-t-md bg-green-600 p-2 text-white'>
            <Text size='sm' fw={700}>
              BỘ LỌC SẢN PHẨM
            </Text>
          </Box>
          <Stack className='mt-4' gap={'md'} px={'xs'}>
            <Stack gap='xs'>
              <Flex align={'center'} justify={'space-between'}>
                <Text size='md' fw={700}>
                  CHỌN MỨC GIÁ
                </Text>
                {valuePrice && (
                  <Button
                    size='sm'
                    fw={700}
                    w={'max-content'}
                    color='red'
                    onClick={() => setValuePrice(null)}
                    variant='subtle'
                  >
                    Xóa lọc
                  </Button>
                )}
              </Flex>
              <ScrollAreaAutosize mah={260} scrollbarSize={6} type='auto'>
                <Stack gap='xs'>
                  {priceRanges.map(range => (
                    <>
                      <Radio
                        icon={CheckIcon}
                        color='green.9'
                        checked={valuePrice === range.value.toString()}
                        key={range.value + range.label}
                        value={range.value.toString()}
                        onChange={e => setValuePrice(e.currentTarget.value)}
                        name='range-price'
                        label={range.label}
                        className='hover:text-green-700'
                      />
                    </>
                  ))}
                </Stack>
              </ScrollAreaAutosize>
            </Stack>

            <Divider p={0} m={0} />

            {materials?.length > 0 && (
              <Stack gap='xs'>
                <Text size='md' fw={700}>
                  LOẠI
                </Text>
                <ScrollAreaAutosize mah={260} scrollbarSize={6} type='auto'>
                  <Stack gap='xs'>
                    {materials.map(type => (
                      <>
                        <Radio
                          icon={CheckIcon}
                          color='green.9'
                          name='type'
                          key={type?.id}
                          label={type?.name}
                          className='hover:text-green-700'
                        />
                      </>
                    ))}
                  </Stack>
                </ScrollAreaAutosize>
              </Stack>
            )}
          </Stack>
        </ScrollArea>
      </Paper>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Flex align='center' justify='space-between'>
          <Button
            leftSection={<IconFilter size={16} />}
            onClick={() => setDrawerOpened(true)}
            variant='outline'
            color='green.9'
          >
            Lọc sản phẩm
          </Button>

          <FilterPriceMenu />
          <FilterMenu valueSort={valueSort} setValueSort={setValueSort} />
        </Flex>
        <Drawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          size='100%'
          title='Danh mục & Bộ lọc'
          classNames={{
            header: 'bg-green-600 text-white',
            title: 'text-white'
          }}
        >
          {content}
        </Drawer>
      </>
    );
  }

  return <Box className='h-full w-72 border-r bg-white'>{content}</Box>;
}
