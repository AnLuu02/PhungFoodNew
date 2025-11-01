import { Box, Center, Flex, Grid, GridCol, Group, Highlight, Image, Paper, Stack, Text } from '@mantine/core';
import { IconClockHour10 } from '@tabler/icons-react';
import { Metadata } from 'next';
import Link from 'next/link';
import Empty from '~/components/Empty';
import CustomPagination from '~/components/Pagination';
import { SearchInput } from '~/components/Search/SearchInput';
import { TOP_POSITION_STICKY } from '~/constants';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { api } from '~/trpc/server';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Tin tức - Món ngon miền Tây',
  description: 'Chia sẻ kiến thức ẩm thực, mẹo nấu ăn và câu chuyện món ngon miền Tây tại blog Phụng Food.'
};

const News = async ({
  searchParams
}: {
  searchParams: {
    page: string;
    limit: string;
    s: string;
  };
}) => {
  const { page, limit, s } = searchParams;
  const data: any = await api.News.fetchNews({
    skip: (Number(page || 1) - 1) * Number(limit || 5),
    take: Number(limit || 5),
    s: s
  });
  const {
    news,
    pagination: { totalPage }
  } = data || {};
  return (
    <Grid>
      <GridCol
        span={{ base: 12, sm: 12, md: 8, lg: 9 }}
        order={{ base: 2, sm: 2, md: 1, lg: 1 }}
        className='h-fit animate-fadeUp'
      >
        <Stack gap={'xl'}>
          {news && news?.length > 0 ? (
            news?.map((item: any) => (
              <Flex
                key={item.id}
                direction={{ base: 'column', sm: 'row', md: 'row', lg: 'row' }}
                gap={'lg'}
                align={'flex-start'}
                justify={'flex-start'}
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
          <Center>
            <CustomPagination totalPages={totalPage} />
          </Center>
        </Stack>
      </GridCol>
      <GridCol
        span={{ base: 12, sm: 12, md: 4, lg: 3 }}
        order={{ base: 1, sm: 1, md: 2, lg: 2 }}
        className='h-fit animate-fadeUp'
        style={{ animationDuration: '1s' }}
        pos={{ base: 'static', sm: 'static', md: 'sticky', lg: 'sticky' }}
        top={{ base: 0, sm: TOP_POSITION_STICKY, md: TOP_POSITION_STICKY, lg: TOP_POSITION_STICKY }}
      >
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
      </GridCol>
    </Grid>
  );
};

export default News;
