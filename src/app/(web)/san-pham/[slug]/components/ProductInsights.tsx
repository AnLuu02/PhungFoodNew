'use client';
import { Box, Grid, Spoiler, Stack, Tabs, Title } from '@mantine/core';
import { useState } from 'react';
import Comments from '~/components/Comments/Comments';
import { TiptapViewer } from '~/components/Tiptap/TiptapViewer';
import { GetInitProductDetail } from '~/shared/type-trpc/page.type-trpc';
import GuideOrder from './GuideOrder';
import RatingStatistics from './RatingStatistics';
import SuggestionProducts from './SuggestionProducts';

export const ProductInsights = ({
  hintProducts,
  productId,
  productDescriptionDetailHtml
}: {
  hintProducts: NonNullable<GetInitProductDetail>['dataHintProducts'];
  productId: string;
  productDescriptionDetailHtml: string;
}) => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <Grid>
      <Grid.Col
        mt={{ base: 'md', sm: 0 }}
        className='h-fit'
        span={{
          base: 12,
          sm: hintProducts?.length > 0 ? 7 : 12,
          md: hintProducts?.length > 0 ? 8 : 12,
          lg: hintProducts?.length > 0 ? 9 : 12
        }}
      >
        <Tabs
          classNames={{
            tab: `mr-[10px] border-0 transition-all duration-200 hover:bg-mainColor hover:text-white data-[active=true]:bg-mainColor data-[active=true]:text-white`
          }}
          defaultValue='description'
          value={activeTab}
          onChange={value => setActiveTab(value ?? 'description')}
        >
          <Tabs.List>
            <Tabs.Tab value='description'>
              <Title order={5} className='font-quicksand'>
                Mô tả
              </Title>
            </Tabs.Tab>
            <Tabs.Tab value='guide'>
              <Title order={5} className='font-quicksand'>
                Hướng dẫn
              </Title>
            </Tabs.Tab>
            <Tabs.Tab value='reviews'>
              <Title order={5} className='font-quicksand'>
                Đánh giá
              </Title>
            </Tabs.Tab>
          </Tabs.List>

          <Box mt='md'>
            <Tabs.Panel value='description' hidden={activeTab !== 'description'}>
              <Spoiler
                maxHeight={300}
                showLabel='Xem thêm'
                hideLabel='Ẩn'
                classNames={{
                  control: 'text-lg font-bold text-mainColor'
                }}
              >
                <Stack gap='md'>
                  <TiptapViewer descriptionDetailHtml={productDescriptionDetailHtml} />
                </Stack>
              </Spoiler>
            </Tabs.Panel>

            <Tabs.Panel value='guide' hidden={activeTab !== 'guide'}>
              <GuideOrder />
            </Tabs.Panel>

            <Tabs.Panel value='reviews' hidden={activeTab !== 'reviews'}>
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <RatingStatistics productId={productId} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Comments productId={productId} max_height_scroll={200} />
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 5, md: 4, lg: 3 }}>
        <SuggestionProducts data={hintProducts} />
      </Grid.Col>
    </Grid>
  );
};
