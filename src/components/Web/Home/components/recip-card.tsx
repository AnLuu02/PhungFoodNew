'use client';

import { Badge, Box, Card, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconChefHat, IconClock, IconPlayerPlay, IconUsers } from '@tabler/icons-react';
import Image from 'next/image';
import { useModal } from '~/contexts/ModalContext';
const difficultyColors = {
  Dễ: 'bg-green-100 text-green-800',
  'Trung bình': 'bg-yellow-100 text-yellow-800',
  Khó: 'bg-red-100 text-red-800'
};
export default function RecipeCard({ data }: any) {
  const { openModal } = useModal();
  return (
    <Card
      shadow='sm'
      radius='md'
      padding={0}
      className='group transform cursor-pointer transition-all duration-300 hover:shadow-xl'
      pos={'relative'}
      onClick={() => {
        openModal('recipe', null, data);
      }}
    >
      <Box className='relative overflow-hidden rounded-t-md'>
        <Image
          src={data.image || '/placeholder.svg'}
          alt={data.title}
          width={320}
          height={200}
          className='w-full object-cover transition-transform duration-300 group-hover:scale-110'
        />

        <Box className='absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/30'>
          <Box className='flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110'>
            <IconPlayerPlay className='h-6 w-6 fill-current text-mainColor' />
          </Box>
        </Box>

        <Badge className='absolute left-3 top-3 bg-mainColor text-white'>{data.category}</Badge>

        <Badge variant='light' className='absolute right-3 top-3 bg-white/90 text-gray-700 dark:text-white'>
          {data.views} lượt xem
        </Badge>

        <Badge
          variant='light'
          size='lg'
          className={`${difficultyColors[data.difficulty as keyof typeof difficultyColors]} absolute bottom-3 right-3`}
        >
          {data.difficulty}
        </Badge>
      </Box>

      <Stack p={'sm'}>
        <Tooltip label={data.title} withArrow>
          <Text
            fw={600}
            size='md'
            lineClamp={2}
            className='line-clamp-2 leading-relaxed text-gray-900 transition-colors group-hover:text-mainColor dark:text-white'
          >
            {data.title.length < 40 ? `${data.title} - PhungFood dành cho bạn` : data.title}
          </Text>
        </Tooltip>

        <Group justify='space-between' gap='xs' className='text-xs text-gray-500 dark:text-white'>
          <Group gap={4}>
            <IconClock className='h-3 w-3' />
            <span>{data.duration}</span>
          </Group>
          <Group gap={4}>
            <IconUsers className='h-3 w-3' />
            <span>{data.servings}</span>
          </Group>
          <Group gap={4}>
            <IconChefHat className='h-3 w-3' />
            <span>⭐ {data.rating}</span>
          </Group>
        </Group>

        <Group gap='xs' className='flex flex-wrap'>
          {data.tags?.map((tag: string, index: number) => {
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
