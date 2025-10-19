'use client';

import { Group, Select } from '@mantine/core';
import { useState } from 'react';

const MANTINE_FONT_SIZES: Record<string, string> = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '28px',
  '4xl': '32px'
};

function FontSizeControl({ editor }: { editor: any }) {
  const [mantineSize, setMantineSize] = useState<keyof typeof MANTINE_FONT_SIZES>('md');

  if (!editor) return null;

  const applyFontSize = (sizeKey: keyof typeof MANTINE_FONT_SIZES) => {
    const pxValue = MANTINE_FONT_SIZES[sizeKey];

    editor.chain().focus();

    if (editor.state.selection.empty) {
      editor.commands.setMark('textStyle', { fontSize: pxValue });
    } else {
      editor.commands.setFontSize(pxValue);
    }

    editor.chain().run();
  };

  return (
    <Group gap='xs' align='center'>
      <Select
        size='xs'
        radius='md'
        data={Object.keys(MANTINE_FONT_SIZES).map(key => ({
          value: key,
          label: `${key} (${MANTINE_FONT_SIZES[key]})`
        }))}
        value={mantineSize}
        onChange={val => {
          if (!val) return;
          setMantineSize(val as keyof typeof MANTINE_FONT_SIZES);
          applyFontSize(val as keyof typeof MANTINE_FONT_SIZES);
        }}
        w={140}
      />
    </Group>
  );
}

export default FontSizeControl;
