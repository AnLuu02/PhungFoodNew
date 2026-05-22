'use client';

import { Badge, Box, Flex, Group, Image, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { Product } from './Chatbox';

export function FoodCard({ product }: { product: Product }) {
  const hasDiscount = !!product.discount && product.discount > 0;

  return (
    <UnstyledButton
      component='a'
      href={product.url}
      target='_blank'
      className='mt-2 w-full overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-mainColor hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900'
    >
      <Flex gap='sm' p='xs'>
        <Image
          src={product.image}
          alt={product.name}
          w={86}
          h={86}
          radius='lg'
          className='shrink-0 object-cover'
          fallbackSrc='/images/jpg/food-placeholder.jpg'
        />

        <Box className='min-w-0 flex-1'>
          <Group justify='space-between' gap={6} wrap='nowrap'>
            <Text size='sm' fw={700} lineClamp={1}>
              {product.name}
            </Text>

            {hasDiscount && (
              <Badge color='red' variant='filled' size='sm'>
                Sale
              </Badge>
            )}
          </Group>

          <Group gap={6} mt={6}>
            {hasDiscount && (
              <Text size='xs' td='line-through' c='dimmed'>
                {product.price.toLocaleString('vi-VN')}đ
              </Text>
            )}

            <Text size='sm' fw={800} className='text-mainColor'>
              {product.finalPrice.toLocaleString('vi-VN')}đ
            </Text>
          </Group>

          <Group justify='space-between' mt={10}>
            <Text size='xs' c='dimmed'>
              Bấm để xem chi tiết
            </Text>

            <ThemeIcon size='sm' radius='xl' className='bg-mainColor'>
              <IconChevronRight size={14} />
            </ThemeIcon>
          </Group>
        </Box>
      </Flex>
    </UnstyledButton>
  );
}
