'use client';
import { Box, Flex, Tabs, TabsList, TabsPanel, TabsTab, Text, Title } from '@mantine/core';
import { useMemo, useState } from 'react';
import TabsPanelCarouselSimple from './TabsPanelSimple';
export type IDataCategory = {
  anVat: any;
  monChinh: any;
  monChay: any;
  thucUong: any;
};

const CategoryCarouselHorizontal = ({ data }: { data: IDataCategory }) => {
  const [active, setActive] = useState<'danh-muc-an-vat-trang-mieng' | 'danh-muc-mon-chinh' | 'danh-muc-mon-chay'>(
    'danh-muc-an-vat-trang-mieng'
  );
  const productAnVat = data?.anVat || [];
  const productMonChinh = data?.monChinh || [];
  const productMonChay = data?.monChay || [];
  const dataProps = useMemo(() => {
    switch (active) {
      case 'danh-muc-an-vat-trang-mieng':
        return productAnVat;
      case 'danh-muc-mon-chinh':
        return productMonChinh;
      case 'danh-muc-mon-chay':
        return productMonChay;
      default:
        return productAnVat;
    }
  }, [active]);
  return (
    <Tabs
      className='relative'
      defaultValue='danh-muc-an-vat-trang-mieng'
      variant='pills'
      classNames={{
        tab: `hover:bg-transparent hover:text-subColor data-[active=true]:bg-transparent data-[active=true]:text-subColor`
      }}
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
          className='cursor-pointer text-center font-quicksand font-bold hover:text-mainColor sm:text-left'
        >
          Danh mục nổi bật
        </Title>
        <TabsList justify='center' w={{ base: '100%', sm: 'max-content', md: '33.33333%' }}>
          <TabsTab value='danh-muc-an-vat-trang-mieng' size={'xl'}>
            <Text size='md' fw={700}>
              Ăn vặt
            </Text>
          </TabsTab>
          <TabsTab value='danh-muc-mon-chinh' size={'xl'}>
            <Text size='md' fw={700}>
              Món chính
            </Text>
          </TabsTab>
          <TabsTab value='danh-muc-mon-chay' size={'xl'}>
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
