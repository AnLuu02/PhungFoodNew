'use client';

import { Box, ColorInput, Paper, Select, Slider, Text, Title } from '@mantine/core';
import { IconTypography } from '@tabler/icons-react';
import { ThemeConfig } from '~/types/theme';

export const ThemeTypography = ({
  theme,
  setTheme
}: {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}) => {
  const fontOptions = [
    { name: 'Inter', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Poppins', value: 'Poppins' }
  ];

  return (
    <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
      <Box mb={'md'}>
        <Title order={4} className='flex items-center gap-2 font-quicksand'>
          <IconTypography className='h-5 w-5' />
          Cài đặt kiểu chữ
        </Title>
        <Text fw={600} size={'sm'} c={'dimmed'}>
          Tùy chỉnh phông chữ và giao diện văn bản
        </Text>
      </Box>
      <Box className='space-y-6'>
        <Box className='space-y-2'>
          <Select
            value={theme.fontFamily}
            label='Font Family'
            onChange={value => setTheme({ ...theme, fontFamily: value! })}
            data={fontOptions.map((font: any) => ({
              value: font.value,
              label: font.name
            }))}
            renderOption={({ option }) => <Box style={{ fontFamily: option.value }}>{option.label}</Box>}
          />
        </Box>

        <Box className='space-y-3'>
          <Text size='sm' fw={600}>
            Cỡ chữ cơ bản: {theme.fontSize}px
          </Text>
          <Slider
            size={'sm'}
            value={theme.fontSize}
            onChange={value => setTheme({ ...theme, fontSize: value })}
            step={1}
            className='w-full'
          />
        </Box>

        <ColorInput label='Text Color' value={theme.textColor} />

        <Paper withBorder radius={'md'} p={'lg'}>
          <Title
            className='mb-2 font-quicksand text-lg'
            style={{ fontFamily: theme.fontFamily, fontSize: theme.fontSize + 4, color: theme.textColor }}
          >
            Tiêu đề mẫu
          </Title>
          <Text style={{ fontFamily: theme.fontFamily, fontSize: theme.fontSize, color: theme.textColor }}>
            Đây là cách văn bản của bạn sẽ xuất hiện với cài đặt kiểu chữ hiện tại. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </Text>
        </Paper>
      </Box>
    </Paper>
  );
};
