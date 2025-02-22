import { Box, Center, Flex, Grid, GridCol, Group, Highlight, Image, Paper, Stack, Text } from '@mantine/core';
import { IconClockHour10 } from '@tabler/icons-react';
import Link from 'next/link';
import Search from '~/app/_components/Admin/Search';
import Empty from '~/app/_components/Empty';
import CustomPagination from '~/app/_components/Pagination';
import { api } from '~/trpc/server';

const News = async ({
  searchParams
}: {
  searchParams: {
    page: string;
    limit: string;
    query: string;
  };
}) => {
  const { page, limit, query } = searchParams;
  const data = await api.news.fetchNews({
    skip: (Number(page || 1) - 1) * Number(limit || 5),
    take: Number(limit || 5),
    query: query
  });
  const {
    news,
    pagination: { totalPage }
  } = data || {};
  return (
    <Grid>
      <GridCol span={9}>
        <Stack gap={'md'}>
          {news && news?.length > 0 ? (
            news?.map((item: any) => (
              <Flex key={item.id} gap={'lg'} align={'flex-start'} justify={'flex-start'}>
                <Paper radius={'md'} className='overflow-hidden' w={250} h={158} bg={'red'}>
                  <Image
                    loading='lazy'
                    src={item.image || '/images/jpg/empty-300x240.jpg'}
                    w={'100%'}
                    h={'100%'}
                    alt={item.title}
                  />
                </Paper>
                <Stack gap={5} flex={1}>
                  <Link href={item.link} target='_blank' className='no-underline'>
                    <Highlight highlight={query} size='xl' fw={700} className='text-black hover:text-[#008b4b]'>
                      {item.title}
                    </Highlight>
                  </Link>
                  <Group gap={5} m={0} p={0}>
                    <IconClockHour10 size={16} color='gray' />
                    <Text size='sm' c={'dimmed'}>
                      {new Date(item.pubDate).toLocaleDateString()}
                    </Text>
                  </Group>
                  <Text size='sm' lineClamp={1}>
                    {item.description}
                  </Text>
                  <Link href={item.link} className='text-lg hover:text-[#008b4b]' target='_blank'>
                    Đọc tiếp
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
          <Center>
            <CustomPagination totalPages={totalPage} />
          </Center>
        </Stack>
      </GridCol>
      <GridCol span={3}>
        <Stack gap={'md'}>
          {/* <GlobalSearch /> */}
          <Search />
          <Paper radius={'md'} withBorder className='h-[max-content] border-green-600' mb={20}>
            <Box className='rounded-t-md bg-green-600 p-2 text-white'>
              <Text size='sm' fw={700}>
                BÀI VIẾT MỚI
              </Text>
            </Box>
            <Stack gap={'sm'} p={'xs'}>
              {news && news?.length > 0 ? (
                news?.slice(0, 4).map((item: any) => (
                  <Link key={item.id} className='h-full w-full no-underline' href={item.link} target='_blank'>
                    <Flex gap={'sm'} align={'flex-start'} justify={'flex-start'}>
                      <Image
                        loading='lazy'
                        src={item.image || '/images/jpg/empty-300x240.jpg'}
                        w={100}
                        h={64}
                        alt={item.title}
                      />

                      <Highlight
                        flex={1}
                        highlight={query}
                        size='sm'
                        fw={500}
                        lineClamp={2}
                        className='text-black hover:text-[#008b4b]'
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
      </GridCol>
    </Grid>
  );
};

export default News;
