'use client';

import { Box, Button, Modal, Select, Text, TextInput } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { ThemeConfig, ThemeTemplate } from '~/types/theme';

export const CreateTheme = ({
  theme,
  templates,
  setTemplates
}: {
  theme: ThemeConfig;
  templates: ThemeTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<ThemeTemplate[]>>;
}) => {
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState('Custom');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) {
      NotifyError('Name required', 'Please enter a name for your template.');
      return;
    }

    const newTemplate: ThemeTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplateName,
      description: newTemplateDescription || 'Custom theme template',
      category: newTemplateCategory,
      isFavorite: false,
      isDefault: false,
      createdAt: new Date().toISOString().split('T')[0] as string,
      theme: { ...theme }
    };
    setTemplates([...templates, newTemplate]);
    setNewTemplateName('');
    setNewTemplateDescription('');
    setNewTemplateCategory('Custom');
    setIsCreateDialogOpen(false);
    NotifySuccess('Template created', `${newTemplate.name} has been saved as a new template.`);
  };
  return (
    <>
      <Button variant='outline' leftSection={<IconPlus size={16} />} onClick={() => setIsCreateDialogOpen(true)}>
        Tạo mẫu
      </Button>
      <Modal
        opened={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        title='Create New Theme Template'
        classNames={{
          content: 'max-w-lg'
        }}
      >
        <Text size='sm' className='mb-4 text-gray-500 dark:text-dark-text'>
          Lưu cài đặt chủ đề hiện tại của bạn dưới dạng mẫu mới
        </Text>

        <Box className='space-y-4'>
          <Box className='space-y-2'>
            <label htmlFor='template-name' className='text-sm font-medium text-gray-700 dark:text-dark-text'>
              Tên mẫu
            </label>
            <TextInput
              id='template-name'
              value={newTemplateName}
              onChange={e => setNewTemplateName(e.currentTarget.value)}
              placeholder='My Custom Theme'
            />
          </Box>

          <Box className='space-y-2'>
            <label htmlFor='template-description' className='text-sm font-medium text-gray-700 dark:text-dark-text'>
              Mô tả (Tùy chọn)
            </label>
            <TextInput
              id='template-description'
              value={newTemplateDescription}
              onChange={e => setNewTemplateDescription(e.currentTarget.value)}
              placeholder='A beautiful theme for my restaurant'
            />
          </Box>

          <Box className='space-y-2'>
            <label htmlFor='template-category' className='text-sm font-medium text-gray-700 dark:text-dark-text'>
              Loại
            </label>
            <Select
              id='template-category'
              value={newTemplateCategory}
              onChange={e => setNewTemplateCategory(e as string)}
              placeholder='Select category'
              data={[
                { value: 'Custom', label: 'Custom' },
                { value: 'Modern', label: 'Modern' },
                { value: 'Classic', label: 'Classic' },
                { value: 'Elegant', label: 'Elegant' },
                { value: 'Casual', label: 'Casual' }
              ]}
            />
          </Box>
        </Box>

        <Box className='mt-6 flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setIsCreateDialogOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleCreateTemplate}>Tạo mẫu</Button>
        </Box>
      </Modal>
    </>
  );
};
