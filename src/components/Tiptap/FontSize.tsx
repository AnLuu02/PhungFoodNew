'use client';

import {
  Combobox,
  ComboboxDropdown,
  ComboboxOption,
  ComboboxOptions,
  ComboboxTarget,
  Group,
  InputBase,
  useCombobox
} from '@mantine/core';
import { Editor } from '@tiptap/react';
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

function FontSizeControl({ editor }: { editor: Editor | null }) {
  const [mantineSize, setMantineSize] = useState<keyof typeof MANTINE_FONT_SIZES>('md');
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  });

  if (!editor) return null;

  const applyFontSize = (sizeKey: keyof typeof MANTINE_FONT_SIZES) => {
    const pxValue = MANTINE_FONT_SIZES[sizeKey];
    editor.chain().focus();

    if (editor.state.selection.empty) {
      editor.commands.setMark('textStyle', { fontSize: pxValue });
    } else {
      editor.commands.setFontSize(pxValue as string);
    }

    editor.chain().run();
  };

  return (
    <Group gap='xs' align='center'>
      <Combobox
        store={combobox}
        withinPortal={false}
        width={300}
        transitionProps={{
          duration: 200,
          transition: 'fade-down'
        }}
      >
        <ComboboxTarget>
          <InputBase
            component='button'
            pointer
            type='button'
            size='xs'
            radius='md'
            onClick={() => combobox.toggleDropdown()}
          >
            {`${mantineSize} (${MANTINE_FONT_SIZES[mantineSize]})`}
          </InputBase>
        </ComboboxTarget>

        <ComboboxDropdown w={'max-content'}>
          <ComboboxOptions>
            {Object.keys(MANTINE_FONT_SIZES).map(key => (
              <ComboboxOption
                key={key}
                value={key}
                onClick={() => {
                  setMantineSize(key as keyof typeof MANTINE_FONT_SIZES);
                  applyFontSize(key as keyof typeof MANTINE_FONT_SIZES);
                  combobox.closeDropdown();
                }}
              >
                <span
                  style={{
                    fontSize: MANTINE_FONT_SIZES[key]
                  }}
                >
                  {key} ({MANTINE_FONT_SIZES[key]}) {key === 'md' && '(mặc định)'}
                </span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </ComboboxDropdown>
      </Combobox>
    </Group>
  );
}

export default FontSizeControl;
