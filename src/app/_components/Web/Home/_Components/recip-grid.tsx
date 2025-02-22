'use client';

import { Badge, Card, Grid, Group, Image, Text } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { useState } from 'react';
import { RecipeModal } from './recipe-modal';

const recipes = [
  {
    title: 'Cách làm mandu thịt, mandu kim chi và mandu rau củ',
    image: '/images/temp/ot hiem.png',
    duration: "30'",
    category: 'Trung bình',
    ingredients: [
      '300g thịt băm',
      '200g kim chi',
      '1 củ cà rốt',
      '2 cây hành lá',
      'Vỏ bánh mandu',
      'Gia vị: muối, tiêu, dầu mè'
    ],
    steps: [
      'Thịt băm trộn đều với gia vị, để khoảng 15 phút cho ngấm',
      'Cà rốt băm nhỏ, hành lá thái nhỏ',
      'Trộn đều thịt với rau củ',
      'Cho nhân vào giữa vỏ bánh, gấp đôi và dán mép',
      'Hấp bánh trong 15 phút là được'
    ],
    videoId: 'UPcT-I7D8Ic' // Example YouTube video ID
  },
  {
    title: 'Cách làm bánh tráng dừa mè nướng',
    image: '/images/temp/xa lach.png',
    duration: '1h',
    category: 'Trung bình',
    ingredients: ['Bánh tráng', 'Dừa nạo', 'Mè đen', 'Đường cát', 'Muối'],
    steps: [
      'Trộn dừa nạo với đường và một chút muối',
      'Rắc hỗn hợp dừa và mè lên bánh tráng',
      'Nướng bánh trên bếp than hoặc bếp gas đến khi giòn'
    ],
    videoId: 'z2jgI0OQcsE' // Example YouTube video ID
  },
  {
    title: 'Cách làm bánh xoài đào Jollibee',
    image: '/images/temp/ot hiem.png',
    duration: "25'",
    category: 'Trung bình',
    ingredients: [],
    steps: [],
    videoId: 'vtrSVA_6EFY' // Example YouTube video ID
  },
  {
    title: 'Cách làm bánh xèo vịt miền Tây',
    image: '/images/temp/ot hiem.png',
    duration: '1h',
    category: 'Trung bình',
    ingredients: [],
    steps: [],
    videoId: 'lJmBwDYY12k' // Example YouTube video ID
  }
];

export function RecipeGrid() {
  const [selectedRecipe, setSelectedRecipe] = useState<(typeof recipes)[0] | null>(null);

  return (
    <>
      <Grid gutter='md'>
        {recipes.map(recipe => (
          <Grid.Col key={recipe.title} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              shadow='sm'
              padding='lg'
              radius='md'
              withBorder
              className='h-full cursor-pointer transition-shadow hover:shadow-md'
              onClick={() => setSelectedRecipe(recipe)}
            >
              <Card.Section>
                <Image loading='lazy' src={recipe.image} h={160} alt={recipe.title} />
              </Card.Section>

              <Text fw={500} size='lg' mt='md' lineClamp={2}>
                {recipe.title}
              </Text>

              <Group mt='md' gap='xs'>
                <Badge variant='light' color='blue' leftSection={<IconClock size={14} />}>
                  {recipe.duration}
                </Badge>
                <Badge variant='light'>{recipe.category}</Badge>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <RecipeModal
        recipe={selectedRecipe || recipes[0]}
        opened={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </>
  );
}
