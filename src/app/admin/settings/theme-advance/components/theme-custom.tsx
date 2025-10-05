'use client';

import { Box, Paper, Text, Textarea, Title } from '@mantine/core';
import { ThemeConfig } from '~/types/theme';

export const ThemeCustom = ({ theme, setTheme }: { theme: ThemeConfig; setTheme: (theme: ThemeConfig) => void }) => {
  return (
    <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
      <Box mb={'md'}>
        <Title order={4} className='font-quicksand'>
          Custom CSS
        </Title>
        <Text fw={600} size={'sm'} c={'dimmed'}>
          Thêm các kiểu CSS của riêng bạn để tùy chỉnh thêm giao diện nhà hàng của bạn
        </Text>
      </Box>
      <Box className='space-y-4'>
        <Box className='space-y-2'>
          <Textarea
            value={theme.customCSS}
            minRows={5}
            autosize
            onChange={e => setTheme({ ...theme, customCSS: e.target.value })}
            placeholder={`/* Add your custom CSS here */
                                     .custom-header {
                                       background: linear-gradient(45deg, #059669, #10b981);
                                     }
   
                                     .custom-button {
                                       border-radius: 25px;
                                       box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
                                     }`}
            className='min-h-[200px] font-mono text-sm'
          />
        </Box>
        <Text size='sm' c={'dimmed'} className='text-center'>
          Use CSS selectors to target specific elements. Changes will be applied in real-time to the preview.
        </Text>
      </Box>
    </Paper>
  );
};
