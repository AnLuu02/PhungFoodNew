'use client';

import { Button, FileButton, Group } from '@mantine/core';
import { IconPaperclip } from '@tabler/icons-react';
import { Dispatch, SetStateAction } from 'react';

export function AttachmentButton({ files, setFiles }: { files: File[]; setFiles: Dispatch<SetStateAction<File[]>> }) {
  const handleFiles = (selected: File[]) => {
    setFiles(prev => [...prev, ...selected]);
  };

  return (
    <div>
      <Group gap='xs'>
        <FileButton onChange={handleFiles} multiple>
          {props => (
            <Button
              {...props}
              size='xs'
              variant='subtle'
              leftSection={<IconPaperclip size={14} />}
              radius='md'
              classNames={{
                root: `!rounded-md !border-gray-300 !font-bold text-black hover:bg-mainColor/10 dark:text-dark-text`
              }}
            >
              Đính kèm
            </Button>
          )}
        </FileButton>
      </Group>
    </div>
  );
}
