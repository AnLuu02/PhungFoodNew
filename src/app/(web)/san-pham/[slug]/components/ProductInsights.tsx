'use client';
import { Box, Grid, Spoiler, Stack, Tabs, Title } from '@mantine/core';
import { useState } from 'react';
import Comments from '~/components/Comments/Comments';
import { TiptapViewer } from '~/components/Tiptap/TiptapViewer';
import GuideOrder from './GuideOrder';
import RatingStatistics from './RatingStatistics';

export const ProductInsights = ({ product }: { product: any }) => {
  const [activeTab, setActiveTab] = useState('description');

  return (
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
              <TiptapViewer descriptionDetailHtml={product?.descriptionDetailHtml} />
            </Stack>
          </Spoiler>
        </Tabs.Panel>

        <Tabs.Panel value='guide' hidden={activeTab !== 'guide'}>
          <GuideOrder />
        </Tabs.Panel>

        <Tabs.Panel value='reviews' hidden={activeTab !== 'reviews'}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <RatingStatistics productId={product?.id} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Comments product={product} max_height_scroll={200} />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Box>
    </Tabs>
  );
};
