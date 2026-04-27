'use client';

import { ActionIcon, Button, Modal, ScrollAreaAutosize, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { confirmDelete } from '~/lib/ButtonHandler/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import ProductUpsert from './form/ProductUpsert';

export function CreateProductButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal
        closeOnClickOutside={false}
        scrollAreaComponent={ScrollAreaAutosize}
        fullScreen
        zIndex={150}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo sản phẩm
          </Title>
        }
      >
        <ProductUpsert setOpened={setOpened} />
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
        closeOnClickOutside={false}
        scrollAreaComponent={ScrollAreaAutosize}
        zIndex={150}
        fullScreen
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Cập nhật mặc hàng
          </Title>
        }
      >
        <ProductUpsert productId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteProductButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.Product.delete.useMutation();

  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          confirmDelete({
            id: { id },
            mutationDelete,
            entityName: 'sản phẩm',
            callback: () => {
              utils.Product.invalidate();
            }
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
