'use client';
import { Box, Flex, Highlight, Image, Paper, Skeleton, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { SearchInput } from '~/components/Search/SearchInput';
import { api } from '~/trpc/react';

export const NewsFeed = () => {
  const searchParams = useSearchParams();
  const { page, limit, s } = useMemo(() => {
    return {
      page: 1,
      limit: 4,
      s: searchParams.get('s') || ''
    };
  }, [searchParams]);
  const {
    data = {
      news: [],
      pagination: {
        totalPage: 0,
        currentPage: 1
      }
    },
    isLoading
  } = api.News.fetchNews.useQuery({
    skip: (page - 1) * limit,
    take: limit,
    s: s
  });
  const { news } = data || {};
  if (isLoading)
    return (
      <Stack gap={'md'}>
        <Skeleton h={42} radius='md' />
        <Paper withBorder className='h-[max-content] rounded-md border-mainColor' mb={20}>
          <Box className='rounded-t-md bg-mainColor p-2 text-white'>
            <Text size='sm' fw={700}>
              BÀI VIẾT MỚI
            </Text>
          </Box>
          <Stack gap={'sm'} p={'xs'}>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <Flex key={index} gap={'sm'} align={'flex-start'} justify={'flex-start'}>
                  <Skeleton width={100} height={64} radius={0} className='flex-shrink-0' />

                  <Stack gap={6} flex={1} pt={4}>
                    <Skeleton height={14} width='100%' radius='sm' />
                    <Skeleton height={14} width='70%' radius='sm' />
                  </Stack>
                </Flex>
              ))}
          </Stack>
        </Paper>
      </Stack>
    );
  return (
    <Stack gap={'md'}>
      <SearchInput />
      <Paper withBorder className='h-[max-content] rounded-md border-mainColor' mb={20}>
        <Box className='rounded-t-md bg-mainColor p-2 text-white'>
          <Text size='sm' fw={700}>
            BÀI VIẾT MỚI
          </Text>
        </Box>
        <Stack gap={'sm'} p={'xs'}>
          {news && news?.length > 0 ? (
            news?.slice(0, 4).map((item: any) => (
              <Link key={item.id} className='h-full w-full' href={item.link} target='_blank'>
                <Flex gap={'sm'} align={'flex-start'} justify={'flex-start'}>
                  <Paper radius={0} className='overflow-hidden' w={100} h={64}>
                    <Image
                      loading='lazy'
                      src={item.image || '/images/jpg/empty-300x240.jpg'}
                      w={'100%'}
                      h={'100%'}
                      className='object-cover'
                      alt={item.title}
                    />
                  </Paper>

                  <Highlight
                    flex={1}
                    highlight={s}
                    size='sm'
                    fw={500}
                    lineClamp={2}
                    className='text-black hover:text-mainColor dark:text-dark-text'
                  >
                    {item.title}
                  </Highlight>
                </Flex>
              </Link>
            ))
          ) : (
            <Text size='xs'>Không có tin tức phù hợp. Thử lại sau.</Text>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};
