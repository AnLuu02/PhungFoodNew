'use client';

import { Box, Button, Modal, Select, Switch, Text, TextInput, Title } from '@mantine/core';
import { useState } from 'react';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { ThemeConfig, ThemeTemplate } from '~/types/theme';

export const EditTheme = ({
  theme,
  templates,
  setTemplates,
  setTheme
}: {
  theme: ThemeConfig;
  templates: ThemeTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<ThemeTemplate[]>>;
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
}) => {
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTemplateName, setEditTemplateName] = useState('');
  const [editTemplateDescription, setEditTemplateDescription] = useState('');
  const [editTemplateCategory, setEditTemplateCategory] = useState('');

  const handleSaveTemplateEdit = () => {
    if (!editTemplateName.trim()) {
      NotifyError('Name required', 'Please enter a name for your template.');
      return;
    }

    if (editingTemplate) {
      setTemplates(
        templates.map(t =>
          t.id === editingTemplate
            ? {
                ...t,
                name: editTemplateName,
                description: editTemplateDescription,
                category: editTemplateCategory,
                theme: { ...theme }
              }
            : t
        )
      );
      setIsEditDialogOpen(false);
      setEditingTemplate(null);
      setEditTemplateName('');
      setEditTemplateDescription('');
      setEditTemplateCategory('');
      NotifySuccess('Template updated', `Template has been successfully updated.`);
    }
  };

  return (
    <>
      <Modal
        opened={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title='Edit Theme Template'
        size='xl'
        centered
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        classNames={{
          body: 'max-h-[90vh] overflow-y-auto'
        }}
      >
        <Text size='sm' className='mb-4 text-gray-500 dark:text-dark-text'>
          Sửa đổi cài đặt mẫu và cấu hình chủ đề
        </Text>

        <Box className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <Box className='space-y-4'>
            <Title order={3} className='font-quicksand'>
              Thông tin mẫu
            </Title>
            <Box className='space-y-2'>
              <label htmlFor='edit-template-name' className='text-sm font-medium'>
                Tên mẫu
              </label>
              <TextInput
                id='edit-template-name'
                radius='md'
                value={editTemplateName}
                onChange={e => setEditTemplateName(e.currentTarget.value)}
                placeholder='Template name'
              />
            </Box>

            <Box className='space-y-2'>
              <label htmlFor='edit-template-description' className='text-sm font-medium'>
                Mô tả
              </label>
              <TextInput
                id='edit-template-description'
                radius='md'
                value={editTemplateDescription}
                onChange={e => setEditTemplateDescription(e.currentTarget.value)}
                placeholder='Template description'
              />
            </Box>

            <Box className='space-y-2'>
              <label htmlFor='edit-template-category' className='text-sm font-medium'>
                Loại
              </label>
              <Select
                id='edit-template-category'
                radius='md'
                value={editTemplateCategory}
                onChange={e => setEditTemplateCategory(e || '')}
                data={[
                  { value: 'Custom', label: 'Custom' },
                  { value: 'Modern', label: 'Modern' },
                  { value: 'Classic', label: 'Classic' },
                  { value: 'Elegant', label: 'Elegant' },
                  { value: 'Casual', label: 'Casual' }
                ]}
                placeholder='Select category'
              />
            </Box>
          </Box>

          <Box className='space-y-4'>
            <Title order={3} className='font-quicksand'>
              Cài đặt nhanh
            </Title>
            <Box className='grid grid-cols-2 gap-4'>
              <Box className='space-y-2'>
                <label className='text-sm font-medium'>Màu cơ bản</label>
                <Box className='flex gap-2'>
                  <input
                    type='color'
                    value={theme.primaryColor}
                    onChange={e => setTheme({ ...theme, primaryColor: e.target.value })}
                    className='h-10 w-12 rounded border p-1'
                  />
                  <TextInput
                    value={theme.primaryColor}
                    onChange={e => setTheme({ ...theme, primaryColor: e.currentTarget.value })}
                    radius='md'
                    placeholder='#059669'
                    className='flex-1'
                  />
                </Box>
              </Box>

              <Box className='space-y-2'>
                <label className='text-sm font-medium'>Màu phụ</label>
                <Box className='flex gap-2'>
                  <input
                    type='color'
                    value={theme.secondaryColor}
                    onChange={e => setTheme({ ...theme, secondaryColor: e.target.value })}
                    className='h-10 w-12 rounded border p-1'
                  />
                  <TextInput
                    value={theme.secondaryColor}
                    onChange={e => setTheme({ ...theme, secondaryColor: e.currentTarget.value })}
                    placeholder='#10b981'
                    radius='md'
                    className='flex-1'
                  />
                </Box>
              </Box>

              <Box className='space-y-2'>
                <Select
                  label='Font Family'
                  radius='md'
                  value={theme.fontFamily}
                  w={200}
                  onChange={value => setTheme({ ...theme, fontFamily: value! })}
                  data={[
                    { value: 'Inter', label: 'Inter' },
                    { value: 'Roboto', label: 'Roboto' },
                    { value: 'Montserrat', label: 'Montserrat' },
                    { value: 'Poppins', label: 'Poppins' },
                    { value: 'Open Sans', label: 'Open Sans' }
                  ]}
                  placeholder='Select font'
                />
              </Box>

              <Box className='space-y-2'>
                <label className='text-sm font-medium'>Kiểu bố cục</label>
                <Select
                  value={theme.layout}
                  radius='md'
                  onChange={value => setTheme({ ...theme, layout: value! })}
                  data={[
                    { value: 'modern', label: 'Modern' },
                    { value: 'classic', label: 'Classic' },
                    { value: 'elegant', label: 'Elegant' },
                    { value: 'casual', label: 'Casual' }
                  ]}
                  placeholder='Select layout'
                />
              </Box>
            </Box>

            <Box className='flex items-center gap-2'>
              <Switch
                id='edit-dark-mode'
                checked={theme.darkMode}
                onChange={e => setTheme({ ...theme, darkMode: e.currentTarget.checked })}
                label='Dark Mode'
              />
            </Box>
          </Box>
        </Box>

        <Box className='mt-6 flex justify-end gap-2'>
          <Button variant='default' onClick={() => setIsEditDialogOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSaveTemplateEdit}>Lưu thay đổi</Button>
        </Box>
      </Modal>
    </>
  );
};
