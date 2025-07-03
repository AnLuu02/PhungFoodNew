'use client';
import { Box, Flex, Tabs, TabsList, TabsPanel, TabsTab, Text, Title } from '@mantine/core';
import { useMemo, useState } from 'react';
import TabsPanelCarouselSimple from './TabsPenelSimple';
import classes from './TabsStyles.module.css';
export type IDataCategory = {
  anVat: any;
  monChinh: any;
  monChay: any;
  thucUong: any;
};

const CategoryCarouselHorizontal = ({ data }: { data: IDataCategory }) => {
  const [active, setActive] = useState<'an-vat-trang-mieng' | 'mon-chinh' | 'mon-chay'>('an-vat-trang-mieng');
  const productAnVat = data?.anVat || [];
  const productMonChinh = data?.monChinh || [];
  const productMonChay = data?.monChay || [];
  const dataProps = useMemo(() => {
    switch (active) {
      case 'an-vat-trang-mieng':
        return productAnVat;
      case 'mon-chinh':
        return productMonChinh;
      case 'mon-chay':
        return productMonChay;
      default:
        return productAnVat;
    }
  }, [active]);
  return (
    <Tabs
      className='relative'
      defaultValue='an-vat-trang-mieng'
      variant='pills'
      classNames={classes}
      value={active}
      onChange={(value: any) => setActive(value)}
    >
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
          className='cursor-pointer text-center font-quicksand font-bold hover:text-[#008b4b] sm:text-left'
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

      <TabsPanel value={active} mih={200}>
        <TabsPanelCarouselSimple data={dataProps} />
      </TabsPanel>
    </Tabs>
  );
};

export default CategoryCarouselHorizontal;
