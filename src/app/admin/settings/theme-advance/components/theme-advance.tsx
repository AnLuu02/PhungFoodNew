'use client';

import { Box, Divider, Paper, Select, Slider, Switch, Text, Title } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { ThemeConfig } from '~/types/theme';

export const ThemeAdvance = ({ theme, setTheme }: { theme: ThemeConfig; setTheme: (theme: ThemeConfig) => void }) => {
  const shadowOptions = [
    { name: 'None', value: 'none' },
    { name: 'Small', value: 'small' },
    { name: 'Medium', value: 'medium' },
    { name: 'Large', value: 'large' }
  ];

  const buttonStyleOptions = [
    { name: 'Rounded', value: 'rounded' },
    { name: 'Square', value: 'square' },
    { name: 'Pill', value: 'pill' }
  ];
  return (
    <>
      <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
        <Box mb={'xl'}>
          <Title order={4} className='flex items-center gap-2 font-quicksand'>
            <IconSettings className='h-5 w-5' />
            Kích thước bố cục
          </Title>
          <Text fw={600} size={'sm'} c={'dimmed'}>
            Tinh chỉnh khoảng cách và kích thước
          </Text>
        </Box>
        <Box className='space-y-6'>
          <Box className='space-y-3'>
            <Text size='sm' fw={600}>
              Chiều cao tiêu đề: {theme.headerHeight}px
            </Text>
            <Slider
              size={'sm'}
              value={theme.headerHeight}
              onChange={value => setTheme({ ...theme, headerHeight: value })}
              step={5}
              className='w-full'
            />
          </Box>

          <Box className='space-y-3'>
            <Text size='sm' fw={600}>
              Chiều rộng thanh bên: {theme.sidebarWidth}px
            </Text>
            <Slider
              size={'sm'}
              value={theme.sidebarWidth}
              onChange={value => setTheme({ ...theme, sidebarWidth: value })}
              step={10}
              className='w-full'
            />
          </Box>

          <Box className='space-y-3'>
            <Text size='sm' fw={600}>
              Phần đệm nội dung: {theme.contentPadding}px
            </Text>
            <Slider
              size={'sm'}
              value={theme.contentPadding}
              onChange={value => setTheme({ ...theme, contentPadding: value })}
              step={4}
              className='w-full'
            />
          </Box>
        </Box>
      </Paper>

      <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
        <Box mb={'xl'}>
          <Title order={4} className='font-quicksand'>
            Hiệu ứng hình ảnh
          </Title>
          <Text fw={600} size={'sm'} c={'dimmed'}>
            Cấu hình bóng đổ và kiểu nút
          </Text>
        </Box>
        <Box className='space-y-6'>
          <Box className='space-y-2'>
            <Select
              label='Card Shadow'
              value={theme.cardShadow}
              onChange={value => setTheme({ ...theme, cardShadow: value! })}
              data={shadowOptions.map((option: any) => ({
                value: option.value,
                label: option.name
              }))}
            />
          </Box>

          <Box className='space-y-2'>
            <Select
              value={theme.buttonStyle}
              label='Button Style'
              onChange={value => setTheme({ ...theme, buttonStyle: value! })}
              data={buttonStyleOptions.map((option: any) => ({
                value: option.value,
                label: option.name
              }))}
            />
          </Box>

          <Divider />

          <Box className='space-y-4'>
            <Box className='flex items-center justify-between'>
              <Box className='space-y-1'>
                <Text fw={600}>Animations</Text>
                <Text size='sm' c={'dimmed'}>
                  Cho phép chuyển tiếp và hoạt ảnh mượt mà
                </Text>
              </Box>
              <Switch
                checked={theme.animations}
                onChange={event => setTheme({ ...theme, animations: event.target.checked })}
              />
            </Box>

            <Divider />

            <Box className='flex items-center justify-between'>
              <Box className='space-y-1'>
                <Text fw={600}>Độ tương phản cao</Text>
                <Text size='sm' c={'dimmed'}>
                  Cải thiện khả năng truy cập với độ tương phản cao hơn
                </Text>
              </Box>
              <Switch
                checked={theme.highContrast}
                onChange={event => setTheme({ ...theme, highContrast: event.target.checked })}
              />
            </Box>

            <Divider />

            <Box className='flex items-center justify-between'>
              <Box className='space-y-1'>
                <Text fw={600}>Giảm chuyển động</Text>
                <Text size='sm' c={'dimmed'}>
                  Giảm thiểu hoạt ảnh để dễ truy cập
                </Text>
              </Box>
              <Switch
                checked={theme.reducedMotion}
                onChange={event => setTheme({ ...theme, reducedMotion: event.target.checked })}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </>
  );
};
