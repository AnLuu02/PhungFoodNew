import { Box, Flex, Tabs, TabsList, TabsPanel, TabsTab, Text, Title } from '@mantine/core';
import TabsPanelCarouselSimple from './TabsPenelSimple';
import classes from './TabsStyles.module.css';
export type IDataCategory = {
  anVat: any;
  monChinh: any;
  monChay: any;
  thucUong: any;
};

const CategoryCarouselHorizontal = ({ data }: { data: IDataCategory }) => {
  const productAnVat = data?.anVat || [];
  const productMonChinh = data?.monChinh || [];
  const productMonChay = data?.monChay || [];
  return (
    <Tabs className='relative' defaultValue='an-vat-trang-mieng' variant='pills' classNames={classes}>
      <Flex
        align='center'
        justify='space-between'
        direction={{ base: 'column', sm: 'row', lg: 'row', md: 'row' }}
        gap={'md'}
        pb={{ base: 0, md: 'sm' }}
      >
        <Title
          order={2}
          w={{ base: '100%', sm: 'max-content', md: '33.33333%' }}
          className='cursor-pointer text-center font-quicksand font-bold text-black no-underline hover:text-[#008b4b] sm:text-left'
        >
          Danh mục nổi bật
        </Title>
        <TabsList justify='center' w={{ base: '100%', sm: 'max-content', md: '33.33333%' }}>
          <TabsTab value='an-vat-trang-mieng' size={'xl'}>
            <Text size='md' fw={700}>
              Ăn vặt
            </Text>
          </TabsTab>
          <TabsTab value='mon-chinh' size={'xl'}>
            <Text size='md' fw={700}>
              Món chính
            </Text>
          </TabsTab>
          <TabsTab value='mon-chay' size={'xl'}>
            <Text size='md' fw={700}>
              Món chay
            </Text>
          </TabsTab>
        </TabsList>
        <Box w={{ base: '100%', sm: 'max-content', md: '33.33333%' }}></Box>
      </Flex>

      <TabsPanel value={'an-vat-trang-mieng'}>
        <TabsPanelCarouselSimple data={productAnVat} />
      </TabsPanel>
      <TabsPanel value={'mon-chinh'}>
        <TabsPanelCarouselSimple data={productMonChinh} />
      </TabsPanel>
      <TabsPanel value={'mon-chay'}>
        <TabsPanelCarouselSimple data={productMonChay} />
      </TabsPanel>
    </Tabs>
  );
};

export default CategoryCarouselHorizontal;
