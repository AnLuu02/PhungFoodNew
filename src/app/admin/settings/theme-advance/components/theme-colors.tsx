'use client';

import { Box, Button, ColorInput, Divider, Paper, Switch, Text, Title } from '@mantine/core';
import { IconPalette } from '@tabler/icons-react';
import { NotifySuccess } from '~/lib/FuncHandler/toast';
import { ThemeConfig } from '~/types/theme';

export const ThemeColors = ({ theme, setTheme }: { theme: ThemeConfig; setTheme: (theme: ThemeConfig) => void }) => {
  const colorPresets = [
    { name: 'Emerald', primary: '#059669', secondary: '#10b981', accent: '#34d399' },
    { name: 'Blue', primary: '#2563eb', secondary: '#3b82f6', accent: '#60a5fa' },
    { name: 'Purple', primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa' },
    { name: 'Rose', primary: '#e11d48', secondary: '#f43f5e', accent: '#fb7185' },
    { name: 'Orange', primary: '#ea580c', secondary: '#f97316', accent: '#fb923c' }
  ];
  const handleColorPreset = (preset: (typeof colorPresets)[0]) => {
    setTheme({
      ...theme,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    });
    NotifySuccess('Color preset applied', `${preset.name} color scheme has been applied.`);
  };
  return (
    <>
      <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
        <Box mb={'xl'}>
          <Title order={4} className='flex items-center gap-2 font-quicksand'>
            <IconPalette className='h-5 w-5' />
            Cài đặt trước màu
          </Title>
          <Text fw={600} size={'sm'} c={'dimmed'}>
            Bảng màu nhanh cho nhà hàng của bạn
          </Text>
        </Box>
        <Box>
          <Box className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {colorPresets.map(preset => (
              <Button
                key={preset.name}
                variant='outline'
                className='h-16 flex-col gap-4 bg-transparent p-3'
                onClick={() => handleColorPreset(preset)}
              >
                <Box className='flex gap-1'>
                  <Box className='h-4 w-4 rounded-full' style={{ backgroundColor: preset.primary }} />
                  <Box className='h-4 w-4 rounded-full' style={{ backgroundColor: preset.secondary }} />
                  <Box className='h-4 w-4 rounded-full' style={{ backgroundColor: preset.accent }} />
                </Box>
                <Text size='sm' ml={'xs'}>
                  {preset.name}
                </Text>
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>

      <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
        <Box mb={'xl'}>
          <Title order={4} className='font-quicksand'>
            Màu tùy chỉnh
          </Title>
          <Text fw={600} size={'sm'} c={'dimmed'}>
            Tinh chỉnh màu sắc thương hiệu của bạn
          </Text>
        </Box>
        <Box className='space-y-6'>
          <Box className='grid gap-4 sm:grid-cols-2'>
            <ColorInput label='Primary Color' value={theme.primaryColor} />

            <ColorInput label='Secondary Color' value={theme.secondaryColor} />

            <ColorInput label='Accent Color' value={theme.accentColor} />

            <ColorInput label='Background Color' value={theme.backgroundColor} />
          </Box>

          <Divider />

          <Box className='flex items-center justify-between'>
            <Box className='space-y-1'>
              <Text fw={600}>Chế độ tối</Text>
              <Text size='sm' c='dimmed'>
                Bật chủ đề tối cho nhà hàng của bạn
              </Text>
            </Box>
            <Switch
              checked={theme.darkMode}
              onChange={event => setTheme({ ...theme, darkMode: event.target.checked })}
            />
          </Box>
        </Box>
      </Paper>
    </>
  );
};
