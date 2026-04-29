'use client';

import { ActionIcon, Button, Group, Select, Text } from '@mantine/core';
import { ImageType } from '@prisma/client';
import { IconTrash, IconX } from '@tabler/icons-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onDelete: () => void;
  onClearSelection: () => void;
  bulkUpdateTypeMutation: any;
  imageTypeOptions: Array<{ value: string; label: string }>;
}

export default function BulkActionsBar({
  selectedCount,
  onDelete,
  onClearSelection,
  bulkUpdateTypeMutation,
  imageTypeOptions
}: BulkActionsBarProps) {
  return (
    <Group p='xs' mb='lg' justify='space-between' className='flex rounded-full bg-[#f3f4f6] p-1 dark:bg-dark-card'>
      <Text fw={500} className='w-[max-content] rounded-full bg-white dark:bg-dark-dimmed' p={'sm'}>
        {selectedCount} hình ảnh đã được chọn
      </Text>
      <Group px={'md'}>
        <Select
          placeholder='Thay đổi kiểu'
          data={imageTypeOptions}
          searchable
          onChange={value => {
            if (value) {
              bulkUpdateTypeMutation.mutate({
                imageIds: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(
                  el => (el.parentElement?.parentElement as any)?.dataset.imageId
                ),
                newType: value as ImageType
              });
            }
          }}
          disabled={bulkUpdateTypeMutation.isPending}
        />

        <Button variant='danger' onClick={onDelete} leftSection={<IconTrash size={16} />}>
          Xóa bỏ
        </Button>

        <ActionIcon variant='default' onClick={onClearSelection}>
          <IconX size={16} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
