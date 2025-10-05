'use client';

import { Box, Button, Divider, Paper, Slider, Text, Title } from '@mantine/core';
import { IconLayout } from '@tabler/icons-react';
import { ThemeConfig } from '~/types/theme';

export const ThemeLayout = ({ theme, setTheme }: { theme: ThemeConfig; setTheme: (theme: ThemeConfig) => void }) => {
  const layoutOptions = [
    { name: 'Modern', value: 'modern', description: 'Clean and minimal design' },
    { name: 'Classic', value: 'classic', description: 'Traditional restaurant style' },
    { name: 'Elegant', value: 'elegant', description: 'Sophisticated and refined' },
    { name: 'Casual', value: 'casual', description: 'Friendly and approachable' }
  ];
  return (
    <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
      <Box mb={'md'}>
        <Title order={4} className='flex items-center gap-2 font-quicksand'>
          <IconLayout className='h-5 w-5' />
          Tùy chọn bố cục
        </Title>
        <Text fw={600} size={'sm'} c={'dimmed'}>
          Chọn phong cách thiết kế tổng thể cho nhà hàng của bạn
        </Text>
      </Box>
      <Box className='space-y-6'>
        <Box className='grid gap-4 sm:grid-cols-2'>
          {layoutOptions.map(layout => (
            <Button
              radius={'md'}
              key={layout.value}
              variant={theme.layout === layout.value ? 'default' : 'outline'}
              className='h-20 flex-col gap-2 p-4'
              onClick={() => setTheme({ ...theme, layout: layout.value })}
            >
              <span className=''>{layout.name}</span>
              <span className='text-muted-foreground text-xs'>{layout.description}</span>
            </Button>
          ))}
        </Box>

        <Divider />

        <Box className='space-y-3'>
          <Text size='sm' fw={600}>
            Border Radius: {theme.borderRadius}px
          </Text>
          <Slider
            size={'sm'}
            value={theme.borderRadius}
            onChange={value => setTheme({ ...theme, borderRadius: value })}
            step={1}
            className='w-full'
          />
        </Box>

        <Box className='grid gap-4 sm:grid-cols-3'>
          <Box
            className='border-1 rounded-lg border border-solid border-gray-400 bg-gray-200 p-4'
            style={{ borderRadius: theme.borderRadius }}
          >
            <Box
              className='mb-2 h-4 w-full rounded bg-mainColor'
              style={{ borderRadius: theme.borderRadius / 2 }}
            ></Box>
            <Box className='h-3 w-3/4 rounded bg-mainColor/80' style={{ borderRadius: theme.borderRadius / 2 }}></Box>
          </Box>
          <Box
            className='border-1 rounded-lg border border-solid border-gray-400 bg-gray-200 p-4'
            style={{ borderRadius: theme.borderRadius }}
          >
            <Box className='mb-2 h-4 w-full rounded bg-subColor' style={{ borderRadius: theme.borderRadius / 2 }}></Box>
            <Box className='h-3 w-2/3 rounded bg-subColor/80' style={{ borderRadius: theme.borderRadius / 2 }}></Box>
          </Box>
          <Box
            className='border-1 rounded-lg border border-solid border-gray-400 bg-gray-200 p-4'
            style={{ borderRadius: theme.borderRadius }}
          >
            <Box
              className='mb-2 h-4 w-full rounded bg-mainColor'
              style={{ borderRadius: theme.borderRadius / 2 }}
            ></Box>
            <Box className='h-3 w-1/2 rounded bg-subColor' style={{ borderRadius: theme.borderRadius / 2 }}></Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
