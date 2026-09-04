import { Box, Button, Divider, Flex, Grid, GridCol, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import Reveal from '~/components/Reveal';
import { CategoryProps } from '~/shared/type-trpc/category.type-trpc';
import { api } from '~/trpc/server';
import ProductCardCarouselHorizontal from '../../Card/CardProductCarouselHorizontal';

export const MultiCategoryListSection = async ({ categories }: { categories: CategoryProps }) => {
  const data = await api.Product.getGroupedByCategories({
    categoryIds: categories.priorityCategories.map(({ id }) => id),
    limit: 6
  });

  if (!data) return null;

  return (
    <Grid
      mt={{
        base: 'xl',
        xs: 0
      }}
      mih={500}
    >
      {data.map(({ categoryId, products }) => {
        const category = categories.priorityCategories.find(({ id }) => categoryId === id);
        if (!category) return null;
        return (
          <GridCol span={{ base: 12, xs: 6, xl: 4 }}>
            <Grid>
              <GridCol span={12} pos={'relative'}>
                <Flex align={'center'} justify={'space-between'}>
                  <Title
                    pos={'relative'}
                    order={1}
                    className='cursor-pointer font-quicksand font-bold hover:text-mainColor'
                  >
                    {category.name}
                    <Box
                      w={'100%'}
                      h={4}
                      pos={'absolute'}
                      bottom={-5}
                      left={0}
                      className='rounded-full bg-mainColor'
                    ></Box>
                  </Title>
                  <Link href={`/thuc-don?danh-muc=${category.tag}`}>
                    <Button
                      rightSection={<IconArrowRight size={20} />}
                      size='md'
                      variant='transparent'
                      className='text-mainColor duration-200 hover:text-subColor'
                    >
                      Xem thêm
                    </Button>
                  </Link>
                </Flex>
                <Divider />
              </GridCol>
              {products.map((item, index: number) => {
                return (
                  <GridCol span={12} key={index}>
                    <Reveal y={(index + 1) * 2} delay={index * 0.01}>
                      <ProductCardCarouselHorizontal key={index} data={item} />
                    </Reveal>
                  </GridCol>
                );
              })}
            </Grid>
          </GridCol>
        );
      })}
    </Grid>
  );
};
