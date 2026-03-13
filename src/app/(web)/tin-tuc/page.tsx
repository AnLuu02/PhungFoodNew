import { Center, Grid, GridCol } from '@mantine/core';
import { Metadata } from 'next';
import CustomPagination from '~/components/Pagination';
import { TOP_POSITION_STICKY } from '~/constants';
import { api } from '~/trpc/server';
import { NewsFeed } from './components/NewsFeed';
import { NewsList } from './components/NewsList';
export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'Tin tức - Món ngon miền Tây',
  description: 'Chia sẻ kiến thức ẩm thực, mẹo nấu ăn và câu chuyện món ngon miền Tây tại blog Phụng Food.'
};
const News = async () => {
  const news = await api.News.fetchNews({
    skip: 1,
    take: 5,
    s: ''
  });
  return (
    <Grid>
      <GridCol
        span={{ base: 12, sm: 12, md: 8, lg: 9 }}
        order={{ base: 2, sm: 2, md: 1, lg: 1 }}
        className='h-fit animate-fadeUp'
      >
        <NewsList />
        <Center mt={'lg'}>
          <CustomPagination totalPages={news.pagination.totalPage} />
        </Center>
      </GridCol>
      <GridCol
        span={{ base: 12, sm: 12, md: 4, lg: 3 }}
        order={{ base: 1, sm: 1, md: 2, lg: 2 }}
        className='h-fit animate-fadeUp'
        style={{ animationDuration: '1s' }}
        pos={{ base: 'static', sm: 'static', md: 'sticky', lg: 'sticky' }}
        top={{ base: 0, sm: TOP_POSITION_STICKY, md: TOP_POSITION_STICKY, lg: TOP_POSITION_STICKY }}
      >
        <NewsFeed />
      </GridCol>
    </Grid>
  );
};

export default News;
