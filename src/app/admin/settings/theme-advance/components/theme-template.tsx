'use client';

import { Badge, Box, Button, Card, Group, Modal, Paper, Select, Switch, Text, Title } from '@mantine/core';
import { IconCopy, IconEdit, IconPalette, IconStar, IconStarOff, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { ThemeConfig, ThemeTemplate } from '~/types/theme';

export const ThemeTemplateSection = ({
  templates,
  currentTemplate,
  theme,
  setTheme,
  setCurrentTemplate,
  setTemplates,
  setIsEditDialogOpen,
  setEditingTemplate,
  setEditTemplateName,
  setEditTemplateDescription,
  setEditTemplateCategory
}: {
  templates: ThemeTemplate[];
  currentTemplate: string;
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  setCurrentTemplate: (templateId: string) => void;
  setTemplates: (templates: ThemeTemplate[]) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  setEditingTemplate: (templateId: string) => void;
  setEditTemplateName: (name: string) => void;
  setEditTemplateDescription: (description: string) => void;
  setEditTemplateCategory: (category: string) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setDeleteTemplateName: (name: string) => void;
  setDeleteTemplateId: (id: string) => void;
}) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ThemeTemplate | null>(null);
  const filteredTemplates = templates.filter(template => {
    const categoryMatch = filterCategory === 'All' || template.category === filterCategory;
    const favoriteMatch = !showFavoritesOnly || template.isFavorite;
    return categoryMatch && favoriteMatch;
  });
  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCurrentTemplate(templateId);
      setTheme(template.theme);
      NotifySuccess('Template applied', `${template.name} theme has been applied.`);
    }
  };
  const handleToggleFavorite = (templateId: string) => {
    setTemplates(templates.map(t => (t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t)));
  };
  const handleDuplicateTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const duplicatedTemplate: ThemeTemplate = {
        ...template,
        id: `duplicate-${Date.now()}`,
        name: `${template.name} Copy`,
        isDefault: false,
        isFavorite: false,
        createdAt: new Date().toISOString().split('T')[0] as string
      };

      setTemplates([...templates, duplicatedTemplate]);
      NotifyError('Template duplicated', `${duplicatedTemplate.name} has been created.`);
    }
  };
  const handleEditTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template && !template.isDefault) {
      setEditingTemplate(templateId);
      setEditTemplateName(template.name);
      setEditTemplateDescription(template.description);
      setEditTemplateCategory(template.category);
      setTheme(template.theme);
      setCurrentTemplate(templateId);
      setIsEditDialogOpen(true);
    } else if (template?.isDefault) {
      NotifyError('Cannot edit', 'Default templates cannot be edited. Create a copy to customize.');
    }
  };
  const handleUpdateCurrentTemplate = () => {
    const template = templates.find(t => t.id === currentTemplate);
    if (template && !template.isDefault) {
      setTemplates(templates.map(t => (t.id === currentTemplate ? { ...t, theme: { ...theme } } : t)));
      NotifySuccess('Template updated', `${template.name} has been updated with current settings.`);
    } else if (template?.isDefault) {
      NotifyError('Cannot update', 'Default templates cannot be modified. Create a new template instead.');
    }
  };
  const handleDeleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.isDefault) {
      NotifyError('Cannot delete', 'Default templates cannot be deleted.');
      return;
    }

    setTemplates(templates.filter(t => t.id !== templateId));
    if (currentTemplate === templateId) {
      const defaultTemplate = templates.find(t => t.isDefault);
      if (defaultTemplate) {
        handleSelectTemplate(defaultTemplate.id);
      }
    }

    NotifySuccess('Template deleted', `${template?.name} has been removed.`);
  };
  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  return (
    <Paper shadow='md' radius='md' p='lg' withBorder>
      <Group justify='space-between' mb='md'>
        <Group>
          <IconPalette size={20} />
          <Box>
            <Title order={4}>Theme Templates</Title>
            <Text size='sm' c='dimmed'>
              Choose from pre-built templates or create your own
            </Text>
          </Box>
        </Group>
      </Group>

      <Group mb='lg' gap='lg'>
        <Group gap='xs'>
          <Text size='sm'>Category:</Text>
          <Select
            radius='md'
            value={filterCategory}
            onChange={value => setFilterCategory(value || '')}
            data={categories.map(c => ({ value: c, label: c }))}
            w={150}
          />
        </Group>
        <Group gap='xs'>
          <Switch checked={showFavoritesOnly} onChange={event => setShowFavoritesOnly(event.currentTarget.checked)} />
          <Text size='sm'>Favorites only</Text>
        </Group>
      </Group>
      <Box className='grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 md:gap-6'>
        {filteredTemplates.map(template => (
          <Card
            key={template.id}
            withBorder
            shadow={currentTemplate === template.id ? 'md' : 'xs'}
            radius='md'
            onClick={() => handleSelectTemplate(template.id)}
            className={`cursor-pointer ${currentTemplate === template.id ? 'border-2 border-blue-600' : ''} `}
          >
            <Group justify='space-between' align='flex-start'>
              <Box>
                <Group gap='xs'>
                  <Text fw={500} size='sm'>
                    {template.name}
                  </Text>
                  {template.isDefault && (
                    <Badge size='xs' color='gray' variant='light'>
                      Default
                    </Badge>
                  )}
                  {currentTemplate === template.id && (
                    <Badge size='xs' color='blue'>
                      Active
                    </Badge>
                  )}
                </Group>
                <Text size='xs' c='dimmed'>
                  {template.description}
                </Text>
                <Group gap='xs' mt={4}>
                  <Badge size='xs' variant='outline'>
                    {template.category}
                  </Badge>
                  <Text size='xs' c='dimmed'>
                    {template.createdAt}
                  </Text>
                </Group>
              </Box>
              <Button
                className='absolute right-2 top-2 z-10'
                variant='subtle'
                size='xs'
                onClick={e => {
                  e.stopPropagation();
                  handleToggleFavorite(template.id);
                }}
              >
                {template.isFavorite ? <IconStar size={16} color='gold' fill='gold' /> : <IconStarOff size={16} />}
              </Button>
            </Group>

            <Group gap={4} mt='sm'>
              <Box
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: '1px solid #ccc',
                  background: template.theme.primaryColor
                }}
              />
              <Box
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: '1px solid #ccc',
                  background: template.theme.secondaryColor
                }}
              />
              <Box
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: '1px solid #ccc',
                  background: template.theme.accentColor
                }}
              />
            </Group>

            <Group gap='xs' mt='sm'>
              <Button
                size='xs'
                variant='outline'
                leftSection={<IconCopy size={14} />}
                onClick={e => {
                  e.stopPropagation();
                  handleDuplicateTemplate(template.id);
                }}
              >
                Copy
              </Button>
              {!template.isDefault && (
                <Button
                  size='xs'
                  variant='outline'
                  onClick={e => {
                    e.stopPropagation();
                    handleEditTemplate(template.id);
                  }}
                >
                  <IconEdit size={14} />
                </Button>
              )}
              {!template.isDefault && (
                <Button
                  size='xs'
                  variant='outline'
                  color='red'
                  onClick={e => {
                    e.stopPropagation();
                    setDeleteTarget(template as ThemeTemplate);
                    setDeleteOpened(true);
                  }}
                >
                  <IconTrash size={14} />
                </Button>
              )}
            </Group>
          </Card>
        ))}
      </Box>

      {currentTemplate && !templates.find(t => t.id === currentTemplate)?.isDefault && (
        <Group justify='center' mt='lg'>
          <Button variant='outline' leftSection={<IconEdit size={16} />} onClick={handleUpdateCurrentTemplate}>
            Update Current Template
          </Button>
        </Group>
      )}

      <Modal opened={deleteOpened} onClose={() => setDeleteOpened(false)} title='Delete Template' centered>
        <Text mb='sm'>
          Are you sure you want to delete{' '}
          <Text span fw={500}>
            {deleteTarget?.name}
          </Text>
          ? This action cannot be undone.
        </Text>
        <Group justify='flex-end' mt='md'>
          <Button variant='default' onClick={() => setDeleteOpened(false)}>
            Cancel
          </Button>
          <Button
            color='red'
            onClick={() => {
              if (deleteTarget) handleDeleteTemplate(deleteTarget.id);
              setDeleteOpened(false);
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </Paper>
  );
};
