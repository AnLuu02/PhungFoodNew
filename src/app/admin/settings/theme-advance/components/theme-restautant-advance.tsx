'use client';

import { Box, Group, Paper, Stack, Tabs, TabsList, TabsPanel, TabsTab, Text, Title } from '@mantine/core';
import { IconPalette } from '@tabler/icons-react';
import { useState } from 'react';
import { dataThemes } from '~/lib/data-test/theme';
import { ThemeConfig, ThemeTemplate } from '~/types/theme';
import { CreateTheme } from './control/create-theme';
import { EditTheme } from './control/edit-theme';
import { ExportTheme } from './control/export-theme';
import { ImportTheme } from './control/import-theme';
import { ResetTheme } from './control/reset-theme';
import { SaveTheme } from './control/save-theme';
import { ThemeAdvance } from './theme-advance';
import { ThemeBranding } from './theme-branding';
import { ThemeColors } from './theme-colors';
import { ThemeCustom } from './theme-custom';
import { ThemeLayout } from './theme-layout';
import { ThemeLivePreview } from './theme-live-preview';
import { ThemeTypography } from './theme-typography';

export default function ThemeManagementAdvance() {
  const [currentTemplate, setCurrentTemplate] = useState<string>('default');
  const [templates, setTemplates] = useState<ThemeTemplate[]>([...dataThemes]);

  const [theme, setTheme] = useState<ThemeConfig>(
    templates.find(t => t.id === currentTemplate)?.theme || templates[0]?.theme!
  );
  return (
    <Paper withBorder p='md' radius='md'>
      <Box className='flex items-center justify-between'>
        <Box mb={'xl'}>
          <Title className='flex items-center gap-2 font-quicksand' order={3}>
            <IconPalette size={20} />
            Quản lý chủ đề
          </Title>
          <Text fw={600} size={'sm'} c={'dimmed'}>
            Tùy chỉnh giao diện trực quan và thương hiệu của nhà hàng của bạn
          </Text>
        </Box>
        <Group gap='sm'>
          <CreateTheme theme={theme} templates={templates} setTemplates={setTemplates} />

          <EditTheme theme={theme} templates={templates} setTemplates={setTemplates} setTheme={setTheme} />

          <ExportTheme theme={theme} />

          <ImportTheme theme={theme} setTheme={setTheme} />

          <ResetTheme templates={templates} setTheme={setTheme} />

          <SaveTheme theme={theme} setTheme={setTheme} />
        </Group>
      </Box>

      <Stack gap={'xl'}>
        <Box className='grid gap-6 lg:grid-cols-3'>
          <Box className='space-y-6 lg:col-span-2'>
            <Tabs
              defaultValue='colors'
              className='space-y-6'
              variant='pills'
              styles={{
                tab: {
                  border: '1px solid ',
                  marginRight: 6
                }
              }}
              classNames={{
                tab: `!rounded-md !border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`,
                list: 'rounded-md bg-gray-100 p-1 dark:bg-dark-card'
              }}
            >
              <TabsList className='grid w-full grid-cols-6'>
                <TabsTab value='colors'>Màu sắc</TabsTab>
                <TabsTab value='typography'>Kiểu chữ</TabsTab>
                <TabsTab value='layout'>Bố cục</TabsTab>
                <TabsTab value='branding'>Thương hiệu</TabsTab>
                <TabsTab value='advanced'>Nâng cao</TabsTab>
                <TabsTab value='custom'>Custom CSS</TabsTab>
              </TabsList>
              <TabsPanel value='colors' className='space-y-6'>
                <ThemeColors theme={theme} setTheme={setTheme} />
              </TabsPanel>

              <TabsPanel value='typography' className='space-y-6'>
                <ThemeTypography theme={theme} setTheme={setTheme} />
              </TabsPanel>

              <TabsPanel value='layout' className='space-y-6'>
                <ThemeLayout theme={theme} setTheme={setTheme} />
              </TabsPanel>

              <TabsPanel value='branding' className='space-y-6'>
                <ThemeBranding theme={theme} setTheme={setTheme} />
              </TabsPanel>

              <TabsPanel value='advanced' className='space-y-6'>
                <ThemeAdvance theme={theme} setTheme={setTheme} />
              </TabsPanel>

              <TabsPanel value='custom' className='space-y-6'>
                <ThemeCustom theme={theme} setTheme={setTheme} />
              </TabsPanel>
            </Tabs>
          </Box>

          <ThemeLivePreview theme={theme} />
        </Box>
      </Stack>
    </Paper>
  );
}
