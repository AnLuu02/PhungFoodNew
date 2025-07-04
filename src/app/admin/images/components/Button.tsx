'use client';

import { ActionIcon, Button, FileButton } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { handleDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { api } from '~/trpc/react';

export function CreateImageButton() {
  return (
    <FileButton onChange={files => {}} accept='image/png,image/jpeg'>
      {props => (
        <Button leftSection={<IconPlus />} {...props}>
          Upload Image
        </Button>
      )}
    </FileButton>
  );
}

export function DeleteImageButton({ id }: { id: string }) {
  const untils = api.useUtils();
  const deleteMutation = api.Image.delete.useMutation();

  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          handleDelete({ id }, deleteMutation, 'Ảnh', () => {
            untils.Image.invalidate();
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
