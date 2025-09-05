'use client';

import { Badge, Box, Card, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconChefHat, IconClock, IconPlayerPlay, IconUsers } from '@tabler/icons-react';
import Image from 'next/image';
const difficultyColors = {
  Dễ: 'bg-green-100 text-green-800',
  'Trung bình': 'bg-yellow-100 text-yellow-800',
  Khó: 'bg-red-100 text-red-800'
};
export default function RecipeCard({ recipe }: { recipe: any }) {
  return (
    <Card
      shadow='sm'
      radius='md'
      padding={0}
      className='group transform cursor-pointer border-0 transition-all duration-300 hover:shadow-xl'
    >
      <Box className='relative overflow-hidden rounded-t-md'>
        <Image
          src={recipe.image || '/placeholder.svg'}
          alt={recipe.title}
          width={320}
          height={200}
          className='w-full object-cover transition-transform duration-300 group-hover:scale-110'
        />

        <Box className='absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/30'>
          <Box className='flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110'>
            <IconPlayerPlay className='h-6 w-6 fill-current text-orange-600' />
          </Box>
        </Box>

        <Badge color='orange' className='absolute left-3 top-3 text-white'>
          {recipe.category}
        </Badge>

        <Badge variant='light' className='absolute right-3 top-3 bg-white/90 text-gray-700'>
          {recipe.views} lượt xem
        </Badge>

        <Badge
          variant='light'
          size='xs'
          className={`${difficultyColors[recipe.difficulty as keyof typeof difficultyColors]} absolute bottom-3 right-3`}
        >
          {recipe.difficulty}
        </Badge>
      </Box>

      <Stack p={'sm'}>
        <Tooltip label={recipe.title} withArrow>
          <Text
            fw={600}
            size='md'
            lineClamp={2}
            className='line-clamp-2 leading-relaxed text-gray-900 transition-colors group-hover:text-orange-600'
          >
            {recipe.title.length < 40 ? `${recipe.title} - PhungFood dành cho bạn` : recipe.title}
          </Text>
        </Tooltip>

        <Group justify='space-between' gap='xs' className='text-xs text-gray-500'>
          <Group gap={4}>
            <IconClock className='h-3 w-3' />
            <span>{recipe.duration}</span>
          </Group>
          <Group gap={4}>
            <IconUsers className='h-3 w-3' />
            <span>{recipe.servings}</span>
          </Group>
          <Group gap={4}>
            <IconChefHat className='h-3 w-3' />
            <span>⭐ {recipe.rating}</span>
          </Group>
        </Group>

        <Group gap='xs' className='flex flex-wrap'>
          {recipe.tags?.map((tag: string, index: number) => {
            if (index > 3) return null;
            return (
              <Badge key={tag} variant='light' color='gray' size='xs' className='capitalize'>
                {tag}
              </Badge>
            );
          })}
        </Group>
      </Stack>
    </Card>
  );
}
