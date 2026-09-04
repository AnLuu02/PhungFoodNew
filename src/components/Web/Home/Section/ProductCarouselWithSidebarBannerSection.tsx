'use client';
import {
  BackgroundImage,
  Box,
  Button,
  Card,
  Flex,
  Overlay,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Title
} from '@mantine/core';
import { IconChevronRightFilled, IconShoppingCart } from '@tabler/icons-react';
import Link from 'next/link';
import { Fragment, useCallback, useState } from 'react';
import { _LOAI } from '~/shared/schema/product.filter.schema';
import { CategoryProps } from '~/shared/type-trpc/category.type-trpc';
import { api } from '~/trpc/react';
import TabsPanelCarousel from '../components/CarouselSection';

type Props = {
  title?: string;
  content?: string;
  imageUrl?: string;
  loai: _LOAI;
  reverseGrid?: boolean;
  categories: CategoryProps;
};

export const ProductCarouselWithSidebarBannerSection = ({
  title,
  content,
  loai,
  imageUrl,
  reverseGrid,
  categories
}: Props) => {
  const [active, setActive] = useState<string>(categories.init.tag);

  const { data, isLoading, isFetching } = api.Product.find.useQuery(
    { page: 1, limit: 6, loai, 'danh-muc': active },
    { enabled: !!active, placeholderData: previousData => previousData }
  );

  const products = data?.products ?? [];

  const utils = api.useUtils();

  const handlePrefetch = useCallback((categoryTag: string) => {
    if (active === categoryTag) return;
    void utils.Product.find.prefetch({ page: 1, limit: 6, loai, 'danh-muc': categoryTag });
  }, []);

  return (
    <Card mih={500} h={{ base: 'max-content', md: 500 }} className='bg-gray-100 dark:bg-dark-background' p={0}>
      <Flex h={'100%'} direction={{ base: 'column', md: reverseGrid ? 'row-reverse' : 'row' }}>
        <BackgroundImage
          src={imageUrl || '/images/jpg/best-saller.jpg'}
          className='relative hidden bg-cover bg-no-repeat md:block'
          h={'100%'}
          w={{ base: '100%', md: '25%' }}
          pos={'relative'}
        >
          <Overlay color='#000' opacity={0.5} zIndex={1} />
          <Stack pos={'absolute'} className='inset-0 z-10' p={'lg'}>
            <Box pos='absolute' className='z-[-1]' left={0} top={0} h='100%' w='100%' bg='black' opacity={0.2} />
            <Title order={2} className='font-quicksand text-white'>
              {title || 'Bán chạy nhất hàng ngày'}
            </Title>
            <Text td='underline' fs='italic' size='md' className='text-white' fw={700}>
              {content || 'Ưu đãi độc quyền - Giảm giá 20%'}
            </Text>
            <Title order={3} className='font-quicksand text-white'>
              Mua sắm thoải mái chỉ từ 10.000 VNĐ
            </Title>

            <Text size='md' className='text-white' fw={700}>
              Chỉ trong tuần này. Đừng bỏ lỡ...
            </Text>
            <Button children={'Mua ngay'} radius='xl' w={'max-content'} leftSection={<IconShoppingCart size={16} />} />
          </Stack>
        </BackgroundImage>
        <Tabs
          defaultValue={categories.init.tag}
          value={active}
          onChange={(value: any) => setActive(value)}
          variant='pills'
          classNames={{
            tab: `hover:bg-transparent hover:text-subColor data-[active=true]:bg-transparent data-[active=true]:text-subColor`
          }}
          className='relative'
          h={'100%'}
          p={{ base: 'xs', md: 'lg' }}
          w={{ base: '100%', md: '75%' }}
        >
          <Flex
            align={'center'}
            justify={'flex-end'}
            mb={{ base: 0, md: 20 }}
            direction={{ base: 'column-reverse', sm: 'row', md: 'row' }}
          >
            <Box></Box>
            <TabsList justify='center'>
              <Flex align={'center'}>
                {categories.priorityCategories.map((c, index) => (
                  <Fragment key={c.tag + c.name}>
                    <TabsTab
                      value={c.tag}
                      size={'xl'}
                      onMouseEnter={() => handlePrefetch(c.tag)}
                      onPointerDown={() => handlePrefetch(c.tag)}
                    >
                      <Text size='md' fw={700}>
                        {c.name}
                      </Text>
                    </TabsTab>
                    {index < categories.priorityCategories.length - 1 && (
                      <Text size='xs' p={0} m={0} c={'dimmed'} key={c.tag + c.name + 'text'}>
                        //
                      </Text>
                    )}
                  </Fragment>
                ))}
              </Flex>
            </TabsList>
          </Flex>
          <TabsPanel value={active} mih={320}>
            <TabsPanelCarousel data={products} loading={isLoading} fetching={isFetching} />
          </TabsPanel>

          <Flex align={'center'} justify={'center'} mt={30}>
            <Link href={`/thuc-don?loai=${loai}`}>
              <Button
                children={'Xem tất cả'}
                variant='outline'
                radius={'xl'}
                rightSection={<IconChevronRightFilled size={16} />}
                classNames={{
                  section: 'ml-[4px]'
                }}
              />
            </Link>
          </Flex>
        </Tabs>
      </Flex>
    </Card>
  );
};
