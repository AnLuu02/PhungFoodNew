'use client';

import { ActionIcon, Button, Modal, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import CreateSubCategory from './form/CreateSubCategory';
import UpdateSubCategory from './form/UpdateSubCategory';

export function CreateSubCategoryButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal
        closeOnClickOutside={false}
        size={'xl'}
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Tạo danh mục</Title>}
      >
        <CreateSubCategory setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function UpdateSubCategoryButton({ id }: { id: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        closeOnClickOutside={false}
        size={'xl'}
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Cập nhật danh mục</Title>}
      >
        <UpdateSubCategory subCategoryId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteSubCategoryButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.SubCategory.delete.useMutation();

  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          confirmDelete({
            id: { id },
            mutationDelete,
            entityName: 'danh mục con',
            callback: () => {
              utils.SubCategory.invalidate();
            }
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
