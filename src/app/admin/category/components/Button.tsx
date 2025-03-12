'use client';

import { ActionIcon, Button, Modal, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { handleDelete } from '~/app/lib/utils/button-handle/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import CreateCategory from './form/CreateCategory';
import UpdateCategory from './form/UpdateCategory';

export function CreateCategoryButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Tạo danh mục</Title>}
      >
        <CreateCategory setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function UpdateCategoryButton({ id }: { id: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Cập nhật danh mục</Title>}
      >
        <UpdateCategory categoryId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteCategoryButton({ id }: { id: string }) {
  const untils = api.useUtils();
  const deleteMutation = api.Category.delete.useMutation();
  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          handleDelete({ id }, deleteMutation, 'Danh mục', () => {
            untils.Category.invalidate();
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
