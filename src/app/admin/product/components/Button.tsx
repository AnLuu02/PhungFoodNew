'use client';

import { ActionIcon, Button, Modal, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { handleDelete } from '~/app/lib/utils/button-handle/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import CreateProduct from './form/CreateProduct';
import UpdateProduct from './form/UpdateProduct';

export function CreateProductButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal size={'xl'} opened={opened} onClose={() => setOpened(false)} title={<Title order={2}>Tạo sản phẩm</Title>}>
        <CreateProduct setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function UpdateProductButton({ id }: { id: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        size={'xl'}
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Cập nhật danh mục</Title>}
      >
        <UpdateProduct productId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteProductButton({ id }: { id: string }) {
  const untils = api.useUtils();
  const deleteMutation = api.Product.delete.useMutation();

  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          handleDelete({ id }, deleteMutation, 'Sản phẩm', () => {
            untils.Product.invalidate();
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
