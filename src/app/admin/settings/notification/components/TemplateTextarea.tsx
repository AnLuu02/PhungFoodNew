'use client';

import { Button, Popover, Stack, Textarea } from '@mantine/core';
import { useRef, useState } from 'react';
import { Control, Controller } from 'react-hook-form';

interface TemplateTextareaProps {
  name: string;
  control: Control<any>;
  label?: string;
}
const variableSources = {
  user: ['id', 'name', 'email'],
  order: ['id', 'status', 'total']
};

export function TemplateTextarea({ name, control, label }: TemplateTextareaProps) {
  const [opened, setOpened] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const detectTrigger = (value: string) => {
    const cursor = textareaRef.current?.selectionStart ?? 0;
    const before = value.slice(0, cursor);
    const match = before.match(/{{\s*([\w]*)$/);
    if (match) {
      const allVars = Object.entries(variableSources).flatMap(([group, fields]) => fields.map(f => `${group}.${f}`));
      setSuggestions(allVars);
      setOpened(true);
    } else {
      setOpened(false);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Stack>
          <Popover opened={opened} width={260} position='bottom-start' withArrow shadow='md'>
            <Popover.Target>
              <Textarea
                {...field}
                label={label}
                autosize
                minRows={4}
                placeholder='Nhập template, ví dụ: Xin chào {{user.name}}...'
                ref={textareaRef}
                onChange={e => {
                  field.onChange(e.currentTarget.value);
                  detectTrigger(e.currentTarget.value);
                }}
              />
            </Popover.Target>

            <Popover.Dropdown>
              <Stack gap='xs'>
                {suggestions.map(s => (
                  <Button
                    key={s}
                    variant='subtle'
                    size='xs'
                    fullWidth
                    onClick={() => {
                      const cursor = textareaRef.current?.selectionStart ?? 0;
                      const before = field.value.slice(0, cursor).replace(/{{[\w.]*$/, '{{' + s + '}}');
                      const after = field.value.slice(cursor);
                      const newValue = before + after;
                      field.onChange(newValue);
                      setOpened(false);
                      setTimeout(() => textareaRef.current?.focus(), 0);
                    }}
                    style={{ justifyContent: 'flex-start' }}
                  >
                    {s}
                  </Button>
                ))}
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </Stack>
      )}
    />
  );
}
