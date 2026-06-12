'use client';

import { Box, Button, Divider, Flex, Group, Menu, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useDebouncedValue, useInViewport, useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { IconAlertCircle, IconChevronDown, IconSearch } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Empty from '~/components/Empty';
import { breakpoints } from '~/constants';
import { GetAllCategory } from '~/shared/type-trpc/category.type-trpc';
import { FindInfiniteProduct } from '~/shared/type-trpc/product.type-trpc';
import { api } from '~/trpc/react';
import { QuickMenuItem } from './QuickMenuItem';
import { QuickMenuItemSkeleton } from './QuickMenuItemSkeleton';

const LIMIT_VISIBLE_CATEGORY = 2;
export const QuickMenu = ({ categories, LIMIT_DATA }: { categories: GetAllCategory; LIMIT_DATA: number }) => {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  const utils = api.useUtils();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);
  const { ref, inViewport } = useInViewport();

  const [keyword, setKeyword] = useState('');

  const [_, setCart] = useLocalStorage<any[]>({
    key: 'cart',
    defaultValue: []
  });
  const [searchDebouceValue] = useDebouncedValue(keyword, 500);
  const currentCategory = searchParams.get('danh-muc');
  const searchQuery = searchParams.get('s');
  const visibleCategories = categories?.slice(0, isMobile ? 1 : LIMIT_VISIBLE_CATEGORY) || [];
  const moreCategories = categories?.slice(isMobile ? 1 : LIMIT_VISIBLE_CATEGORY) || [];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    api.Product.findInfiniteProduct.useInfiniteQuery(
      {
        limit: LIMIT_DATA,
        filters: {
          'danh-muc': currentCategory ?? null,
          search: searchQuery ?? ''
        }
      },
      {
        getNextPageParam: lastPage => lastPage.nextCursor,
        staleTime: 1000 * 60 * 5
      }
    );

  useEffect(() => {
    searchDebouceValue ? params.set('s', searchDebouceValue.toString()) : params.delete('s');
    router.push(`${window.location.pathname}?${params}`, { scroll: false });
  }, [searchDebouceValue]);

  useEffect(() => {
    if (inViewport && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inViewport, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handlePrefetch = useCallback(
    (danhMuc: string) => {
      void utils.Product.findInfiniteProduct.prefetchInfinite({
        limit: LIMIT_DATA,
        filters: {
          'danh-muc': danhMuc,
          search: searchQuery ?? ''
        }
      });
    },
    [LIMIT_DATA, utils]
  );

  const products = useMemo(() => {
    return data?.pages.flatMap(p => p.items) || [];
  }, [data]);

  const currentCategoryName = useMemo(() => {
    if (!currentCategory) return null;

    return categories?.find(item => item.tag === currentCategory)?.name || null;
  }, [categories, currentCategory]);

  const handleAddFast = (product: FindInfiniteProduct['items'][number], quantity = 1) => {
    setCart(prev => {
      const existed = prev.find(item => item.id === product.id);

      if (existed) {
        return prev.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: Number(item.quantity || 1) + quantity
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity,
          note: ''
        }
      ];
    });
  };

  if (error) {
    return (
      <Paper className='flex items-center gap-2 border border-red-200 bg-red-50 p-4 text-red-700'>
        <IconAlertCircle size={18} />
        {error.message}
      </Paper>
    );
  }

  return (
    <Stack gap='lg'>
      <Paper
        p={{ base: 'sm', md: 'md' }}
        withBorder
        className='sticky top-20 z-20 overflow-hidden border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-dark-card'
      >
        <Stack gap='md'>
          <Group justify='space-between' align='center' gap='md' wrap='nowrap'>
            <Box className='min-w-0 flex-1'>
              <Group>
                <Box className='h-px w-6 bg-mainColor'></Box>
                <Text size='xs' fw={900} tt='uppercase' lts={1.8} className='text-mainColor'>
                  Tìm món nhanh
                </Text>
              </Group>

              <Text size='sm' c='dimmed' className='mt-0.5 hidden sm:block'>
                Nhập tên món hoặc chọn danh mục để thêm vào giỏ nhanh hơn.
              </Text>
            </Box>

            {currentCategoryName && (
              <Group gap={8} className='hidden sm:flex'>
                <Text
                  size='xs'
                  component={Link}
                  href={'/goi-mon-nhanh'}
                  className='text-dark-dimmed hover:text-subColor hover:underline dark:text-dark-text'
                >
                  Tất cả món
                </Text>

                <Text size='xs' c='dimmed'>
                  /
                </Text>

                <Text size='sm' fw={800} className='text-mainColor'>
                  {currentCategoryName}
                </Text>
              </Group>
            )}
          </Group>

          <Flex align={'center'} className='gap-3' wrap={'wrap'}>
            <Flex
              align='center'
              gap={8}
              className='w-[max-content] rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/5'
            >
              <Link href='/goi-mon-nhanh'>
                <Button
                  size='sm'
                  variant='subtle'
                  className={
                    !currentCategory
                      ? 'bg-mainColor px-4 text-white shadow-sm hover:bg-mainColor hover:text-white dark:bg-dark-card dark:text-mainColor'
                      : 'px-4 text-slate-600 hover:bg-white hover:text-mainColor dark:text-dark-text dark:hover:bg-white/10'
                  }
                >
                  Tất cả
                </Button>
              </Link>

              {visibleCategories.map((item, index) => {
                const active = item.tag === currentCategory;

                return (
                  <Link href={`/goi-mon-nhanh?danh-muc=${item.tag}`} key={`${item.id}-${index}`}>
                    <Button
                      size='sm'
                      variant='subtle'
                      onMouseEnter={() => handlePrefetch(item.tag)}
                      className={
                        active
                          ? 'bg-mainColor px-4 text-white shadow-sm hover:bg-mainColor hover:text-white dark:bg-dark-card dark:text-mainColor'
                          : 'px-4 text-slate-600 hover:bg-white hover:text-mainColor dark:text-dark-text dark:hover:bg-white/10'
                      }
                    >
                      {item.name}
                    </Button>
                  </Link>
                );
              })}

              {moreCategories.length > 0 && (
                <Menu shadow='lg' width={240} position='bottom-end'>
                  <Menu.Target>
                    <Button
                      size='sm'
                      variant='subtle'
                      rightSection={<IconChevronDown size={15} />}
                      className={
                        !!moreCategories.find(item => item.tag === currentCategory)
                          ? 'bg-mainColor px-4 text-white shadow-sm hover:scale-100 hover:bg-mainColor hover:text-white dark:bg-dark-card dark:text-mainColor'
                          : `px-4 text-slate-600 hover:scale-100 hover:bg-white hover:text-mainColor dark:text-dark-text dark:hover:bg-white/10`
                      }
                    >
                      Xem thêm
                    </Button>
                  </Menu.Target>

                  <Menu.Dropdown className='border-slate-200 p-2 dark:border-white/10'>
                    <Menu.Label>Danh mục khác</Menu.Label>

                    {moreCategories.map(item => {
                      const active = item.tag === currentCategory;

                      return (
                        <Menu.Item
                          key={item.id}
                          component={Link}
                          href={`/goi-mon-nhanh?danh-muc=${item.tag}`}
                          onMouseEnter={() => handlePrefetch(item.tag)}
                          className={
                            active
                              ? 'bg-mainColor/10 font-bold text-mainColor'
                              : 'font-semibold text-slate-700 hover:bg-mainColor/10 hover:text-mainColor dark:text-dark-text'
                          }
                        >
                          {item.name}
                        </Menu.Item>
                      );
                    })}
                  </Menu.Dropdown>
                </Menu>
              )}
            </Flex>
            <TextInput
              value={keyword}
              onChange={event => setKeyword(event.currentTarget.value)}
              leftSection={<IconSearch size={18} />}
              placeholder='Tìm món đang hiển thị...'
              size='md'
              flex={1}
              classNames={{
                input: 'placeholder:text-slate-400 focus:border-mainColor dark:bg-white/5 dark:text-white'
              }}
            />
          </Flex>
        </Stack>
      </Paper>

      <Paper
        p={{ base: 'md', md: 'lg' }}
        withBorder
        className='border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-dark-card'
      >
        <Group justify='space-between' mb='md' align='flex-end'>
          <Box>
            <Group>
              <Box className='h-px w-6 bg-mainColor'></Box>
              <Text size='xs' fw={900} tt='uppercase' lts={1.8} className='text-mainColor'>
                {currentCategoryName || 'Tất cả món'}
              </Text>
            </Group>

            <Text fw={900} className='font-quicksand text-xl text-slate-950 dark:text-white'>
              Chạm để thêm nhanh vào giỏ
            </Text>
          </Box>

          <Text fw={700} c='dimmed' size={'sm'}>
            Hiển thị {products.length} món
          </Text>
        </Group>

        <Divider mb='md' />

        <Stack gap='sm'>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => <QuickMenuItemSkeleton key={index} />)
          ) : products.length > 0 ? (
            products.map((item, index) => (
              <QuickMenuItem
                key={`${item.id}-${index}`}
                product={item}
                index={index}
                onAdd={quantity => handleAddFast(item, quantity)}
              />
            ))
          ) : (
            <Empty
              hasButton={false}
              size='md'
              title='Không tìm thấy món phù hợp'
              content={keyword ? 'Thử nhập từ khóa khác hoặc đổi danh mục món.' : 'Vui lòng chọn danh mục khác.'}
            />
          )}
        </Stack>
      </Paper>

      {hasNextPage && !keyword.trim() && (
        <Stack ref={ref} gap='sm'>
          {Array.from({ length: 4 }).map((_, index) => (
            <QuickMenuItemSkeleton key={index} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};
