'use client';

import { ActionIcon, Modal, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import { confirmDelete } from '~/lib/ButtonHandler/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import CreatePayment from './form/CreatePayment';
import UpdatePayment from './form/UpdatePayment';

export function CreatePaymentButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <BButton leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </BButton>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        size={'xl'}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo phương thức thanh toán
          </Title>
        }
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
        size={'xl'}
        title={
          <Title order={2} className='font-quicksand'>
            Cập nhật phương thức thanh toán
          </Title>
        }
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
