'use client';

import {
  Code,
  Divider,
  Group,
  Popover,
  ScrollAreaAutosize,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  UnstyledButton
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconVariable } from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import fields from '~/constants/fields-db.json';

interface TemplateTextareaProps {
  name: string;
  control: any;
  label?: string;
}

export function TemplateTextarea({ name, control, label }: TemplateTextareaProps) {
  const [opened, setOpened] = useState(false);
  const [setKey, setSearchKey] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [deboucedSearchKey] = useDebouncedValue(setKey, 300);

  const allVars = useMemo(() => {
    return Object.entries(fields).flatMap(([group, groupFields]) =>
      Array.isArray(groupFields) ? groupFields.map(f => `${group}.${f}`) : []
    );
  }, []);

  const initialVars = useMemo(() => {
    return allVars.slice(0, 5);
  }, [allVars]);

  useEffect(() => {
    if (deboucedSearchKey) {
      const filtered = allVars.filter(v => v.toLowerCase().includes(deboucedSearchKey.toLowerCase()));
      setSuggestions(filtered);
    }
  }, [deboucedSearchKey]);

  const detectTrigger = (value: string) => {
    const cursor = textareaRef.current?.selectionStart ?? 0;
    const before = value.slice(0, cursor);
    const match = before.match(/{{\s*([\w.]*)$/);

    if (match) {
      const query = match?.[1]?.toLowerCase() || deboucedSearchKey;

      if (!query) {
        setSuggestions(initialVars);
      } else {
        const filtered = allVars.filter(v => v.toLowerCase().includes(query));
        setSuggestions(filtered.slice(0, 10));
      }
      setOpened(true);
    } else {
      setOpened(false);
    }
  };

  const handleSelectSuggestion = (s: string, fieldOnChange: (val: string) => void, fieldValue: string) => {
    const cursor = textareaRef.current?.selectionStart ?? 0;
    const before = fieldValue.slice(0, cursor).replace(/{{[\w.]*$/, '{{' + s + '}}');
    const after = fieldValue.slice(cursor);
    const newValue = before + after;

    fieldOnChange(newValue);
    setOpened(false);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursor = before.length;
        textareaRef.current.setSelectionRange(newCursor, newCursor);
      }
    }, 0);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Stack>
          <Popover opened={opened} width={580} position='bottom-start' withArrow shadow='lg' radius='md'>
            <Popover.Target>
              <Textarea
                {...field}
                label={label}
                autosize
                minRows={4}
                placeholder='Nhập template, ví dụ: Xin chào {{user.name}}...'
                ref={node => {
                  textareaRef.current = node;
                  field.ref(node);
                }}
                onChange={e => {
                  field.onChange(e.currentTarget.value);
                  detectTrigger(e.currentTarget.value);
                }}
              />
            </Popover.Target>

            <Popover.Dropdown p='sm'>
              <Stack gap='xs'>
                <Group justify='space-between' align='center'>
                  <Stack gap={2}>
                    <Text size='xs' fw={600} c='dimmed' tt='uppercase'>
                      Gợi ý biến động
                    </Text>
                    <Group>
                      <Group align='center' gap={8}>
                        <div className='h-2 w-2 rounded-full bg-mainColor'></div>
                        <Text size='xs'>Thực thể</Text>
                      </Group>
                      <Group align='center' gap={8}>
                        <div className='h-2 w-2 rounded-full bg-red-500'></div>
                        <Text size='xs'>Trường dữ liệu</Text>
                      </Group>
                    </Group>
                  </Stack>
                  <Stack gap={2}>
                    <Text size='xs' fw={600} c='red'>
                      *** Khuyến khích dùng thanh tìm kiếm ***
                    </Text>
                    <TextInput
                      onChange={v => setSearchKey(v.target.value)}
                      size='xs'
                      py={0}
                      w={300}
                      placeholder='Đối tượng (vd: user, category,...) ...'
                      rightSection={<IconSearch size={12} />}
                    />
                  </Stack>
                </Group>
                <Divider size='xs' />

                <ScrollAreaAutosize mah={180} scrollbarSize={5}>
                  <Stack gap={4} pr={'xs'}>
                    {suggestions.length === 0 ? (
                      <Text size='xs' c='dimmed' ta='center' py='xs'>
                        Không tìm thấy biến phù hợp
                      </Text>
                    ) : (
                      suggestions.map(s => (
                        <UnstyledButton
                          key={s}
                          onClick={() => handleSelectSuggestion(s, field.onChange, field.value)}
                          style={theme => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: '6px 10px',
                            borderRadius: theme.radius.sm,
                            transition: 'background-color 0.15s ease',
                            '&:hover': {
                              backgroundColor: theme.colors.gray[1]
                            }
                          })}
                        >
                          <Group gap='xs'>
                            <ThemeIcon size='sm' variant='light' color='blue' radius='sm'>
                              <IconVariable size={14} />
                            </ThemeIcon>
                            <Group gap={2}>
                              {s.split('.').map((item, index) => (
                                <Text key={index} size='sm' fw={500} c={index === 0 ? 'primary' : 'red'}>
                                  {item}
                                  {index === 0 ? ' .' : ''}
                                </Text>
                              ))}
                            </Group>
                          </Group>
                          <Code c='dimmed' fz={10}>
                            &#123;&#123;{s}&#125;&#125;
                          </Code>
                        </UnstyledButton>
                      ))
                    )}
                  </Stack>
                </ScrollAreaAutosize>
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </Stack>
      )}
    />
  );
}
