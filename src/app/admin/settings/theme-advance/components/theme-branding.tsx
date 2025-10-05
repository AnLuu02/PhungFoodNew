'use client';

import { Box, Paper, Select, Text, TextInput, Title } from '@mantine/core';
import { IconBrush } from '@tabler/icons-react';
import { ThemeConfig } from '~/types/theme';

export const ThemeBranding = ({ theme, setTheme }: { theme: ThemeConfig; setTheme: (theme: ThemeConfig) => void }) => {
  const navigationStyleOptions = [
    { name: 'Sidebar', value: 'sidebar' },
    { name: 'Top Bar', value: 'topbar' },
    { name: 'Hybrid', value: 'hybrid' }
  ];

  return (
    <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
      <Box mb={'md'}>
        <Title order={4} className='flex items-center gap-2 font-quicksand'>
          <IconBrush className='h-5 w-5' />
          Brand Assets
        </Title>
        <Text fw={600} size={'sm'} c={'dimmed'}>
          Upload and manage your restaurant's branding elements
        </Text>
      </Box>
      <Box className='grid grid-cols-2 gap-4'>
        <TextInput
          label='Logo URL'
          value={theme.logoUrl}
          onChange={e => setTheme({ ...theme, logoUrl: e.target.value })}
          placeholder='https://example.com/logo.png'
        />

        <TextInput
          label='Favicon URL'
          value={theme.favicon}
          onChange={e => setTheme({ ...theme, favicon: e.target.value })}
          placeholder='https://example.com/favicon.ico'
        />

        <Select
          label='Logo Position'
          value={theme.logoPosition}
          onChange={value => setTheme({ ...theme, logoPosition: value! })}
          data={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' }
          ]}
        />

        <Select
          label='Navigation Style'
          value={theme.navigationStyle}
          onChange={value => setTheme({ ...theme, navigationStyle: value! })}
          data={navigationStyleOptions.map((option: any) => ({
            value: option.value,
            label: option.name
          }))}
        />
      </Box>
    </Paper>
  );
};
