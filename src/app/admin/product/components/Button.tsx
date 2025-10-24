'use client';

import { ActionIcon, Modal, ScrollAreaAutosize, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import CreateProduct from './form/CreateProduct';
import UpdateProduct from './form/UpdateProduct';

export function CreateProductButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <BButton leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </BButton>
      <Modal
        closeOnClickOutside={false}
        scrollAreaComponent={ScrollAreaAutosize}
        fullScreen
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo sản phẩm
          </Title>
        }
      >
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
        closeOnClickOutside={false}
        scrollAreaComponent={ScrollAreaAutosize}
        fullScreen
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Cập nhật mặc hàng
          </Title>
        }
      >
        <UpdateProduct productId={id.toString()} setOpened={setOpened} />
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
