'use client';

import { Button, Popover } from '@mantine/core';
import { IconMoodSmile } from '@tabler/icons-react';
import { Editor } from '@tiptap/react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useState } from 'react';

export function EmojiPickerButton({ editor }: { editor: Editor | null }) {
  const [opened, setOpened] = useState(false);

  if (!editor) return null;

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    editor.chain().focus().insertContent(emojiData.emoji).run();
    setOpened(false);
  };

  return (
    <Popover opened={opened} onChange={setOpened} position='top-start'>
      <Popover.Target>
        <Button
          size='xs'
          variant='subtle'
          radius='md'
          onClick={() => setOpened(o => !o)}
          classNames={{
            root: `!rounded-md !border-gray-300 !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
          }}
        >
          <IconMoodSmile size={18} />
        </Button>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={350} />
      </Popover.Dropdown>
    </Popover>
  );
}
