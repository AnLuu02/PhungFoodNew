'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Paper,
  rem,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Tooltip
} from '@mantine/core';
import { useDebouncedValue, useLocalStorage } from '@mantine/hooks';
import { IconClock, IconX } from '@tabler/icons-react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';
import { getImageProduct } from '~/app/lib/utils/func-handler/getImageProduct';
import { LocalImageType } from '~/app/lib/utils/zod/EnumType';
import { api } from '~/trpc/react';
import VoiceSearchModal from './SearchAsVoice';

export default function SearchComponentClient({ subCategories }: any) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [historySearch, setHistorySearch] = useLocalStorage<any>({ key: 'historySearch', defaultValue: [] });
  const [debounced] = useDebouncedValue(searchQuery, 500);
  const { data, isLoading: isLoadingProduct } = api.Product.find.useQuery(
    { skip: 0, take: 10, s: debounced ?? '' },
    { enabled: !!debounced }
  );

  const productData = data?.products || [];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/thuc-don?s=${encodeURIComponent(searchQuery)}`);
    }
  };

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
            <Group gap={8}>
              <VoiceSearchModal />
            </Group>
          }
          styles={{
            input: {
              height: rem(48),
              fontSize: rem(16)
            },
            section: {
              width: 'auto',
              paddingRight: rem(12)
            }
          }}
        />
      </form>
      <Flex
        wrap={'nowrap'}
        align={'center'}
        gap={5}
        className='z-[100] mx-auto hidden w-full max-w-6xl px-4 md:flex'
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
                  className={clsx('hidden', index < 5 ? 'md:block' : index < 6 ? 'lg:block' : 'xl:block')}
                >
                  <Link href={`/thuc-don?s=${encodeURIComponent(item?.name)}`} prefetch={false}>
                    <Badge
                      variant='outline'
                      color='gray.6'
                      key={index}
                      size='sm'
                      className='cursor-pointer hover:opacity-70'
                    >
                      {item.name}
                    </Badge>
                  </Link>
                </Tooltip>
              )
            );
          })}
      </Flex>

      {showDropdown &&
        (!isLoadingProduct ? (
          <Paper
            shadow='md'
            onMouseDown={e => e.preventDefault()}
            radius='md'
            withBorder
            pos='absolute'
            top={rem(52)}
            left={0}
            right={0}
            style={{ zIndex: 102 }}
          >
            {historySearch.length > 0 && (
              <Box p='md'>
                <Flex justify='space-between' align='center' mb={8}>
                  <Text size='sm' fw={700} c={'black'}>
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
                  {historySearch.map((item: any, index: number) => (
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
                            fontSize: rem(14),
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

            <Box p='md' style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
              <Text size='sm' fw={700} c={'black'} mb={8}>
                Tra cứu hàng đầu
              </Text>
              <Flex gap={8} wrap='wrap'>
                {subCategories &&
                  subCategories.map((term: any, index: number) => (
                    <Link href={`/thuc-don?s=${encodeURIComponent(term?.name)}`} prefetch={false} key={index}>
                      <Badge
                        key={index}
                        variant='outline'
                        color='gray'
                        radius='xl'
                        style={{ cursor: 'pointer' }}
                        className='hover:bg-gray-200'
                      >
                        {term?.name}
                      </Badge>
                    </Link>
                  ))}
              </Flex>
            </Box>

            {searchQuery && (
              <Box style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                {productData.map((product: any) => (
                  <Link key={product.id} href={`/san-pham/${product.tag}`} className='text-black' prefetch={false}>
                    <Flex
                      key={product.id}
                      p='md'
                      gap='md'
                      align='center'
                      style={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'var(--mantine-color-gray-0)'
                        }
                      }}
                    >
                      <Image
                        loading='lazy'
                        src={getImageProduct(product.images, LocalImageType.THUMBNAIL) || '/images/png/momo.png'}
                        alt={product.name}
                        width={60}
                        height={60}
                        objectFit='cover'
                        style={{ borderRadius: rem(8), objectFit: 'cover' }}
                      />
                      <Box>
                        <Text size='sm' fw={700} c={'black'} lineClamp={2}>
                          {product.name}
                        </Text>
                        <Text size='sm' c='blue'>
                          {formatPriceLocaleVi(product.price)}
                        </Text>
                      </Box>
                    </Flex>
                  </Link>
                ))}
              </Box>
            )}
          </Paper>
        ) : (
          <Paper
            shadow='md'
            onMouseDown={e => e.preventDefault()}
            radius='md'
            withBorder
            pos='absolute'
            top={rem(52)}
            left={0}
            right={0}
            style={{ zIndex: 102 }}
          >
            <Box p='xs'>
              <Skeleton height={20} width='80%' radius='xl' />
              <Skeleton height={20} mt={6} width='60%' radius='xl' />
            </Box>

            <Box p='xs' style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
              <Skeleton height={20} width='50%' radius='xl' />
              <Skeleton height={20} mt={6} width='70%' radius='xl' />
            </Box>

            <Box>
              <Flex
                p='xs'
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
                p='xs'
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
                p='xs'
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
          </Paper>
        ))}
    </Box>
  );
}
