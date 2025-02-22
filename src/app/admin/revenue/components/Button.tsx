'use client';

import { ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

export function DeleteRevenueButton({ id }: { id: string }) {
  return (
    <>
      <ActionIcon variant='subtle' color='red' onClick={() => {}}>
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
