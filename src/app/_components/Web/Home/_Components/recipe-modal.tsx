'use client';

import { AspectRatio, Badge, Group, Image, List, Modal, ScrollAreaAutosize, Stack, Text } from '@mantine/core';
import { IconChefHat, IconClock, IconListCheck, IconVideo } from '@tabler/icons-react';

interface RecipeModalProps {
  recipe: {
    title: string;
    image: string;
    duration: string;
    category: string;
    ingredients?: string[];
    steps?: string[];
    videoId?: string;
  };
  opened: boolean;
  onClose: () => void;
}

export function RecipeModal({ recipe, opened, onClose }: any) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size='60%'
      title={
        <Text fw={700} size='lg'>
          {recipe.title}
        </Text>
      }
      scrollAreaComponent={ScrollAreaAutosize}
      transitionProps={{
        duration: 200
      }}
    >
      <Stack>
        <Image loading='lazy' src={recipe.image} h={300} alt={recipe.title} radius='md' />

        <Group gap='xs'>
          <Badge variant='light' color='blue' leftSection={<IconClock size={14} />}>
            {recipe.duration}
          </Badge>
          <Badge variant='light' leftSection={<IconChefHat size={14} />}>
            {recipe.category}
          </Badge>
        </Group>

        {recipe.videoId && (
          <div>
            <Text fw={600} size='lg' className='mb-2 flex items-center gap-2'>
              <IconVideo size={20} />
              Video hướng dẫn
            </Text>
            <AspectRatio ratio={16 / 9}>
              <iframe
                src={`https://www.youtube.com/embed/${recipe.videoId}`}
                title='YouTube video player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            </AspectRatio>
          </div>
        )}

        {recipe.ingredients && (
          <div>
            <Text fw={600} size='lg' className='mb-2 flex items-center gap-2'>
              <IconListCheck size={20} />
              Nguyên liệu
            </Text>
            <List>
              {recipe.ingredients.map((ingredient: any, index: any) => (
                <List.Item key={index}>{ingredient}</List.Item>
              ))}
            </List>
          </div>
        )}

        {recipe.steps && (
          <div>
            <Text fw={600} size='lg' className='mb-2 flex items-center gap-2'>
              <IconChefHat size={20} />
              Các bước thực hiện
            </Text>
            <List type='ordered'>
              {recipe.steps.map((step: any, index: any) => (
                <List.Item key={index}>{step}</List.Item>
              ))}
            </List>
          </div>
        )}
      </Stack>
    </Modal>
  );
}
