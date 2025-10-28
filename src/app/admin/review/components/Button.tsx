'use client';

import { ActionIcon, Modal, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import { confirmDelete } from '~/lib/ButtonHandler/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import CreateReview from './form/CreateReview';
import UpdateReview from './form/UpdateReview';

export function CreateReviewButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <BButton leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </BButton>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo đánh giá
          </Title>
        }
      >
        <CreateReview setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function UpdateReviewButton({ id }: { id: string }) {
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
        title={
          <Title order={2} className='font-quicksand'>
            Cập nhật đánh giá
          </Title>
        }
      >
        <UpdateReview reviewId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteReviewButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.Review.delete.useMutation();

  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          confirmDelete({
            id: { id },
            mutationDelete,
            entityName: 'đánh giá',
            callback: () => {
              utils.Review.invalidate();
            }
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
