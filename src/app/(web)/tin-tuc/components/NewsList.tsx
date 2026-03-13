'use client';
import { Flex, Group, Highlight, Image, Paper, Stack, Text } from '@mantine/core';
import { IconClockHour10 } from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import Empty from '~/components/Empty';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { api } from '~/trpc/react';
import { NewsItemSkeleton } from './NewsItemSkeleton';

export const NewsList = () => {
  const searchParams = useSearchParams();
  const { page, limit, s } = useMemo(() => {
    return {
      page: Number(searchParams.get('page') || 1),
      limit: Number(searchParams.get('limit') || 5),
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
  const {
    news,
    pagination: { totalPage }
  } = data || {};

  return (
    <Stack gap={'xl'}>
      {isLoading ? (
        Array.from({ length: limit }, (_, i) => <NewsItemSkeleton key={i} />)
      ) : news && news?.length > 0 ? (
        news?.map((item: any) => (
          <Flex
            key={item.id}
            direction={{ base: 'column', sm: 'row' }}
            gap={'lg'}
            align={'flex-start'}
            justify={'flex-start'}
            h={{ base: '100%', sm: 180, md: 180, lg: 158 }}
          >
            <Paper
              radius={'md'}
              className='overflow-hidden'
              pos={'relative'}
              w={{ base: '100%', sm: 190, md: 190, lg: 250 }}
              h={{ base: '100%', sm: 180, md: 180, lg: 158 }}
            >
              <Image
                loading='lazy'
                src={item.image || '/images/jpg/empty-300x240.jpg'}
                w={'100%'}
                h={'100%'}
                alt={item.title}
                className='object-cover'
              />
            </Paper>
            <Stack gap={5} flex={1}>
              <Link href={item.link} target='_blank'>
                <Highlight
                  highlight={s}
                  size='xl'
                  fw={700}
                  className='text-black hover:text-mainColor dark:text-dark-text'
                >
                  {item.title}
                </Highlight>
              </Link>
              <Group gap={5} m={0} p={0}>
                <IconClockHour10 size={16} color='gray' />
                <Text size='sm' c={'dimmed'}>
                  {formatDateViVN(item.pubDate)}
                </Text>
              </Group>
              <Text size='sm' lineClamp={3}>
                {item.description}
              </Text>
              <Link href={item.link} target='_blank'>
                <Text fw={700} size='md' className='hover:text-mainColor'>
                  Đọc tiếp
                </Text>
              </Link>
            </Stack>
          </Flex>
        ))
      ) : (
        <Empty
          hasButton={false}
          logoUrl='/images/png/empty-news.png'
          title='Không có tin tức phù hợp. Thử lại sau.'
          content='Thử lại sau.'
        />
      )}
    </Stack>
  );
};
