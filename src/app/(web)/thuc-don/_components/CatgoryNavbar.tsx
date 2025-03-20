'use client';

import {
  Accordion,
  Box,
  Button,
  Checkbox,
  CheckIcon,
  Divider,
  Drawer,
  Flex,
  Group,
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
import Empty from '~/app/_components/Empty';
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
  const { data: materialData, isLoading: isLoadingMaterials } = api.Material.getAll.useQuery();
  const categories = data ?? [];
  const materials = materialData ?? [];
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);
  const query = new URLSearchParams(params);
  const [valueMaterials, setValueMaterials] = useState<string[]>([...params.getAll('nguyen-lieu')]);

  useEffect(() => {
    setValueMaterials([...params.getAll('nguyen-lieu')]);
  }, [params]);

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
            return <Skeleton key={item} height={20} my={6} width='100%' radius='md' />;
          })
        ) : (
          <Accordion p={0}>
            <Link className='h-full w-full' href={`/thuc-don`}>
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
                    {category?.name} ({category?.subCategory?.length || 0})
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap='xs'>
                    {category.subCategory.map(item => (
                      <Link
                        key={item?.id}
                        className='h-full w-full'
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
                          {item?.name} ({item?.product?.length || 0})
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
                {params.get('price') && (
                  <Button
                    size='sm'
                    fw={700}
                    w={'max-content'}
                    color='red'
                    onClick={() => {
                      query.delete('price');
                      router.push(`${pathname}?${query.toString()}`);
                    }}
                    variant='subtle'
                  >
                    Xóa
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
                        checked={params.get('price') === range.value.toString()}
                        key={range.value + range.label}
                        value={range.value.toString()}
                        onChange={e => {
                          if (e.target.checked) {
                            query.set('price', e.target.value);
                          }
                          router.push(`${pathname}?${query.toString()}`);
                        }}
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
            {isLoading ? (
              [1, 2, 3, 4, 5].map(item => {
                return <Skeleton key={item} height={20} width='100%' radius='md' />;
              })
            ) : materials?.length > 0 ? (
              <Stack gap='xs'>
                <Flex align={'center'} justify={'space-between'}>
                  <Text size='md' fw={700}>
                    NGUYÊN LIỆU
                  </Text>
                  {valueMaterials?.length > 0 && (
                    <>
                      <Button
                        size='sm'
                        fw={700}
                        w={'max-content'}
                        onClick={() => {
                          if (valueMaterials?.length > 0) {
                            query.delete('nguyen-lieu');
                            valueMaterials.map((item, index) => {
                              query.append('nguyen-lieu', item);
                            });
                          } else {
                            query.delete('nguyen-lieu');
                          }
                          router.push(`${pathname}?${query.toString()}`);
                        }}
                        variant='subtle'
                      >
                        Tìm kiếm
                      </Button>
                      <Button
                        size='sm'
                        fw={700}
                        w={'max-content'}
                        color='red'
                        onClick={() => {
                          setValueMaterials([]);
                          query.delete('nguyen-lieu');
                          router.push(`${pathname}?${query.toString()}`);
                        }}
                        variant='subtle'
                      >
                        Xóa
                      </Button>
                    </>
                  )}
                </Flex>
                <ScrollAreaAutosize mah={260} scrollbarSize={6} type='auto'>
                  <Stack gap='xs'>
                    <Checkbox.Group value={valueMaterials} onChange={setValueMaterials}>
                      <Group mt='xs'>
                        {materials.map(type => (
                          <>
                            <Checkbox
                              icon={CheckIcon}
                              color='green.9'
                              name='type'
                              value={type?.tag}
                              key={type?.id}
                              label={type?.name}
                              className='hover:text-green-700'
                            />
                          </>
                        ))}
                      </Group>
                    </Checkbox.Group>
                  </Stack>
                </ScrollAreaAutosize>
              </Stack>
            ) : (
              <Empty title='Chưa có nguyên liệu nào' hasButton={false} size='sm' content='' />
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
          <FilterMenu />
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
