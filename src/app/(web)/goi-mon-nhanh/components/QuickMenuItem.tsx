'use client';

import { Badge, Box, Button, Flex, Group, Image, NumberInput, Paper, Text } from '@mantine/core';
import { ImageType } from '@prisma/client';
import { IconPlus, IconShoppingCartPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { FindInfiniteProduct } from '~/shared/type-trpc/product.type-trpc';

export const QuickMenuItem = ({
  product,
  index,
  onAdd
}: {
  product: FindInfiniteProduct['items'][number];
  index: number;
  onAdd: (quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState<number | string>(1);

  const price = Number(product?.price || 0);
  const discount = Number(product?.discount || 0);
  const finalPrice = discount > 0 ? price - discount : price;

  return (
    <Paper
      p='sm'
      className='group border border-slate-200 bg-slate-50/70 transition duration-200 hover:border-mainColor/30 hover:bg-white hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/[0.07]'
      style={{
        animationDuration: `${(index % 10) * 0.04 + 0.35}s`
      }}
    >
      <Flex gap='md' align='center' direction={{ base: 'column', sm: 'row' }}>
        <Box className='relative h-[130px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[92px] sm:w-[112px]'>
          <Image
            src={
              getImageProduct(product?.imageForEntities || [], ImageType.THUMBNAIL) ||
              '/images/jpg/food-placeholder.jpg'
            }
            alt={product?.name || 'Món ăn'}
            className='h-full w-full object-cover transition duration-300 group-hover:scale-105'
          />

          {discount > 0 && (
            <Badge size='xs' radius='xl' className='absolute left-2 top-2 bg-red-500 text-white'>
              Giảm
            </Badge>
          )}
        </Box>

        <Box className='min-w-0 flex-1'>
          <Group gap='xs' mb={4}>
            <Text fw={900} lineClamp={1} className='text-base text-slate-950 dark:text-white'>
              {product?.name || 'Đang cập nhật'}
            </Text>

            {product?.rating ? (
              <Badge size='xs' radius='xl' variant='light' className='bg-amber-100 text-amber-700'>
                {product.rating}★
              </Badge>
            ) : null}
          </Group>

          <Text size='sm' c='dimmed' lineClamp={2} className='leading-6'>
            {product?.description || 'Món ăn phù hợp để thêm nhanh vào giỏ và thanh toán ngay.'}
          </Text>

          <Group gap='xs' mt={8}>
            <Text fw={900} className='text-lg text-mainColor'>
              {formatPriceLocaleVi(finalPrice)}
            </Text>

            {discount > 0 && (
              <Text size='sm' td='line-through' c='dimmed'>
                {formatPriceLocaleVi(price)}
              </Text>
            )}
          </Group>
        </Box>

        <Box className='w-full shrink-0 sm:w-[180px]'>
          <Group gap='xs' justify='flex-end' wrap='nowrap'>
            <NumberInput
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={99}
              w={74}
              size='sm'
              classNames={{
                input: 'text-center font-bold'
              }}
            />

            <Button
              size='sm'
              leftSection={<IconPlus size={16} />}
              onClick={() => onAdd(Number(quantity || 1))}
              className='bg-mainColor text-white hover:bg-mainColor'
            >
              Thêm
            </Button>
          </Group>

          <Button
            mt='xs'
            fullWidth
            size='xs'
            variant='subtle'
            leftSection={<IconShoppingCartPlus size={15} />}
            onClick={() => onAdd(1)}
            className='text-mainColor hover:bg-mainColor/10'
          >
            Thêm nhanh 1 phần
          </Button>
        </Box>
      </Flex>
    </Paper>
  );
};
