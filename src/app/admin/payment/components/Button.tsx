'use client';

import { ActionIcon, Button, Modal, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import CreatePayment from './form/CreatePayment';
import UpdatePayment from './form/UpdatePayment';

export function CreatePaymentButton() {
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
        title={<Title order={2}>Tạo phương thức thanh toán</Title>}
      >
        <CreatePayment setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function UpdatePaymentButton({ id }: { id: string }) {
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
        title={<Title order={2}>Cập nhật phương thức thanh toán</Title>}
      >
        <UpdatePayment paymentId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeletePaymentButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.Payment.delete.useMutation();

  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          confirmDelete({
            id: { id },
            mutationDelete,
            entityName: 'hình thức thanh toán',
            callback: () => {
              utils.Payment.invalidate();
            }
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
