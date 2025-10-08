'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Highlight,
  List,
  ListItem,
  Paper,
  ScrollAreaAutosize,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Tooltip
} from '@mantine/core';
import { useDebouncedValue, useLocalStorage } from '@mantine/hooks';
import { IconClock, IconSearch, IconX, IconXboxXFilled } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';
import { api } from '~/trpc/react';
import VoiceSearchModal from './search-as-voice';

export default function SearchComponentClient({ subCategories }: any) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [historySearch, setHistorySearch] = useLocalStorage<any>({ key: 'historySearch', defaultValue: [] });
  const [debounced] = useDebouncedValue(searchQuery, 500);
  const { data, isLoading } = api.Search.search.useQuery({ s: debounced ?? '' }, { enabled: !!debounced });

  const productData = data?.products || [];
  const categoryData = data?.categories || [];
  const subCategoryData = data?.subCategories || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/thuc-don?s=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isValue = useMemo(() => {
    return data && (data?.products.length > 0 || data?.categories.length > 0 || data?.subCategories.length > 0);
  }, [data]);

  const historySearchRender = useMemo(() => {
    if (historySearch.length > 0) {
      const dataRender = Array.from(historySearch).reverse().slice(0, 5);
      return dataRender;
    }
    return [];
  }, [historySearch]);
  return (
    <Box w={'100%'} mx='auto' pos='relative'>
      <form onSubmit={handleSubmit}>
        <TextInput
          value={searchQuery}
          radius={'xl'}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => {
            setShowDropdown(false);
          }}
          placeholder='Tìm kiếm sản phẩm...'
          size='md'
          rightSection={
            <Group gap={8} align='center'>
              {searchQuery !== '' && (
                <IconXboxXFilled className='cursor-pointer' size={20} onClick={() => setSearchQuery('')} />
              )}
              <VoiceSearchModal />
            </Group>
          }
          styles={{
            input: {
              height: 48,
              fontSize: 16
            },
            section: {
              width: 'auto',
              paddingRight: 12
            }
          }}
        />
      </form>
      <Flex
        wrap={'nowrap'}
        align={'center'}
        gap={5}
        className='z-[100] mx-auto hidden w-full max-w-6xl px-4 sm:flex'
        pos={'absolute'}
        bottom={-22}
        left={0}
      >
        {subCategories &&
          subCategories.map((item: any, index: number) => {
            return (
              index < 8 && (
                <Tooltip
                  key={item.id}
                  label={item.name}
                  className={`hidden ${index < 5 ? 'sm:block' : index < 6 ? 'md:block' : 'lg:block'}`}
                >
                  <Link href={`/thuc-don?s=${encodeURIComponent(item?.name)}`}>
                    <Badge
                      variant='outline'
                      color='gray.6'
                      key={index}
                      size='sm'
                      styles={{
                        label: {
                          textTransform: 'lowercase',
                          fontSize: 12
                        }
                      }}
                      className='cursor-pointer duration-200 hover:border-mainColor/20 hover:bg-mainColor/10 hover:text-mainColor'
                    >
                      {item.name}
                    </Badge>
                  </Link>
                </Tooltip>
              )
            );
          })}
      </Flex>

      {showDropdown && (
        <Paper
          shadow='md'
          radius='lg'
          withBorder
          pos='absolute'
          top={52}
          left={0}
          right={0}
          onMouseDown={e => e.preventDefault()}
          style={{ zIndex: 102 }}
          className='overflow-hidden bg-gray-100 text-black dark:bg-dark-card dark:text-dark-text'
        >
          <ScrollAreaAutosize mah={400} scrollbarSize={5}>
            {((searchQuery !== '' || !searchQuery) && searchQuery !== debounced) || isLoading ? (
              <>
                <Box p='sm'>
                  <Skeleton height={20} width='80%' radius='xl' />
                  <Skeleton height={20} mt={6} width='60%' radius='xl' />
                </Box>

                <Box p='sm' style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                  <Skeleton height={20} width='50%' radius='xl' />
                  <Skeleton height={20} mt={6} width='70%' radius='xl' />
                </Box>

                <Box>
                  <Flex
                    p='sm'
                    gap={'md'}
                    align='center'
                    style={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'var(--mantine-color-gray-0)'
                      }
                    }}
                  >
                    <Skeleton width={60} height={60} radius='md' />
                    <Box flex={1}>
                      <Skeleton height={15} width='90%' radius='xl' />
                      <Skeleton height={15} mt={6} width='40%' radius='xl' />
                      <Skeleton height={15} mt={6} width='60%' radius='xl' />
                    </Box>
                  </Flex>
                  <Flex
                    p='sm'
                    gap={'md'}
                    align='center'
                    style={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'var(--mantine-color-gray-0)'
                      }
                    }}
                  >
                    <Skeleton width={60} height={60} radius='md' />
                    <Box flex={1}>
                      <Skeleton height={15} width='60%' radius='xl' />
                      <Skeleton height={15} mt={6} width='40%' radius='xl' />
                      <Skeleton height={15} mt={6} width='30%' radius='xl' />
                    </Box>
                  </Flex>
                  <Flex
                    p='sm'
                    gap={'md'}
                    align='center'
                    style={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'var(--mantine-color-gray-0)'
                      }
                    }}
                  >
                    <Skeleton width={60} height={60} radius='md' />
                    <Box flex={1}>
                      <Skeleton height={15} width='50%' radius='xl' />
                      <Skeleton height={15} mt={6} width='80%' radius='xl' />
                      <Skeleton height={15} mt={6} width='30%' radius='xl' />
                    </Box>
                  </Flex>
                </Box>
              </>
            ) : debounced && debounced === searchQuery && !isLoading && !isValue ? (
              <Box px={'md'} pos={'relative'} className='overflow-hidden'>
                <Flex align='center' gap={8} py={'sm'}>
                  <IconSearch size={24} className='text-gray-400 dark:text-dark-text' />
                  <Text fw={500}>
                    Không tìm thấy kết quả với từ khoá <b>“{debounced}”</b>
                  </Text>
                </Flex>
                <Divider mx={'xl'} />
                <List px={'xl'} py={'sm'}>
                  <ListItem>
                    <Text size='sm'>Kiểm tra lỗi chính tả với từ khoá đã nhập</Text>
                  </ListItem>
                  <ListItem>
                    <Text size='sm'>
                      Trong trường hợp cần hỗ trợ, hãy liên hệ với Phụng Food qua tổng đài miễn phí{' '}
                      <b className='text-blue-500'>1800 1234</b>
                    </Text>
                  </ListItem>
                </List>
              </Box>
            ) : (
              <>
                {historySearchRender.length > 0 && (
                  <Box p='md'>
                    <Flex justify='space-between' align='center' mb={8}>
                      <Text size='sm' fw={700} className='text-black dark:text-white'>
                        Lịch sử tìm kiếm
                      </Text>
                      <Button
                        variant='transparent'
                        color='blue'
                        style={{ height: 'auto' }}
                        p={0}
                        m={0}
                        w={'max-content'}
                        onClick={() => setHistorySearch([])}
                      >
                        Xóa tất cả
                      </Button>
                    </Flex>
                    <Stack gap={8}>
                      {historySearchRender.map((item: any, index: number) => (
                        <Flex key={index} justify='space-between' align='center'>
                          <Button
                            variant='transparent'
                            leftSection={<IconClock size={16} />}
                            onClick={() => {
                              router.push(`/thuc-don?s=${encodeURIComponent(item)}`);
                            }}
                            styles={{
                              root: {
                                padding: 0,
                                height: 'auto'
                              },
                              label: {
                                fontSize: 14,
                                fontWeight: 400
                              }
                            }}
                          >
                            {item}
                          </Button>
                          <ActionIcon
                            variant='transparent'
                            size='sm'
                            onClick={() => {
                              setHistorySearch(historySearch.filter((item: any) => item !== historySearch[index]));
                            }}
                          >
                            <IconX size={16} />
                          </ActionIcon>
                        </Flex>
                      ))}
                    </Stack>
                  </Box>
                )}

                {!searchQuery && (
                  <Box p='md' style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                    <Text fw={700} className='text-black dark:text-white' mb={8}>
                      Tra cứu hàng đầu
                    </Text>
                    <Flex gap={8} wrap='wrap'>
                      {subCategories &&
                        subCategories.map((term: any, index: number) => (
                          <Link href={`/thuc-don?s=${encodeURIComponent(term?.name)}`} key={index}>
                            <Badge
                              key={index}
                              variant='outline'
                              color='gray'
                              radius='xl'
                              className='cursor-pointer hover:bg-mainColor/10 dark:hover:bg-mainColor/10'
                            >
                              {term?.name}
                            </Badge>
                          </Link>
                        ))}
                    </Flex>
                  </Box>
                )}

                {categoryData.length > 0 && (
                  <Box my={8}>
                    {categoryData.map((category: any) => (
                      <Link key={category.id} href={`/thuc-don?s=${category.tag}`} className='text-black'>
                        <Flex align={'center'} gap={8} px={'md'} py={5} className='hover:bg-mainColor/10'>
                          <IconSearch size={24} className='text-gray-400 dark:text-dark-text' />
                          <Group gap={4}>
                            <Text size='sm'>Danh mục</Text>{' '}
                            <Highlight size='sm' highlight={searchQuery}>
                              {category.name || 'Đang cập nhật'}
                            </Highlight>
                          </Group>
                        </Flex>
                      </Link>
                    ))}
                  </Box>
                )}

                {subCategoryData.length > 0 && (
                  <>
                    <Divider />
                    <Box my={8}>
                      {subCategoryData.map((category: any) => (
                        <Link key={category.id} href={`/thuc-don?s=${category.tag}`} className='text-black'>
                          <Flex align={'center'} gap={8} px={'md'} py={5} className='hover:bg-mainColor/10'>
                            <IconSearch size={24} className='text-gray-400 dark:text-dark-text' />
                            <Group gap={4}>
                              <Text size='sm'>Danh mục con</Text>{' '}
                              <Highlight size='sm' highlight={searchQuery}>
                                {category.name || 'Đang cập nhật'}
                              </Highlight>
                            </Group>
                          </Flex>
                        </Link>
                      ))}
                    </Box>
                    <Divider />
                  </>
                )}

                {productData.length > 0 && (
                  <Box style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                    {productData.map((product: any) => (
                      <Box>
                        <Link key={product.id} href={`/san-pham/${product.tag}`} className='text-black'>
                          <Flex
                            align={'center'}
                            className='cursor-pointer hover:bg-mainColor/10 dark:hover:bg-mainColor/10'
                          >
                            <Flex key={product.id} p='md' gap='md' align={'flex-start'} w={'70%'}>
                              <Card
                                radius={'lg'}
                                withBorder
                                w={80}
                                h={80}
                                pos={'relative'}
                                className='flex items-center justify-center shadow-none'
                              >
                                <Image
                                  loading='lazy'
                                  src={
                                    getImageProduct(product.images, LocalImageType.THUMBNAIL) || '/images/png/momo.png'
                                  }
                                  alt={product.name}
                                  width={60}
                                  height={60}
                                  style={{ borderRadius: 8, objectFit: 'cover' }}
                                />
                              </Card>
                              <Box>
                                <Highlight
                                  lineClamp={2}
                                  className='text-black dark:text-white'
                                  fw={700}
                                  highlight={searchQuery}
                                >
                                  {product.name}
                                </Highlight>
                                <Text size='sm'>
                                  <b className='m-0 p-0 text-mainColor'>{formatPriceLocaleVi(product.price)}</b> /phần
                                </Text>
                                {product.tags && product.tags.length > 0 && (
                                  <Flex gap={4} mt={'xs'}>
                                    {product.tags.slice(0, 3)?.map((tag: any, index: number) => (
                                      <Tooltip key={index} label={tag}>
                                        <Badge
                                          key={index}
                                          variant='outline'
                                          color='gray'
                                          size='sm'
                                          radius='xl'
                                          className='cursor-pointer hover:bg-mainColor/10 dark:hover:bg-mainColor/10'
                                        >
                                          {tag}
                                        </Badge>
                                      </Tooltip>
                                    ))}
                                  </Flex>
                                )}
                              </Box>
                            </Flex>
                            <Stack gap={5}>
                              <Text size='xs' className='text-mainColor'>
                                Danh mục: <b>{product.subCategory?.name || 'Đang cập nhật'}</b>
                              </Text>
                              <Text size='xs' className='text-mainColor'>
                                Đã bán: {product.soldQuantity || 0}
                              </Text>
                              <Text size='xs' className='text-mainColor'>
                                Còn lại: {product.availableQuantity || 0}
                              </Text>
                              <Text size='xs' className='text-mainColor'>
                                Mở bán: {formatDateViVN(product.updatedAt)}
                              </Text>
                            </Stack>
                          </Flex>
                        </Link>
                        <Divider />
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            )}
          </ScrollAreaAutosize>
        </Paper>
      )}
    </Box>
  );
}
