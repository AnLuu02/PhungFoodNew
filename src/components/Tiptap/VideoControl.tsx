'use client';

import {
  Combobox,
  ComboboxDropdown,
  ComboboxOption,
  ComboboxOptions,
  ComboboxTarget,
  InputBase,
  useCombobox
} from '@mantine/core';
import { Editor } from '@tiptap/react';
import { useState } from 'react';

const fontOptions = [
  { value: 'sans-serif', label: 'Sans Serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'Arial Black, Gadget, sans-serif', label: 'Wide' },
  { value: 'Arial Narrow, sans-serif', label: 'Narrow' },
  { value: '"Comic Sans MS", cursive, sans-serif', label: 'Comic Sans MS' },
  { value: 'Garamond, serif', label: 'Garamond' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Tahoma, sans-serif', label: 'Tahoma' },
  { value: '"Trebuchet MS", sans-serif', label: 'Trebuchet MS' },
  { value: 'Verdana, sans-serif', label: 'Verdana' }
];
export const FontFamilyControl = ({ editor }: { editor: Editor | null }) => {
  const [font, setFont] = useState('sans-serif');
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  });
  return (
    <Combobox
      store={combobox}
      withinPortal={false}
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
          radius={'md'}
          w={150}
          style={{ textAlign: 'left' }}
          onClick={() => combobox.toggleDropdown()}
        >
          <span style={{ fontFamily: font }}>{fontOptions.find(f => f.value === font)?.label}</span>
        </InputBase>
      </ComboboxTarget>

      <ComboboxDropdown>
        <ComboboxOptions>
          {fontOptions.map(item => (
            <ComboboxOption
              key={item.value}
              value={item.value}
              onClick={() => {
                setFont(item.value);
                editor?.chain().focus().setFontFamily(item.value).run();
                combobox.closeDropdown();
              }}
            >
              <span style={{ fontFamily: item.value }}>{item.label}</span>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </ComboboxDropdown>
    </Combobox>
  );
};
