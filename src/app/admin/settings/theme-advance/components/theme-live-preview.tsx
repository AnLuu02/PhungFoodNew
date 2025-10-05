'use client';

import { Badge, Box, Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconDeviceMobile, IconDeviceTablet, IconEye, IconHeartRateMonitor } from '@tabler/icons-react';
import { useState } from 'react';
import { ThemeConfig } from '~/types/theme';

export const ThemeLivePreview = ({ theme }: { theme: ThemeConfig }) => {
  const [previewDevice, setPreviewDevice] = useState('desktop');

  return (
    <>
      <Box className='space-y-6'>
        <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
          <Stack gap={2} mb='md'>
            <Group gap='sm'>
              <IconEye className='h-5 w-5' />
              <Title order={4} className='font-quicksand'>
                Xem trước
              </Title>
            </Group>
            <Text c='dimmed' size='sm'>
              Xem những thay đổi của bạn theo thời gian thực
            </Text>
          </Stack>
          <Box className='space-y-4'>
            <Box className='flex gap-2'>
              <Button
                variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setPreviewDevice('desktop')}
              >
                <IconHeartRateMonitor className='h-4 w-4' />
              </Button>
              <Button
                variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setPreviewDevice('tablet')}
              >
                <IconDeviceTablet className='h-4 w-4' />
              </Button>
              <Button
                variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setPreviewDevice('mobile')}
              >
                <IconDeviceMobile className='h-4 w-4' />
              </Button>
            </Box>

            <Box className='border-1 rounded-lg border border-solid border-gray-400 bg-gray-200 p-4'>
              <Box
                className='space-y-4 rounded-lg p-4'
                style={{
                  backgroundColor: theme.backgroundColor,
                  fontFamily: theme.fontFamily,
                  fontSize: theme.fontSize,
                  borderRadius: theme.borderRadius
                }}
              >
                <Box
                  className='flex h-8 items-center rounded px-3'
                  style={{
                    backgroundColor: theme.primaryColor,
                    borderRadius: theme.borderRadius
                  }}
                >
                  <span className='text-sm font-medium text-white'>Tiêu đề nhà hàng</span>
                </Box>

                <Box className='space-y-2'>
                  <Title style={{ color: theme.textColor, fontSize: theme.fontSize + 2 }} className='font-quicksand'>
                    Chào mừng đến với nhà hàng của chúng tôi
                  </Title>
                  <Text style={{ color: theme.textColor, fontSize: theme.fontSize - 1 }} className='text-sm'>
                    Trải nghiệm hương vị đích thực và dịch vụ đặc biệt trong bầu không khí ấm cúng của chúng tôi.
                  </Text>
                </Box>

                <Box className='flex gap-2'>
                  <Box
                    className='rounded px-3 py-1 text-sm text-white'
                    style={{
                      backgroundColor: theme.secondaryColor,
                      borderRadius: theme.borderRadius / 2
                    }}
                  >
                    Đặt hàng ngay
                  </Box>
                  <Box
                    className='rounded px-3 py-1 text-sm text-white'
                    style={{
                      backgroundColor: theme.accentColor,
                      borderRadius: theme.borderRadius / 2
                    }}
                  >
                    Xem thực đơn
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box className='text-center'>
              <Badge variant='outline'>Chế độ xem trước</Badge>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};
